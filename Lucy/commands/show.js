const moment = require('moment')

function composeMessage() {
	var message

	if (this.songMeta.current_event == 'DJ-Pony Lucy' || this.songMeta.current_event == 'DJ-Pony Mary') {
		message = 'Gerade läuft der Auto-DJ\n\n'

		if (this.nextShow == null) {
			return message += 'Derzeit ist keine Sendung geplant. :lucy_oO:'
		}

		message += 'Nächste Sendung: **' + this.nextShow.summary + '** ' + moment(this.nextShow.start.dateTime).format('dd D. MMMM HH:mm') + ' \n'
		return message += '```' + this.nextShow.description + '```'
	}

	message = 'Gerade läuft: **' + this.nextShow.summary + '** bis ' + moment(this.nextShow.end.dateTime).format('HH:mm') + '\n\n'
	return message += '```' + this.nextShow.description + '```'
}

module.exports = function (cmd, msg) {
	return msg.channel.sendMessage(composeMessage.call(this))
}
