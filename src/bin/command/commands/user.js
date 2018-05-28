var configs = require('../../../lib/configs');
var openUrl = require('../../../lib/utils/openUrl');
var shell = require('../../../lib/utils/shell');

module.exports = function(username) {
    if (!username) {
        username = shell.exec('nbm whoami', 1);
    }

    if (username) {
        openUrl(`${configs.homepage}/~${username}`);
    } else {
        console.log('\n    请指定需要查看的用户名\n');
    }
};