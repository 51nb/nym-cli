var npm = require('../../../lib/utils/npm');
var yarn = require('../../../lib/utils/yarn');
var helper = require('../../../lib/utils/helper');

module.exports = function(packages = [], options = {}) {
    packages = helper.aliasNames(packages);

    if (yarn.isUseYarn(options)) {
        yarn.update(packages, options);
    } else {
        npm.update(packages, options);
    }
};
