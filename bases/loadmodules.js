module.exports = function () {
	var modulelist = global.base.fs.readFileSync('./modules/modules.lst').toString('utf8').split('\n');
	var newmodules = Object.create(null)
	modulelist.forEach(function (module) {
		if (module === '') {
			return;
		}
		var filepath = global.base.path.resolve('./modules/' + module + '.js');
		if (require.cache[filepath]) {
			delete require.cache[filepath];
		}
		newmodules[module] = require(filepath);
	});
	newmodules['?'] = newmodules.fact;
	return newmodules;
};
