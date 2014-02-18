module.exports = function (seconds) {
    var days = Math.floor(seconds / 60 / 60 / 24);
    var hours = Math.floor((seconds - days * 24 * 60 * 60) / 60 / 60);
    var minutes = Math.floor((seconds - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
    var seconds = Math.floor(seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
    var result = [];
    if (days) {
        result.push(days + 'd');
    } 
    if (hours || days) {    
        result.push(hours + 'h');
    }
    if (minutes || hours || days) {
        result.push(minutes + 'm');
    }
    result.push(seconds + 's');
    return result.join(' ');
};
