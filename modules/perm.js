module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: Check entries: ? or check as first parameter, userprefix as second parameter (optional), permission as third parameter (optional); Add user permission: userprefix as first parameter, permission as second parameter, allow or deny as third parameter; Remove user (permissions): userprefix as first parameter, permission as second parameter (optional)');
		return;
	}
	if (typeof cb === 'function') {
		cb(global.run.perm(args, from, message, rawmessage, fromsplitter, false));
		return;
	}
	try {
		var perms = JSON.parse(global.base.fs.readFileSync(global.config.usersfile));
	} catch(e) {
		console.log(e);
		return;
	}
	if (args[0] === 'check' || args[0] === '?') {
		var user = args[1];
		var right = args[2];
		if (!user) {
			return Object.keys(perms).join(' ');
		}
		if (!right) {
			if (typeof perms[user] === 'undefined') {
				return 'No such user: ' + user;
			} else if (perms[user].length) {
				return Object.keys(perms[user]).join(' ');
			} else {
				return 'No permissions defined for user ' + user;
			}
		}
		if (perms) {
			if (typeof perms[user] !== 'undefined') {
				if (typeof perms[user][right] !== 'undefined') {
					return !!perms[user][right];
				}
				if (typeof perms[user]['*'] !== 'undefined') {
					return !!perms[user]['*'];
				}
			}
			if (typeof perms['*'] !== 'undefined') {
				if (typeof perms['*'][right] !== 'undefined') {
					return !!perms['*'][right];
				}
				if (typeof perms['*']['*'] !== 'undefined') {
					return !!perms['*']['*'];
				}
			}
		}
		return false;
	}
	var user = args[0] ? args[0] : null;
	var right = args[1] ? args[1] : null;
	var jump =  args[2] ? args[2].toLowerCase() : null;
	
	if (jump === 'allow') {
		jump = true;
	} else if (jump === 'deny') {
		jump = false;
	} else {
		jump = null;
	}

	var xreturn = [];
	if (right && (jump === true || jump === false)) {
		if (global.run.perm(['check', rawmessage.prefix, 'owner']) || (global.run.perm(['check', rawmessage.prefix, right]) && !global.run.perm(['check', user, '*']) && !global.run.perm(['check', user, 'owner']))) {
			if (!perms[user]) {
				perms[user] = {};
				xreturn.push('New user ' + user + ' created in permission table.');
			}
			perms[user][right] = jump;
			xreturn.push('User ' + user + ' permission ' + right + ' set to ' + jump);
		} else {
			xreturn.push('You do not have permissions to create user ' + user + ' with permission ' + right + ' set to ' + jump + ' in permission table.');
		}
	} else if (right) {
		if (global.run.perm(['check', rawmessage.prefix, 'owner']) || (global.run.perm(['check', rawmessage.prefix, right]) && !global.run.perm(['check', user, '*']) && !global.run.perm(['check', user, 'owner']))) {
			if (perms[user]) {
				delete perms[user][right];
			}
			xreturn.push('User ' + user + ' permission ' + right + ' removed from permission table.');
		} else {
			xreturn.push('You do not have permissions to remove user ' + user + ' permission ' + right + ' from permission table.');
		}
	} else if (user) {
		if (global.run.perm(['check', rawmessage.prefix, 'owner']) || (global.run.perm(['check', rawmessage.prefix, '*']) && !global.run.perm(['check', user, '*']) && !global.run.perm(['check', user, 'owner']))) {
			delete perms[user];
			xreturn.push('User ' + user + ' removed from permission table.');
		} else {
			xreturn.push('You do not have permissions to remove user ' + user + ' from permission table.');
		}
	}

	global.base.fs.writeFileSync(global.config.usersfile, JSON.stringify(perms));
	if (xreturn.length) {
		return xreturn.join('\n');
	}
};

