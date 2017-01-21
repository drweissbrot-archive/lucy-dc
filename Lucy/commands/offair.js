module.exports = function (cmd, msg) {
	if (! this.cmd.sentByOp.call(this, msg)) {
		return msg.reply('das darfst Du nicht! Ich krieg Dich, Jungchen!')
	}

	if (! this.recording.isRunning()) {
		return msg.reply('es ist derzeit keine Sendung aktiv – also: Nein.')
	}

	this.recording.stop()
	.then(() => {
		return msg.reply('Sendung beendet.')
	})
	.catch((err) => {
		console.error(err)

		return msg.reply('geht nicht. :lucy_oO: | @drweissbrot')
	})
}
