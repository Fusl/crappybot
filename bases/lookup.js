module.exports = function (hosts, cb) {
	if (typeof hosts !== 'object') {
		hosts = {};
		hosts[hosts.toString('utf8')] = null;
	}
	if (Array.isArray(hosts)) {
		var returnhosts = {};
		hosts.forEach(function (host) {
			returnhosts[host] = null;
		});
		hosts = returnhosts;
	}
	Object.keys(hosts).forEach(function (host) {
		if (global.config.ipv4regex.test(host) || global.config.ipv6regex.test(host)) {
			hosts[host] = host;
			if (!global.base.containsnull(hosts)) {
				cb(hosts);
			}
		} else {
			global.base.exec('host ' + host, {timeout: 15000}, function (output) {
				hosts[host] = [];
				output.split('\n').forEach(function (addr) {
					if (/ has address /.test(addr)) {
						hosts[host].push(addr.split(' ')[3]);
					} else if (/has IPv6 address /.test(addr)) {
						hosts[host].push(addr.split(' ')[4]);
					}
				});
				if (!hosts[host].length) {
					hosts[host] = false;
				}
				if (!global.base.containsnull(hosts)) {
					cb(hosts);
				}
			});
		}
	});
	if (!Object.keys(hosts).length && !global.base.containsnull(hosts)) {
		cb(hosts);
	}
};
