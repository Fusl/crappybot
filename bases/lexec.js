module.exports = function (command, options, callback) {
        var path = 'sh';
        var args = ['-c', command];
	var output = '';
	var managenl = function (input) {
		output += input.toString('utf8');
		if (output.split('\n').length > 1) {
			var xoutput = output.split('\n');
			callback('[' + proc.pid + '] ' + xoutput.shift());
			output = xoutput.join('\n');
			managenl('');
		}
	};
	
        var proc = global.base.spawn(path, args);
	
	callback('[' + proc.pid + '] +');
	
        if (typeof options === 'object' && typeof options.timeout === 'number') {
                var timeout = setTimeout(function () {
                        proc.kill('SIGKILL');
                }, options.timeout);
        }
	
        proc.stdout.on('data', function (chunk) {
		managenl(chunk);
        });
        proc.stderr.on('data', function (chunk) {
		managenl(chunk);
        });
	
	proc.on('exit', function () {
		callback('[' + proc.pid + '] -');
	});
	
        proc.on('error', function (e) {
                console.log(e);
        });
};
