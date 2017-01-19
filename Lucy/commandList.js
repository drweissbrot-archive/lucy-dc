module.exports = {
	aliases: {
		blah: [
			// Useful stuff
			'help',
			'hilfe',
			'lucy',
			'ts',
			'ts3',

			// Cross-promotion
			'bestof',
			'genre',

			// Pone
			'applejack',
			'celestia',
			'chrysalis',
			'derpy',
			'fluttershy',
			'luna',
			'maud',
			'octavia',
			'pinkie',
			'rainbow',
			'rarity',
			'sonata',
			'spike',
			'spitfire',
			'twilight',
			'vinyl',

			// Thingies
			'biermus',
			'bot',
			'clop',
			'facehat',
			'fluttertrain',
			'nacht',
			'pfudor',

			// People
			'jaster',
			'pierre',
			'prot',
			'topbat',
			'twinkle',
			'vaalyn',
		],

		nowplaying: [
			'song',
		],
		show: [
			'event',
		],
	},

	commands: {
		blah: require('./commands/blah'),

		nowplaying: require('./commands/nowplaying'),
		show: require('./commands/show'),

		next: require('./commands/next'),
		onair: require('./commands/onair'),
		offair: require('./commands/offair')
	}
}
