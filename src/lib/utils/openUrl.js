var shell = require('./shell');

module.exports = function(url) {
    var cmd;
    switch (process.platform) {
        case 'win32':
            url = url.replace(/&/g, '^&');
            cmd = 'cmd /c start ""';
            break;
        case 'darwin':
            cmd = 'open';
            break;
        default:
            cmd = 'xdg-open';
    }

    shell.exec(cmd + ' ' + url, 10);
};