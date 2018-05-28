var fs = require('fs');
var log = require('./log');
var config = require('./config');
var shell = require('./shell');
var helper = require('./helper');
var Package = require('./package');
var configs = require('../configs');

exports.isUseYarn = function(options) {
    if (options.global === true || options.dryRun === true || options.save === false) return false;

    if (options.npm || options.yarn) {
        if (options.npm && options.yarn) {
            log.error('请明确到底是使用[npm]还是[yarn]来完成本次操作');
            process.exit(1);
        }

        if (options.yarn) {
            Package.delNpmLock();
        } else {
            Package.delYarnLock();
        }

        return options.yarn;
    }

    var hasNpmLock = Package.hasNpmLock();
    var hasYarnLock = Package.hasYarnLock();

    if (hasNpmLock && hasYarnLock) {
        log.error('同时存在yarn.lock和package-lock.json, 无法继续本次操作');
        process.exit(1);
    }
    if (hasNpmLock) return false;
    if (hasYarnLock) return true;

    return config.get(configs.keys.use) === 'yarn';
};

exports.setOptions = function(args, options = {}) {
    var maps = {
        saveDev: '--dev',
        saveOptional: '--optional',
        saveExact: '--exact',
        saveTilde: '--tilde',
        saveCaret: '--caret',
        savePeer: '--peer',
        force: '--force',
        tag: '--tag',
        ignoreScripts: '--ignore-scripts',
        binLinks: '!--no-bin-links',
        lock: '!--no-lockfile',
        packageLock: '!--no-lockfile',
        checkFiles: '--check-files',
        flat: '--flat',
        silent: '--silent',
        offline: '--offline',
        nonInteractive: '--non-interactive',
        prod: '--production',
        production: '--production',
        pattern: '--pattern',
        scope: '--scope',
        latest: '--latest',
    };

    helper.createArgs(args, options, maps);
};

exports.spawn = function(args, options = {}) {
    // yarn只能通过修改配置来实现指定源
    var rc = [];
    Object.keys(configs.env).forEach(function(key) {
        rc.push(`${key.toLowerCase().replace(/_/g, '-')}=${configs.env[key]}`);
    });

    rc.push(`registry=${options.registry || configs.registry}`);
    rc.push(`disturl=${options.disturl || configs.disturl}`);

    fs.writeFileSync('.npmrc', rc.join('\n'));

    shell.spawn(configs.yarn, args);

    // 操作结束之后要恢复配置文件
    fs.unlinkSync('.npmrc');
};

exports.install = function(packages, options = {}) {
    var args;
    if (packages.length) {
        args = ['add'];
    } else {
        args = ['install'];
    }
    args = args.concat(packages);
    this.setOptions(args, options);
    this.spawn(args, options);
};

exports.uninstall = function(packages, options) {
    var args = ['remove'].concat(packages);
    this.setOptions(args, options);
    this.spawn(args, options);
};

exports.update = function(packages, options) {
    var args = ['upgrade'].concat(packages);
    this.setOptions(args, options);
    this.spawn(args, options);
};