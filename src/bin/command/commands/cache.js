var configs = require('../../../lib/configs');
var shell = require('../../../lib/utils/shell');
var log = require('../../../lib/utils/log');

module.exports = function(action, options) {
    var cmds = [], args = ['cache'];
    switch (action) {
        case 'add':
        case 'verify':
            cmds = [configs.npm];
            args.push(action);
            break;
        case 'dir':
            cmds = [configs.yarn];
            args.push(action);
            break;
        case 'ls':
        case 'list':
            cmds = [configs.yarn];
            args.push('ls');
            break;
        case 'clean':
            if (options.npm) cmds.push(configs.npm);
            if (options.yarn) cmds.push(configs.yarn);
            args.push('clean');
            args.push('--force');
            break;
        default:
            log.error('未知缓存操作: ' + action);
            process.exit(1);
    }

    args = args.concat(process.argv.slice(4));
    if (!cmds.length) cmds = [configs.npm, configs.yarn];
    cmds.forEach(cmd => shell.spawn(cmd, args));
};