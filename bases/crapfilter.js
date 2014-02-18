module.exports = function (input) {
	if (input.trim().length && input.trim().substr(0,1) !== ';') {
		return true;
	}
	return false;
};
