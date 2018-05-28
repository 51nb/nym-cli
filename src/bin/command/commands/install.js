var npm = require('../../../lib/utils/npm');
var yarn = require('../../../lib/utils/yarn');
var helper = require('../../../lib/utils/helper');
var log = require('../../../lib/utils/log');
var Package = require('../../../lib/utils/package');

module.exports = function(packages = [], options = {}) {
    if (!options.global && !Package.hasPackageJSON()) {
        log.error('当前目录不存在package.json文件');
        return false;
    }

    packages = helper.aliasNames(packages);

    if (yarn.isUseYarn(options)) {
        yarn.install(packages, options);
    } else {
        npm.install(packages, options);
    }
};
