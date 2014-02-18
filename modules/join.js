module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: .join #channel1 [#channel2 [#channel3 [...]]]');
		return;
	}
	args.forEach(function (arg) {
		global.client.join(arg);
	});
	cb('Joined');
};
