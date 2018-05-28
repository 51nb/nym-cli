var configs = require('../../../lib/configs');
var log = require('../../../lib/utils/log');
var helper = require('../../../lib/utils/helper');
var Package = require('../../../lib/utils/package');

module.exports = async function(packages, options) {
    if (!packages || !packages.length) packages = [configs.pkgName];

    for (let pkg of helper.aliasNames(packages)) {
        var data = await Package.getInfo(pkg, options.tag);

        if (data && data.version) {
            log.cyan(`${pkg}@${data.version}`);
        } else {
            log.yellow(`找不到 ${pkg}@${options.tag}`);
        }
    }
};