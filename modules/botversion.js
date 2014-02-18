module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	global.client.say(from, global.config.localversion);
};
