module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: .global <run javascript code in virtual environmet (use global variable to access bot functions)>');
		return;
	}
	try {
		cb(new Function(args.join(' '))(args, from, message, rawmessage, fromsplitter, cb));
	} catch(e) {
		cb(e);
	}
};
