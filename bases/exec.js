module.exports = function (command, options, callback) {
        command = command.replace(/\b[\t\n]\b/g, ' ').replace(/\s{2,}/g, ' ').split(' ');
        var path = command.shift();
        var args = command;
        var output = [];
	
        var proc = global.base.spawn(path, args);
	
        if (typeof options === 'object' && typeof options.timeout === 'number') {
                var timeout = setTimeout(function () {
                        proc.kill('SIGKILL');
                }, options.timeout);
        }
	
        proc.stdout.on('data', function (chunk) {
                output.push(chunk);
        });
        proc.stderr.on('data', function (chunk) {
                output.push(chunk);
        });
	
        var stdoutclosed = false;
        var stderrclosed = false;
        proc.stdout.once('close', function () {
                if (timeout) {
                        clearTimeout(timeout);
                        timeout = false;
                }
                if (stderrclosed) {
                        callback(output.join('').toString('utf8'));
                        return;
                }
                stdoutclosed = true;
        });
        proc.stderr.once('close', function () {
                if (timeout) {
                        clearTimeout(timeout);
                        timeout = false;
                }
                if (stdoutclosed) {
                        callback(output.join('').toString('utf8'));
                        return;
                }
                stderrclosed = true;
        });
        proc.on('error', function (e) {
                console.log(e);
        });
};
