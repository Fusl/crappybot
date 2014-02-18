module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: .rdns <ipv4 or ipv6 address>');
		return;
	}
	var ip = args[0]
	if (!global.config.ipv4regex.test(ip) && !global.config.ipv6regex.test(ip)) {
		global.client.say(from, 'Not a valid IPv4/IPv6 address, passing it to host');
	}
	global.run.host([ip], from, message, rawmessage, fromsplitter, cb);
};
