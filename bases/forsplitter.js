module.exports = function (from, to, message, rawmessage, fromsplitter) {
	var xfrom = [from];
	var splitmessage = message.toString('utf8').split(': ');
	var splitfrom = [from].concat(splitmessage.shift().split(/[ ,]/));
	splitfrom.forEach(function (splitfrom_single) {
		if (xfrom.indexOf(splitfrom_single) === -1 && splitfrom_single.trim() !== '') {
			xfrom.push(splitfrom_single);
		}
	});
	splitmessage = splitmessage.join(': ');
	global.base.messagelistener(xfrom, to, splitmessage, rawmessage, true);
};
