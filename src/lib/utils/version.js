/**
 * 返回可描述的版本号
 * @return {string}
 */
module.exports = function() {
    var nbmVersion = require('../../../package.json').version;
    var npmVersion = require('npm/package.json').version;
    var yarnVersion = require('yarn/package.json').version;
    return 'nym@v' + nbmVersion + '\nnpm@v' + npmVersion + '\nyarn@v' + yarnVersion;
};