const index = require('./blah/index')

module.exports = function (cmd, msg) {
	if (! index[cmd]) {
		return
	}

	var quote = index[cmd][0]

	if (index[cmd].length > 1) {
		quote = index[cmd][Math.floor(Math.random() * index[cmd].length)]
	}

	return msg.channel.sendMessage(quote)
}
