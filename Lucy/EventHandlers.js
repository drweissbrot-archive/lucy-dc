class EventHandlers {
	onMessage (msg) {
		// cancel if user is a bot
		if (msg.author.bot) {
			return
		}

		// convert to lowercase
		msg.content = msg.content.toLowerCase()

		// manually trigger command for good night wishes
		if (msg.content.includes('gute nacht') || msg.content.includes('nachti')) {
			return this.cmd.handleCommand('nacht', msg)
		}

		// check if prefixed
		if (! this.cmd.isPrefixed(msg)) {
			return
		}

		// parse to command
		const cmd = this.cmd.parseMessageToCommand(msg)

		// check if registered command
		if (! this.cmd.isCommand(cmd)) {
			return
		}

		// hand over
		return this.cmd.handleCommand(this, cmd, msg)
	}

	onReady () {
		// save the channel object
		this.channel = this.bot.channels.get(this.cfg.channel_id)

		// listen for messages
		// wait 5 seconds before that for data to be fetched
		this.bot.removeListener('message', this.eventHandlers.onMessage)
		this.bot.clearTimeout(this.cache.messageListenerTimeout)

		this.cache.messageListenerTimeout = this.bot.setTimeout(() => {
			console.info('Now accepting commands')

			this.bot.on('message', (msg) => {
				this.eventHandlers.onMessage.call(this, msg)
			})
		}, 5000)

		// every 10 seconds: update song data
		this.bot.clearInterval(this.cache.updateSongMetaInterval)
		this.cache.updateSongMetaInterval = this.bot.setInterval(() => {
			this.services.updateSongMeta.call(this)
		}, 10000)

		// every 60 seconds: update event data
		this.bot.clearInterval(this.cache.updateShowDataInterval)
		this.cache.updateShowDataInterval = this.bot.setInterval(() => {
			this.services.updateShowData.call(this)
		}, 60000)

		// run services once to get started
		this.services.updateSongMeta.call(this)
		this.services.updateShowData.call(this)

		return console.info('Logged in and started up')
	}
}

module.exports = EventHandlers
