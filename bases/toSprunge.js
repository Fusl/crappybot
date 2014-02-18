module.exports = function (input, cb, suffix) {
	global.base.request.post('http://sprunge.us/', {form: {sprunge: input.toString('utf8')}}, function (err, res, body) {
		if(!err && res.statusCode == 200) {
			cb(body.toString('utf8').split('\n')[0] + (suffix ? suffix : ''));
		}
	});
};
