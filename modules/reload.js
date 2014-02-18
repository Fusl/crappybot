module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	var beforelistenercount = global.client.listeners('message').length;
	global.client.removeListener('message', global.base.messagelistener);
	var afterlistenercount = global.client.listeners('message').length;
	global.base = global.base.loadbases();
	global.run = global.base.loadmodules();
	if (beforelistenercount !== afterlistenercount) {
		global.client.on('message', global.base.messagelistener);
	}
	global.client.say(from, 'Reloaded');
};
