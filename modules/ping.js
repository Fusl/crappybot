module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	var slotname = 'ping';
	var hosts = {};
	
	if (args.length === 0) {
		cb('pong');
		return;
	}
	
	if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
		if (global.config.slots[slotname].use >= global.config.slots[slotname].max) {
			global.client.say(from, 'All ' + slotname + '-slots are currently in use, please try again later and/or check out !slots.');
			return;
		}
		global.config.slots[slotname].use = global.config.slots[slotname].use + 1;
	}
	
	var ping = function (ips, cb) {
		var returnpingresults = function (ips, cb) {
			if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
				global.config.slots[slotname].use = global.config.slots[slotname].use - 1;
			}
			
			var output = [];
			Object.keys(ips).forEach(function (ip) {
				output.push(ip + ': ' + ips[ip]);
			});
			output = output.join('\n');
			
			if (output.split('\n').length <= (global.config.irclines + 1) && output.length <= 1024) {
				cb(output.replace(/\b\t\b/g, ' ').replace(/\s{2,}/g, ' '));
				return;
			}
			
			global.base.toSprunge(output, cb, ' (' + output.split('\n').length + ' lines (' + args.join(' ') + '))');

		};
		
		if (Object.keys(ips).length === 0) {
			if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
				global.config.slots[slotname].use = global.config.slots[slotname].use - 1;
			}
			return;
		}
		
		Object.keys(ips).forEach(function (ip) {
			if (global.config.ipv4regex.test(ip)) {
				var cmd = 'ping';
			} else if (global.config.ipv6regex.test(ip)) {
				var cmd = 'ping6';
			} else {
				ips[ip] = 'Not a valid ip address or hostname: ' + ip;
				var doreturn = true;
				Object.keys(ips).forEach(function (ip) {
					if (ips[ip] === null) {
						doreturn = false;
					}
				});
				if (doreturn) {
					returnpingresults(ips, cb);
				}
				return;
			}
			global.base.exec(cmd + ' -w 5 -i 0.2 ' + ip, {timeout: 10000}, function (output) {
				output = output.split('\n');
				output = output[output.length - 2];
				ips[ip] = (output !== '') ? output.toString('utf8') : 'down (IPv6 is currently not working)';
				var doreturn = true;
				Object.keys(ips).forEach(function (ip) {
					if (ips[ip] === null) {
						doreturn = false;
					}
				});
				if (doreturn) {
					returnpingresults(ips, cb);
				}
			});
		});
	};
	
	var lookup = function (host, cb) {
		global.base.exec('host ' + host, {timeout: 60000}, function (output) {
			var hosts = [];
			output = output.split('\n');
			output.forEach(function (host) {
				if (/ has address /.test(host)) {
					hosts.push(host.split(' ')[3]);
				} else if (/has IPv6 address /.test(host)) {
					hosts.push(host.split(' ')[4]);
				}
			});
			if (hosts.length === 0) {
				cb([host]);
			} else {
				cb(hosts);
			}
		});
	};
	
	var openlookups = 0;
	args.forEach(function (arg) {
		var host = arg;
		if (global.config.ipv4regex.test(host) || global.config.ipv6regex.test(host)) {
			hosts[host] = null;
		} else {
			openlookups = openlookups + 1;
			lookup(host, function (ips) {
				ips.forEach(function (ip) {
					hosts[ip] = null;
				});
				openlookups = openlookups - 1;
				if (openlookups <= 0) {
					ping(hosts, cb);
				}
			});
		}
	});
	if (openlookups <= 0) {
		ping(hosts, cb);
	}
};
