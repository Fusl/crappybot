module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: .dig <Parameters to pass to the `dig` command>');
		return;
	}
	var slotname = 'dig';
	
	var prohibited = false;
	args.forEach(function (arg) {
		if (prohibited) {
			return;
		}
		if (/^-.*f/.test(arg)) {
			global.client.say(from, '-f parameter is prohibited');
			prohibited = true;
			return;
		}
		if (/^-.*k/.test(arg)) {
			global.client.say(from, '-k parameter is prohibited');
			prohibited = true;
			return;
		}
	});
	if (prohibited) {
		return;
	}
	
	if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
		if (global.config.slots[slotname].use >= global.config.slots[slotname].max) {
			global.client.say(from, 'All ' + slotname + '-slots are currently in use, please try again later and/or check out !slots.');
			return;
		}
		global.config.slots[slotname].use = global.config.slots[slotname].use + 1;
	}

	global.base.exec('dig ' + args.join(' '), {timeout: 60000}, function (output) {
		if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
			global.config.slots[slotname].use = global.config.slots[slotname].use - 1;
		}
		
		if (output.split('\n').length <= (global.config.irclines + 1) && output.length <= 1024) {
			cb(output.replace(/\b\t\b/g, ' ').replace(/\s{2,}/g, ' '));
			return;
		}
		
		var filteredoutput = output.split('\n').filter(global.base.crapfilter).join('\n');
		if (filteredoutput.split('\n').length <= global.config.irclines && filteredoutput.length > 0) {
			cb(filteredoutput.replace(/\b\t\b/g, ' ').replace(/\s{2,}/g, ' '));
			global.base.toSprunge(output, cb, ' (cont, ' + (output.split('\n').length - 1) + ' lines (' + args.join(' ') + '))');
			return;
		}
		
		global.base.toSprunge(output, cb, ' (' + (output.split('\n').length - 1) + ' lines (' + args.join(' ') + '))');
	});
};
