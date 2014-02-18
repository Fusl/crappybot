module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	cb(global.base.stoymdhms(process.uptime()));
};
