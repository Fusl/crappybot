module.exports = function (args, from, message, rawmessage, fromsplitter, cb) {
	var output = [];
	Object.keys(global.config.slots).forEach(function (slotname) {
		output.push(slotname + ': ' + global.config.slots[slotname].use + '/' + global.config.slots[slotname].max + ' (' + (global.config.slots[slotname].use/global.config.slots[slotname].max*100) + '%)');
	});
	cb(output.join(', '));
};
