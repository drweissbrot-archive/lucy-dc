const axios = require('axios')
const moment = require('moment')

class Services {
	updateShowData () {
		axios.get('https://www.googleapis.com/calendar/v3/calendars/bronyradiogermany%40gmail.com/events?timeMin=' + moment().add(15, 'minutes').toISOString() + '&key=' + this.cfg.google_api_key)
		.then((res) => {
			if (! res.data.items.length) {
				this.nextShow = null
				return
			}

			this.nextShow = this.services.sortGoogleCalenderItems(res.data.items)[0]

			if (this.lastAnnouncedShow.id == this.nextShow.id && this.lastAnnouncedShow.as == 'now') {
				return
			} else if (this.lastAnnouncedShow.id == this.nextShow.id && this.lastAnnouncedShow.as == 'soon') {
				if (moment(this.nextShow.start.dateTime).diff() < 900000) {
					this.services.announceNextShow.call(this)

					this.lastAnnouncedShow = {
						id: this.nextShow.id,
						as: 'now'
					}
				}
			} else {
				this.services.announceNextShow.call(this)

				this.lastAnnouncedShow = {
					id: this.nextShow.id,
					as: 'soon'
				}
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}

	updateSongMeta () {
		axios.get('https://www.bronyradiogermany.com/request-v2/json/v1/nowplaying/stream')
		.then((res) => {
			this.songMeta = res.data.result
			this.songMeta.song = this.songMeta.artist + ' – ' + this.songMeta.title

			this.setGame(this.songMeta.song)

			if (this.songMeta.status != 'online') {
				this.setStatus('dnd')
			} else if (this.songMeta.current_event == 'DJ-Pony Lucy' || this.songMeta.current_event == 'DJ-Pony Mary') {
				this.setStatus('idle')
			} else {
				this.setStatus('online')
			}
		})
		.catch((err) => {
			console.error(err)

			this.setGame('Extreme Tux Racer')
		})
	}

	sortGoogleCalenderItems (items) {
		return items.sort((a, b) => {
			var dateA = new Date(a.start.dateTime)
			var dateB = new Date(b.start.dateTime)

			if (dateA < dateB) {
				return -1
			} else if (dateA > dateB) {
				return 1
			} else {
				return 0
			}
		})
	}

	announceNextShow () {
		var absoluteTime = moment(this.nextShow.start.dateTime).format('HH:mm')

		if (moment(this.nextShow.start.dateTime).diff() >= 900000) {
			absoluteTime = moment(this.nextShow.start.dateTime).format('dd D. MMMM HH:mm')
		}

		var message = '**' + moment().to(this.nextShow.start.dateTime) + ' (' + absoluteTime + ' Uhr)' + '**\n\n'
		message += ':musical_note:  **' + this.nextShow.summary.toUpperCase() + '**\n\n'
		message += '```' + this.nextShow.description + '```'

		this.broadcast.call(this, message)
	}
}

module.exports = Services
