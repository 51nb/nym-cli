var log = require('./log');
var semver = require('semver');
var configs = require('../configs');

module.exports = function() {
    if (process.env.SUDO_USER) {
        log.warn('<red>不支持使用sudo运行' + configs.name + '，请使用以下命令修复权限问题:</red>');
        log.info('<yellow>sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}</yellow>');
        if (semver.gt(process.version, '8.0.0')) {
            log.info('同时建议清理缓存：<yellow>npm cache clean --force</yellow>');
        }
        process.exit(1);
    }
};