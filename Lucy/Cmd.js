class Cmd {
	constructor() {
		this.commandList = require('./commandList')
	}

	handleCommand (lcy, cmd, msg) {
		if (this.commandList.commands.hasOwnProperty(cmd)) {
			return this.commandList.commands[cmd].call(lcy, cmd, msg)
		}

		for (var command in this.commandList.aliases) {
			if (this.commandList.aliases[command].indexOf(cmd) != -1) {
				return this.commandList.commands[command].call(lcy, cmd, msg)
			}
		}
	}

	isCommand (cmd) {
		if (this.commandList.commands[cmd]) {
			return true
		}

		for (var command in this.commandList.aliases) {
			if (this.commandList.aliases[command].indexOf(cmd)) {
				return true
			}
		}

		return false
	}

	isPrefixed (msg) {
		msg = msg.content

		return (msg.startsWith('lucy_light, ') || msg.startsWith('lucy_light ') || msg.startsWith('!! '))
	}

	parseMessageToCommand (msg) {
		msg = msg.content.replace('lucy_light, ', '')
		msg = msg.replace('lucy_light ', '')
		return msg.replace('!! ', '')
	}

	sentByOp (msg) {
		for (var i = 0; i < this.cfg.op_role_ids.length; i++) {
			for (var i = 0; i < msg.member._roles.length; i++) {
				if (msg.member._roles[i].indexOf(this.cfg.op_role_ids[i]) != -1) {
					return true
				}
			}
		}

		return false
	}
}

module.exports = Cmd
