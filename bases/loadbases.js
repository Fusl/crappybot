module.exports = function () {
	var baselist = require('fs').readFileSync('./bases/bases.lst').toString('utf8').split('\n');
	var newbases = Object.create(null)
	baselist.forEach(function (base) {
		if (base === '') {
			return;
		}
		base = base.split('=');
		var basepath = base.shift();
		var basename = base.length ? base.join('=') : basepath;
		if (basepath.substr(0, 1) === '~') {
			var replacebasename = false;
			if (basepath === basename) {
				replacebasename = true;
			}
			basepath = basepath.substr(1);
			if (replacebasename) {
				basename = basepath;
			}
		} else {
			basepath = require('path').resolve('./bases/' + basepath + '.js');
			if (require.cache[basepath]) {
				delete require.cache[basepath];
			}
		}
		console.log(basepath + ' => ' + basename);
		newbases[basename] = require(basepath);
	});
	newbases['?'] = newbases.fact;
	return newbases;
};
