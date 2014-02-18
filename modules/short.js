module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	if (!args.length) {
		global.client.say(from, 'Usage: Generate or resolve a short url: .short <Long or Short URL>');
		return;
	}
	global.base['goo.gl'].setKey('AIzaSyCRqjJ-I1Mu4o8dDyCUjHtkOUGxhBtB11g');
	if (args[0].substr(0, 14) === 'http://goo.gl/' || args[0].substr(0, 15) === 'https://goo.gl/') {
		global.base['goo.gl'].expand(args[0], function (longUrl) {
			if (longUrl.longUrl) {
				cb(longUrl.longUrl);
			} else {
				global.client.say(from, 'No such goo.gl URL.');
			}
		});
	} else {
		global.base['goo.gl'].shorten(args[0], function (shortUrl) {
			if (shortUrl.id) {
				cb(shortUrl.id);
			} else {
				global.client.say(from, 'There was an error calling the Google API. Please contact the owner of this bot and tell what you\'ve done.');
			}
		});
	}
};
