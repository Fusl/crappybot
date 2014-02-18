module.exports = function (obj) {
	var isnull = false;
	Object.keys(obj).forEach(function (objentry) {
		if (obj[objentry] === null) {
			isnull = true;
		}
	});
	return isnull;
};
