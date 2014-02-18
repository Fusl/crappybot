module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	var commands = [];
	Object.keys(global.run).forEach(function (command) {
		if (global.run.perm(['check', rawmessage.prefix, command]) && global.hiddenrun.indexOf(command) === -1) {
			commands.push(command);
		}
	});
	global.client.say(from, 'Commands: ' + (commands.length ? commands.join(' ') : 'Sorry, no commands for you :('));
};
