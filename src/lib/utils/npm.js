var fs = require('fs');
var log = require('./log');
var helper = require('./helper');
var Package = require('./package');
var configs = require('../configs');
var spawn = require('child_process').spawnSync;

const DEP_VERSION = /^([^\d])(?!0)*/;

exports.setOptions = function(args, options = {}) {
    var maps = {
        saveDev: '--save-dev',
        saveOptional: '--save-optional',
        saveBundle: '--save-bundle',
        saveExact: '--save-exact',
        saveTilde: '--save-tilde',
        savePeer: '--save-peer',
        global: '--global',
        force: '--force',
        tag: '--tag',
        dryRun: '--dry-run',
        globalStyle: '--global-style',
        legacyBundling: '--legacy-bundling',
        ignoreScripts: '--ignore-scripts',
        link: '--link',
        binLinks: '!--no-bin-links',
        optional: '!--no-optional',
        shrinkwrap: '!--no-shrinkwrap',
        lock: '!--no-package-lock',
        packageLock: '!--no-package-lock',
        save: '!--no-save',
        silent: '--silent',
        prod: '--production',
        production: '--production',
        only: '--only',
        depth: '--depth'
    };

    helper.createArgs(args, options, maps);
};

exports.spawn = function(args, options = {}) {
    var env = Object.create(process.env);
    Object.keys(configs.env).forEach(function(key) {
        env[key] = configs.env[key];
    });

    env.NPM_CONFIG_REGISTRY = options.registry || configs.registry;
    env.NPM_CONFIG_DISTURL = options.disturl || configs.disturl;
    env.NPM_CONFIG_PREFIX = configs.prefix;

    if (args[0] === 'link') args.push('--local');

    // https://github.com/npm/npm/issues/4603
    ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(sig => process.once(sig, () => process.emit(sig)));

    spawn(configs.npm, args, {
        env: env,
        stdio: 'inherit',
    });
};

exports.install = function(packages, options = {}) {
    var callback;

    if (packages.length && !options.global && (options.savePeer || options.saveTilde)) {
        var dependencies = Package.getDependencies('all', true);

        callback = function() {
            var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

            if (options.saveTilde) {
                packages.forEach(name => {
                    name = helper.realName(name);
                    if (pkg.dependencies[name]) {
                        pkg.dependencies[name] = pkg.dependencies[name].replace(DEP_VERSION, '~');
                    } else if (pkg.devDependencies[name]) {
                        pkg.devDependencies[name] = pkg.devDependencies[name].replace(DEP_VERSION, '~');
                    } else if (pkg.optionalDependencies[name]) {
                        pkg.optionalDependencies[name] = pkg.optionalDependencies[name].replace(DEP_VERSION, '~');
                    }
                });
            }

            if (options.savePeer) {
                if (!pkg.peerDependencies) {
                    pkg.peerDependencies = {};
                }

                var useless = [];
                var warnings = [];
                packages.forEach(name => {
                    name = helper.realName(name);
                    let d = dependencies[name];
                    if (d && d.type !== Package.DEP_TYPE.peerDependencies) {
                        warnings.push(`"${d.name}"已存在于"${d.position}", 必需先移除之后才能保存到peerDependencies.`);
                    } else {
                        if (pkg.dependencies[name]) {
                            pkg.peerDependencies[name] = pkg.dependencies[name];
                            delete pkg.dependencies[name];
                        } else if (pkg.devDependencies[name]) {
                            pkg.peerDependencies[name] = pkg.devDependencies[name];
                            delete pkg.devDependencies[name];
                        }

                        useless.push(name);
                    }
                });

                helper.safeRun(function() {
                    var pkgLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
                    useless.forEach(name => delete pkgLock.dependencies[name]);
                    fs.writeFileSync('package-lock.json', JSON.stringify(pkgLock, null, 2));
                });

                warnings.forEach(log.warn);
            }

            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        }
    }

    var args = ['install'].concat(packages);
    this.setOptions(args, options);
    this.spawn(args, options);

    if (callback) helper.safeRun(callback);
};


exports.update = function(packages, options) {
    var callback;

    helper.safeRun(function() {
        if (options.scope || options.pattern || options.latest) {
            var dependencies = Package.getDependencies('all', true);
            var depNameLists = Object.keys(dependencies);

            var exp = [];
            if (options.scope) exp.push(`(^${options.scope}\\/)`);
            if (options.pattern) exp.push(`(${options.pattern})`);
            var regexp = exp.join('|');
            if (regexp) {
                regexp = new RegExp(regexp);
                packages = packages.concat(depNameLists.filter(name => regexp.test(name)));
            }

            if (options.latest) {
                var rule;
                if (options.saveExact) {
                    rule = '';
                } else if (options.saveTilde) {
                    rule = '~';
                } else if (options.saveCaret) {
                    rule = '^';
                } else {
                    rule = '$&';
                }

                if (!packages.length) packages = depNameLists;

                var jobs = [];
                var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                for (let name of packages) {
                    name = helper.realName(name);
                    let d = dependencies[name];
                    let latest = Package.getLatestSync(name);
                    if (latest && d && pkg[d.position] && pkg[d.position][d.name]) {
                        let mark = pkg[d.position][d.name].match(DEP_VERSION)[0].replace(/^.+$/, rule);
                        let version = pkg[d.position][d.name] = mark + latest;
                        jobs.push({
                            name: d.name,
                            version: version,
                            position: d.position
                        });
                    }
                }
                fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

                // npm update 可能会修改匹配规则，因此需要在结束之后再写一次
                callback = function() {
                    var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                    jobs.forEach(job => pkg[job.position][job.name] = job.version);
                    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
                };
            }

            let exist = {};
            packages = packages.filter(name => {
                name = helper.realName(name);
                if (exist[name]) return false;
                return exist[name] = true;
            });
        }
    });

    if ((options.scope || options.pattern) && !packages.length) return;

    var args = ['update'].concat(packages);
    this.setOptions(args, options);
    this.spawn(args, options);

    if (callback) helper.safeRun(callback);
};

exports.uninstall = function(packages, options) {
    var args = ['uninstall'].concat(packages);
    this.setOptions(args, options);
    this.spawn(args, options);
};
