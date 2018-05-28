var os = require('os');
var fs = require('fs');
var path = require('path');
var attr = require('winattr');
var shell = require('./shell');

var isWin = /^win/i.test(os.platform());
var configFile = path.resolve(os.homedir(), '.nbconfig');
var nbConfigs;
var npmConfigs;

/**
 * 读取配置
 * @param {string} [key]
 * @returns {*}
 */
exports.get = function(key) {
    var configs;
    if (nbConfigs) {
        configs = nbConfigs;
    } else {
        try {
            configs = fs.readFileSync(configFile, 'utf8');
            configs = JSON.parse(configs);
            nbConfigs = configs;
        } catch(e) {
            configs = {};
        }
    }

    if (key) {
        return configs[key];
    } else {
        return configs;
    }
};

exports.set = function(key, value) {
    var configs = this.get();

    var data = key;
    if (typeof key === 'string') {
        data = {
            [key]: value
        }
    }

    for (var i in data) {
        if (!data.hasOwnProperty(i)) continue;
        configs[i] = data[i];
    }

    save(configs);
};

exports.del = function(keys) {
    if (keys === undefined) return;
    if (!Array.isArray(keys)) keys = [];

    var configs = this.get();
    keys.forEach(key => delete configs[key]);

    save(configs);
};

function save(configs) {
    nbConfigs = null;
    fs.writeFileSync(configFile, JSON.stringify(configs, null, 4));
    if (isWin) attr.setSync(configFile, { hidden: true });
    nbConfigs = configs;
}

/**
 * 获取当前用户npm全局配置, 比使用npm config命令更快
 * @param {string} [key]
 * @returns {*}
 */
exports.npmGet = function(key) {
    if (!npmConfigs) {
        var configs = {};
        var home = os.homedir();
        var npmrc = path.resolve(home, '.npmrc');
        if (fs.existsSync(npmrc)) {
            npmrc = fs.readFileSync(npmrc, 'utf8');
        } else {
            npmrc = shell.exec('npm config list', 1);
        }

        npmrc.split(/\r?\n/).forEach(function(row) {
            if (row && !/^; /.test(row)) {
                var index = row.indexOf('=');
                var key = row.substring(0, index).trim();
                var value = row.substring(index + 1).trim();
                value = value.replace(/^"|"$/g, '');
                try {
                    value = JSON.parse(value)
                } catch(e) {}
                configs[key] = value;
            }
        });

        npmConfigs = configs;
    }

    if (key) {
        return npmConfigs[key];
    } else {
        return npmConfigs;
    }
};

/**
 * 设置当前用户npm全局配置, 比使用npm config命令更快
 * @param {object} params
 * @returns {*}
 */
exports.npmSet = function(params) {
    npmConfigs = null;

    var home = os.homedir();
    var npmrc = path.resolve(home, '.npmrc');
    var configs = this.npmGet();

    for (var i in params) {
        if (!params.hasOwnProperty(i)) continue;
        configs[i] = params[i];
    }

    var content = '';
    for (var j in configs) {
        if (!configs.hasOwnProperty(j)) continue;
        content += j + '=' + configs[j] + '\n';
    }

    fs.writeFileSync(npmrc, content);

    npmConfigs = configs;
};

exports.npmDel = function(keys) {
    if (keys === undefined) return;
    if (!Array.isArray(keys)) keys = [keys];

    npmConfigs = null;

    var home = os.homedir();
    var npmrc = path.resolve(home, '.npmrc');
    var configs = this.npmGet();

    keys.forEach(function(key) {
        delete configs[key]
    });

    var content = '';
    for (var j in configs) {
        if (!configs.hasOwnProperty(j)) continue;
        content += j + '=' + configs[j] + '\n';
    }

    fs.writeFileSync(npmrc, content);

    npmConfigs = configs;
};