var fs = require('fs');
var shell = require('./shell');
var helper = require('./helper');
var request = require('./request');
var configs = require('../configs');

/**
 * 获取某个包的仓库版本
 * @param {string} name
 * @param {string} tag
 * @returns {Promise<*>}
 */
exports.getInfo = async function(name = configs.pkgName, tag = 'latest') {
    let registry = helper.isInternal(name) ? configs.registry : configs.sourceRegistry;
    try {
        return await request(`${registry}/${name}/${tag}`);
    } catch(e) {
        return {};
    }
};

/**
 * 获取某个包的最新版本
 * @param name
 * @returns {Promise<string>}
 */
exports.getLatest = async function(name) {
    var pkg = await this.getInfo(name);
    return pkg.version;
};

/**
 * 返回某个包的最新版本
 * @param {string} pkg
 * @return {string}
 */
exports.getLatestSync = function(pkg) {
    return shell.exec('npm view ' + pkg + ' version --registry ' + configs.registry, 1);
};

exports.DEP_TYPE = {
    dependencies: 'prod',
    devDependencies: 'dev',
    optionalDependencies: 'optional',
    peerDependencies: 'peer'
};

/**
 * 获取依赖
 * @param {string|string[]} [part] - dependencies, devDependencies, optionalDependencies, peerDependencies[, allDependencies], //bundledDependencies//
 * @param {boolean} [json=false] - 是否返回json
 * @returns {Array}
 */
exports.getDependencies = function(part, json) {
    try {
        var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

        var deps = [];
        var maps = {};
        var parts = [];

        if (!part) {
            parts = 'dependencies';
        } else if (part === 'all') {
            parts = Object.keys(this.DEP_TYPE);
        } else if (typeof part === 'string') {
            parts = [].slice.call(arguments);
        } else if (Array.isArray(part)) {
            parts = part;
        }

        parts.forEach(part => {
            let depType = this.DEP_TYPE[part];
            let dependencies = pkg[part];
            if (depType && dependencies && typeof dependencies === 'object') {
                for (let p in dependencies) {
                    if (!dependencies.hasOwnProperty(p)) continue;
                    deps.push(maps[p] = {
                        name: p,
                        type: depType,
                        version: dependencies[p],
                        position: part
                    });
                }
            }
        });

        return json ? maps : deps;
    } catch(e) {
        return json ? {} : [];
    }
};

exports.hasPackageJSON = function() {
    return fs.existsSync('package.json');
};

exports.hasNpmLock = function() {
    return fs.existsSync('package-lock.json');
};

exports.hasYarnLock = function() {
    return fs.existsSync('yarn.lock');
};

exports.delNpmLock = function() {
    try {
        fs.unlinkSync('package-lock.json');
    } catch(e) {}
};

exports.delYarnLock = function() {
    try {
        fs.unlinkSync('yarn.lock');
    } catch(e) {}
};

exports.read = function() {
    return JSON.parse(fs.readFileSync('package.json', 'utf8'));
};

exports.save = function(pkg) {
    var text = fs.readFileSync('package.json', 'utf8');
    var tabs = /\s{4}"name"/.test(text) ? 4 : 2;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, tabs));
};

exports.sync = async function(packages, options) {
    var result = {
        success: [],
        failure: []
    };

    for (let name of packages) {
        let url = `${configs.registry}/${name}/sync`;
        try {
            let data = await request.put(url, {
                params: {
                    publish: options.syncPublish,
                    nodeps: !options.dependencies
                }
            });

            if (!data || !data.ok) {
                result.failure.push(name);
                continue;
            }

            var info = {
                name: name,
                lastLines: 0,
                logUrl: `${configs.registry}/${name}/sync/log/${data.logId}`
            };

            await showLog(info);
            result.success.push(name);
        } catch(e) {
            result.failure.push(name);
        }
    }

    return result;
};

async function showLog(info) {
    var url = info.logUrl + '?offset=' + info.lastLines;

    var data = await request(url);

    if (!data || !data.log) {
        await helper.delay(2000);
        await showLog(info);
    } else {
        var log = data.log.trim();
        var logs = log.split('\n');
        info.lastLines += logs.length;
        logs = logs.filter(log => !/^(Success|Fail)/.test(log));
        console.log(logs.join('\n'));
        if (!~log.indexOf('[done] Sync ' + info.name)) {
            await helper.delay(2000);
            await showLog(info);
        }
    }
}
