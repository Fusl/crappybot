var execdb = Object.create(null);
module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: .exec <+ to start a new multiline script | - to end and execute a multiline script | Command to execute or add to script>');
		return;
	}
	if (args[0] === '+') {
		if (!execdb[from]) {
			execdb[from] = [];
			cb('Script started.');
			return;
		}
		cb('Script already running, ignored');
	} else if (args[0] === '-') {
		if (!execdb[from]) {
			cb('No script started.');
			return;
		}
		global.base.lexec(execdb[from].join('\n'), {}, cb);
		delete execdb[from];
	} else  if (execdb[from]) {
		execdb[from].push(args.join(' '));
	} else {
		global.base.lexec(args.join(' '), {}, cb);
	}
};
