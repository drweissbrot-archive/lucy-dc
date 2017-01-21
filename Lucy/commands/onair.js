module.exports = function (cmd, msg) {
	if (! this.cmd.sentByOp.call(this, msg)) {
		return msg.reply('das darfst Du nicht! Ich krieg Dich, Jungchen!')
	}

	if (this.recording.isRunning()) {
		return msg.reply('es ist bereits eine Sendung aktiv – also: Nein.')
	}

	this.recording.start()
	.then(() => {
		return msg.reply('Sendung begonnen.')
	})
	.catch((err) => {
		console.error(err)

		return msg.reply('geht nicht. :lucy_oO: | @drweissbrot')
	})
}
