const childProcess = require('child_process')
const fs = require('fs')

class Recording {
	constructor (lcy) {
		this.lcy = lcy

		this.createEmptyRecordingFile()
	}

	createEmptyRecordingFile () {
		fs.writeFile(__dirname + '/../recording.txt', '', (err) => {
			if (err) {
				console.err(err)
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

			// start streamripper
			var streamripper = childProcess.execFile('streamripper', [
				'http://radio.bronyradiogermany.com:8000/live.m3u',
				'-a', '-A', '-l', '90000', '-u LucyLight',
				'> ' + __dirname + '/../sr-log.txt'
			], (err, stdout, stderr) => {
				if (err) {
					return reject(err)
				}
			})

			// write pid to file
			fs.writeFile(__dirname + '/../recording.txt', streamripper.pid, (err) => {
				if (err) {
					return reject(err)
				}

				return resolve()
			})
		})
	}

	stop () {
		return new Promise((resolve, reject) => {
			fs.readFile(__dirname + '/../recording.txt', (err, content) => {
				if (err) {
					reject(err)
				}

				childProcess.execFile('kill', [content], (err, stdout, stderr) => {
					if (err) {
						return reject(err)
					}
				})

				this.createEmptyRecordingFile()

				resolve()
			})
		})
	}
}

module.exports = Recording
