var config = require('../../../lib/utils/config');
var configs = require('../../../lib/configs');
var yarn = require('../../../lib/utils/yarn');
var log = require('../../../lib/utils/log');

module.exports = function(engine, options) {
    if (options.local) {
        let client = yarn.isUseYarn(options) ? 'yarn' : 'npm';
        log.info('nbm将使用: ' + client);
    } else {
        if (engine === 'yarn' || engine === 'npm') {
            log.info('nbm不再支持全局配置默认使用' + engine);
        } else {
            let client = config.get(configs.keys.use) || 'npm';
            log.info('nbm默认使用的是: ' + client);
        }
    }
};
