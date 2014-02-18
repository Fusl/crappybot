module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: .fact <add|del|mod|list|{fact name}> {fact name} {fact text}');
		return;
	}
	var facts = {};
	try {
		facts = JSON.parse(global.base.fs.readFileSync(global.config.factsfile));
	} catch(e) {
		console.log(e);
	}

	var mode = args.shift();
	var factname = args.shift();
	var facttext = args.join(' ');
	
	var add = function (factname, facttext) {
		global.client.say(from, 'Function not yet implemented');
	};
	var del = function (factname) {
		global.client.say(from, 'Function not yet implemented');
	};
	var mod = function (factname, facttext) {
		global.client.say(from, 'Function not yet implemented');
	};
	var list = function () {
		var factlist = [];
		Object.keys(facts).forEach(function (factname) {
			factlist.push(factname);
		});
		cb(factlist.join(' '));
	};
	var get = function (factname) {
		if(facts[factname] && facts[factname].facttext) {
			cb(facts[factname].facttext);
		} else {
			global.client.say(from, factname + ': No such fact-entry');
		}
	};
	
	if (mode === 'add') {
		add(factname, facttext);
		return;
	}
	if (mode === 'del') {
		del(factname);
		return;
	}
	if (mode === 'mod') {
		mod(factname);
		return;
	}
	if (mode === 'list') {
		list();
		return;
	}
	if (typeof mode === 'string') {
		get(mode);
		return;
	}
	global.client.say(from, 'Usage: .fact <add|del|mod|list|{fact name}> {fact name} {fact text}');
};
