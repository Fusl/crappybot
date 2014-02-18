module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	global.client.say(from, 'Syntax: (<usernames to highlight>:) <prefix><command> <command args> <built-in args>');
};
