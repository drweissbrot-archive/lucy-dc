module.exports = function (cmd, msg) {
	return msg.channel.sendMessage('Hallo, ' + msg.author.username + '!')
}
