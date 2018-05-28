var configs = require('../../../lib/configs');
var shell = require('../../../lib/utils/shell');

module.exports = function(help) {
    var args = process.argv.slice(2);
    if (args.length <= 1) {
        let info = shell.spawn(configs.npm, ['-l'], 1);
        let startFlag = 'where <command> is one of:';           // npm5以下为<cmd>
        let endFlag = '\nnpm <command> -h     quick help on';   // npm5以下为<cmd>
        let start = info.indexOf(startFlag) + startFlag.length;
        let end = info.indexOf(endFlag);
        let more = info.substring(start, end);
        more = more.replace(/npm/g, 'nbm');

        help = help + '\n\n\n  <u>更多命令</u>' + more;

        return help;
    } else {
        let info = shell.spawn(configs.npm, args, 1);
        let help = info.replace(/^\n+|\n+$/g, '');
        help = help.replace(/npm/g, 'nbm');
        help = help.split('\n').map(function(line) {
            return '    ' + line;
        }).join('\n');

        return '\n' + help + '\n';
    }
};