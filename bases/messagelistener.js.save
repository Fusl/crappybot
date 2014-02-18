module.exports = function (from, to, message, rawmessage, fromsplitter) {
	if (typeof from === 'object' && from instanceof Array) {
		var xfrom = from;
	} else {
		var xfrom = [from];
	}
	var msgto = to.substr(0, 1) === '#' ? to : from;
	var args = message.toString('utf8').replace(/\b[\t\n]\b/g, ' ').replace(/\s{2,}/g, ' ').split(' ');
	var module = args.shift();
	var noprefix = true;
	global.config.prefixes.forEach(function (prefix) {
		if (!noprefix) {
			return;
		}
		if (module.substr(0, prefix.length) === prefix) {
			module = module.substr(prefix.length);
			noprefix = false;
		}
	});
	
	var digbotnickmentionindex = -1;
	if ((digbotnickmentionindex = xfrom.indexOf(global.client.nick)) !== -1) {
		noprefix = false;
		xfrom.splice(digbotnickmentionindex);
	}
	
	if (noprefix && msgto === to) {
		if (!fromsplitter) {
			global.base.forsplitter(from, to, message, rawmessage, fromsplitter);
		}
		return;
	}
	
	if (!global.run[module] || typeof global.run[module] !== 'function') {
		if (!fromsplitter) {
			global.base.forsplitter(from, to, message, rawmessage, fromsplitter);
		}
		return;
	}
	
	if (!global.run.perm(['check', rawmessage.prefix, 'use'])) {
		return;
	}
	
	if (!global.run.perm(['check', rawmessage.prefix, module])) {
		global.client.say(from, 'You do not have permissions to use ' + module);
		return;
	}
	
	while (args[args.length - 2] === '!for') {
		if (xfrom.indexOf(args[args.length - 1]) === -1 && args[args.length - 1].trim() !== '') {
			xfrom.push(args[args.length - 1]);
		}
		args = args.slice(0, args.length - 2);
		if (xfrom.length > 5) {
			global.client.say(from, 'Illegal use of !for');
			return;
		}
	}
	
	console.log(rawmessage.prefix, module, args);
	
	global.run[module](args, from, message, rawmessage, fromsplitter, function (output) {
		if (typeof output === 'undefined') {
			return;
		}
		output = output.toString('utf8');
		output = output.split('\n');
		output.forEach(function (outputline) {
			if (outputline.trim() === '') {
				return;
			}
			client.say(msgto, xfrom.join(', ') + ': ' + outputline);
		});
	});
};
