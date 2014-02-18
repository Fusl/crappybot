#!/usr/bin/env node

'use strict';

var argv = require('optimist')
	.usage('Usage: $0')
	.demand(['h', 'c', 'u'])
	.alias({})
	.describe({
		'h': 'Hostname',
		'c': 'Channelname',
		'u': 'Username',
		'p': 'Users-JSON-File',
		'f': 'Facts-JSON-File'
	})
	.argv;

global.config = Object.create(null);
global.config.hostname = argv.h;
global.config.channelname = argv.c;
global.config.username = argv.u;
global.config.usersfile = argv.p;
global.config.factsfile = argv.f;
global.config.prefixes = ['./', '.', '!', '/'];
global.config.localversion = '0.1.1 fusl~2014-02-11';
global.config.irclines = 4;
global.config.slots = {
	dig: {
		uses: {},
		use: 0,
		max: 2
	},
	host: {
		uses: {},
		use: 0,
		max: 2
	},
	ping: {
		uses: {},
		use: 0,
		max: 2
	},
	t2test: {
		uses: {},
		use: 0,
		max: 2
	}
};
global.config.ipv4regex = new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
global.config.ipv6regex = new RegExp('^\\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*$');

global.base = require('./bases/loadbases.js')();

global.run = global.base.loadmodules();
global.hiddenrun = [];
global.hiddenrun.push('prefixes');
global.hiddenrun.push('commands');
global.hiddenrun.push('builtinargs');
global.hiddenrun.push('syntax');

global.client = new global.base.irc.Client(global.config.hostname, global.config.username, {
	userName: Math.random().toString(16),
	realName: global.config.username + ' ' + global.config.localversion,
	port: 6667,
	debug: false,
	showErrors: false,
	autoRejoin: true,
	autoConnect: true,
	channels: ['#' + global.config.channelname],
	secure: false,
	selfSigned: false,
	certExpired: false,
	floodProtection: false,
	floodProtectionDelay: 500,
	sasl: false,
	stripColors: false,
	channelPrefixes: '&#',
	messageSplit: 512
});

global.client.on('error', function (msg) {
	console.log('error: ', msg);
});

client.on('message', global.base.messagelistener);
