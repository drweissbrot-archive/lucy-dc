const axios = require('axios')

module.exports = function (cmd, msg) {
	if (this.songMeta.current_event == 'DJ-Pony Lucy' || this.songMeta.current_event == 'DJ-Pony Mary') {
		var message += 'Gerade läuft im Auto-DJ:\n\n'
	} else {
		var message += '🔴 **' + this.songMeta.current_event + '**\n\n'
	}

	message += ':musical_note:  **' + this.songMeta.song + '**\n\n'

	var votes = this.songMeta.upvotes - this.songMeta.downvotes

	if (votes > 0) {
		message += votes + '  💖  |  '
	} else if (votes < 0) {
		message += votes * -1 + '  💔  |  '
	}

	message += this.songMeta.listener + '  👥'

	// get YouTube URL
	axios.get('https://www.googleapis.com/youtube/v3/search?part=id&q=' + this.songMeta.artist + ' ' + this.songMeta.title + '&maxResults=1&type=video&key=' + this.cfg.google_api_key)
	.then((res) => {
		if (res.data.items.length > 0) {
			message += '  |  https://youtu.be/' + res.data.items[0].id.videoId
		}

		return msg.channel.sendMessage(message)
	})
	.catch((err) => {
		console.error(err)

		return msg.channel.sendMessage(message)
	})
}
