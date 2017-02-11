class EventHandlers {
	onMessage (msg) {
		// cancel if user is a bot or message was sent in private
		if (msg.author.bot || msg.channel.type == 'dm') {
			return
		}

		// convert to lowercase
		msg.content = msg.content.toLowerCase()

		// manually trigger command for good night wishes
		// only send this message once every five minutes, though
		if (msg.content.includes('gute nacht') || msg.content.includes('nachti')) {
			if (! this.cache.goodNight || (this.cache.goodNight < (+new Date()) - 300000)) {
				this.cache.goodNight = (+new Date())

				return this.cmd.handleCommand(this, 'nacht', msg)
			}
		}

		// manually trigger command for saying hello
		if (msg.content.includes('hallo') || msg.content.includes('hallöchen~')) {
			return this.cmd.handleCommand(this, 'hallo', msg)
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

		return console.info('Logged in and started up')
	}

	onStartup () {
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
	}
}

module.exports = EventHandlers
