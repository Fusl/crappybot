module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	var lastprefix = rawmessage.prefix;
	var unfreezelistener = function (from, to, message, rawmessage, fromsplitter) {
		if (rawmessage.prefix === lastprefix) {
			if (message === '.unfreeze') {
				global.client.removeListener('message', unfreezelistener);
				global.client.on('message', global.base.messagelistener);
				return;
			}
			global.base.messagelistener(from, to, message, rawmessage, true);
		}
	};
	global.client.removeListener('message', global.base.messagelistener);
	global.client.on('message', unfreezelistener);
	global.client.say(from, 'Freezed');
};
