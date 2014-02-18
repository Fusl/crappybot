module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	console.log(JSON.stringify(args));
	var ip = args[0];
	var slotname = 't2test';
	if (!global.config.ipv4regex.test(ip) && !global.config.ipv6regex.test(ip)) {
		global.client.say(from, 'Not a valid ip address');
		return;
	}
	if (args.length === 0) {
		return;
	}
	
	if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
		if (global.config.slots[slotname].use >= global.config.slots[slotname].max) {
			global.client.say(from, 'All ' + slotname + '-slots are currently in use, please try again later and/or check out !slots.');
			return;
		}
		global.config.slots[slotname].use = global.config.slots[slotname].use + 1;
	}
	
	global.client.say(from, 'This Tier2 test/check is experimental, please refer to the official test: http://www.opennicproject.org/t2log/t2.php -- However, i\'m trying to test the server, please be patient...');
	
	var tests = [
		{
			'name': 'Connectivity',
			'test': function (ip, cb) {
				global.base.xexec('dig @' + ip + ' . +time=5 +tries=2 | egrep \';; Query time: [0-9]+ msec\' | awk \'{print $4}\'', {timeout: 15000}, function (err, output, stderr) {
					output = output.split('\n')[0];
					if (/^[0-9]+$/.test(output)) {
						if (Number(output) >= 1000) {
							var code = 2;
						} else {
							var code = 0;
						}
					} else {
						var code = 1;
					}
					cb(code, output);
				});
			},
		},
		{
			'name': 'Reply size',
			'test': function (ip, cb) {
				global.base.xexec('dig @' + ip + ' rs.dns-oarc.net. TXT IN +short +time=5 +tries=2 | grep \'DNS reply size limit\' | awk \'{print $9}\'', {timeout: 15000}, function (err, output, stderr) {
					output = output.split('\n')[0];
					if (Number(output) >= 3500) {
						var code = 0;
					} else {
						var code = 2;
					}
					cb(code, output);
				});
			}
		},
		{
			'name': 'Port rand',
			'test': function (ip, cb) {
				global.base.xexec('dig @' + ip + ' +short porttest.dns-oarc.net TXT +time=5 +tries=2 | grep is | awk \'{print $3}\' | awk -F\':\' \'{print $1}\'', {timeout: 15000}, function (err, output, stderr) {
					output = output.split('\n')[0];
					if (output === 'GREAT') {
						var code = 0;
					} else if (output === 'GOOD') {
						var code = 2;
					} else {
						var code = 2; //1;
					}
					cb(code, output);
				});
			}
		},
		{
			'name': 'NXDOMAIN',
			'test': function (ip, cb) {
				global.base.xexec('dig @' + ip + ' ' + Math.random().toString(32).split('.')[1] + Math.random().toString(32).split('.')[1] + '.'+Math.random().toString(32).split('.')[1] + '. TXT IN +time=5 +tries=2 | grep status: | awk -F\'status: \' \'{print $2}\' | awk -F\',\' \'{print $1}\'', {timeout: 15000}, function (err, output, stderr) {
					output = output.split('\n')[0];
					if (output === 'NXDOMAIN') {
						var code = 0;
					} else {
						var code = 1;
					}
					cb(code, output);
				});
			}
		},
		{
			'name': 'Version',
			'test': function (ip, cb) {
				global.base.xexec('dig @' + ip + ' version.bind. TXT CHAOS +short +time=5 +tries=2', {timeout: 15000}, function (err, output, stderr) {
					output = output.split('\n')[0];
					if (output === '' || output === '""' || output === '"[hidden]"') {
						var code = 0;
					} else {
						var code = 2;
					}
					cb(code, output);
				});
			}
		},
		{
			'name': 'OpenNIC Domains',
			'test': function (ip, cb) {
				var domains = ['.', 'bbs.', 'dns.opennic.glue.', 'dyn.', 'free.', 'fur.', 'geek.', 'gopher.', 'indy.', 'ing.', 'micro.', 'neo.', 'null.', 'opennic.glue.', 'oss.', 'oz.', 'parody.', 'pirate.'];
				var digcmd = [];
				domains.forEach(function (domain) {
					digcmd.push('dig @' + ip + ' SOA ' + domain + ' +short +time=5 +tries=2');
				});
				digcmd = digcmd.join(';');
				global.base.xexec('(' + digcmd + ') | egrep -v "^;;"', {timeout: 15000}, function (err, output, stderr) {
					output = output.split('\n');
					var should = [
						'ns0.opennic.glue.',
						'ns6.opennic.glue.',
						'ns0.opennic.glue.',
						'ns6.opennic.glue.',
						'ns1.opennic.glue.',
						'ns11.ns.ph2network.org.',
						'ns1.opennic.glue.',
						'ns7.opennic.glue.',
						'ns1.opennic.glue.',
						'ns5.opennic.glue.',
						'ns5.opennic.glue.',
						'ns3.opennic.glue.',
						'ns1.opennic.glue.',
						'ns0.opennic.glue.',
						'ns2.opennic.glue.',
						'ns10.opennic.glue.',
						'ns2.opennic.glue.',
						'ns9.opennic.glue.'
					];
					var code = 0;
					should.forEach(function (singleshould) {
						var x = output.shift();
						if (!x || singleshould !== x.split(' ')[0]) {
							code = 1;
						}
					});
					cb(code, output);
				});
			}
		}
	];
	var results = {};
	var success = [];
	var fail = [];
	var warn = [];
	tests.forEach(function (test) {
		var testname = test.name;
		var testfunction = test.test;
		testfunction(ip, function (status, result) {
			results[testname] = {
				'status': status,
				'result': result
			};
			if (status === 0) {
				success.push(testname);
			} else if (status === 1) {
				fail.push(testname);
			} else if (status === 2) {
				warn.push(testname);
			}
			if (Object.keys(results).length >= tests.length) {
				var resulttext = [];
				if (fail.length === 0) {
					resulttext.push(ip + ': Passed');
				} else {
					resulttext.push(ip + ': Failed');
				}
				
				if (fail.length) {
					resulttext.push('Fail: ' + fail.join(', '));
				}
				
				if (warn.length) {
					resulttext.push('Warn: ' + warn.join(', '));
				}
				
				cb (resulttext.join('; '));
				
				if (typeof global.config.slots[slotname] === 'object' && typeof global.config.slots[slotname].use === 'number' && typeof global.config.slots[slotname].max === 'number') {
					global.config.slots[slotname].use = global.config.slots[slotname].use - 1;
				}
			}
		});
	});
};
