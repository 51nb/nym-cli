var log = require('../../../lib/utils/log');
var shell = require('../../../lib/utils/shell');

module.exports = function() {
    if (!~process.argv.indexOf('--force')) {
        log.warn('清除操作是不可逆的，请在命令后面加[--force]来确认必需执行');
        process.exit(0);
    }

    try {
        shell.exec('rm -rf ./node_modules package-lock.json yarn.lock npm-shrinkwrap.json', 10);
    } catch(e) {}
};