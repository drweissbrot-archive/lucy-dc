const fs = require('fs')
const http = require('http')
const moment = require('moment')

class Recording {
	constructor (lcy) {
		this.lcy = lcy

		this.createEmptyRecordingFile()
	}

	createEmptyRecordingFile () {
		fs.writeFile(__dirname + '/../recording.txt', '', (err) => {
			if (err) {
				console.error(err)
			}
		})
	}

	isRunning () {
		return (! fs.statSync(__dirname + '/../recording.txt')['size'] == 0)
	}

	tweetShow () {
		return new Promise((resolve, reject) => {
			var text = this.lcy.nextShow.summary

			if (text.startsWith('@')) {
				text = '.' + text
			}

			if (text.length > 74) {
				text += ' – jetzt live im #BRG!'
			} else {
				text += ' – jetzt live im Brony Radio Germany!'
			}

			if (text.length < 133) {
				text += ' #Brony'
			}

			if (text.length <  135) {
				text += ' #MLP'
			}

			this.lcy.twitterClient.post('statuses/update', {
				status: text
			},  (err, tweet, res) => {
				if (err) {
					return reject(err)
				}

				return resolve()
			})
		})
	}

	start () {
		return new Promise((resolve, reject) => {
			// tweet
			this.tweetShow()
			.then(() => {})
			.catch((err) => {
				return reject(err)
			})

			// find out name for stream recording
			this.recordingName = __dirname + '/../Brony Radio Germany/' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.mp3'

			// rip stream
			this.rip = http.get('http://radio.bronyradiogermany.com:8000/stream', (res) => {
				if (res.statusCode != 200) {
					console.error(res.statusCode)

					return reject(res.statusCode)
				}

				res.on('data', (chunk) => {
					fs.appendFile(this.recordingName, chunk, (err) => {
						if (err) {
							return reject(err)
						}
					})
				})
			})

			// write something to recording file
			fs.writeFile(__dirname + '/../recording.txt', this.recordingName, (err) => {
				if (err) {
					return reject(err)
				}

				return resolve()
			})

			return resolve()
		})
	}

	stop () {
		return new Promise((resolve, reject) => {
			fs.readFile(__dirname + '/../recording.txt', (err, content) => {
				if (err) {
					reject(err)
				}

				this.rip.abort()
				this.createEmptyRecordingFile()

				return resolve()
			})
		})
	}
}

module.exports = Recording
