var fs = require('fs');
var path = require('path');
var shell = require('../../../lib/utils/shell');
var configs = require('../../../lib/configs');

/**
 *
 * @param {string} [target] <tarball|folder>
 * @param options
 */
module.exports = function(target, options) {
    if (target) {
        target = path.resolve(process.cwd(), target);
    } else {
        target = process.cwd();
    }

    var message;
    if (fs.existsSync(target)) {
        // 不常用tarball, 不作处理
        if (fs.statSync(target).isDirectory()) {
            var pkg = path.resolve(target, 'package.json');
            if (fs.existsSync(pkg)) {
                pkg = require(pkg);
                var version = pkg.version;
                if (/-([a-z]+)\.\d+/.test(version)) {
                    if (/(alpha|beta|dev|test)/.test(RegExp.$1)) {
                        options.tag = RegExp.$1;
                    } else if (options.tag !== RegExp.$1) {
                        message = `请为版本号[${version}]指定正确的tag`;
                    }
                }
            } else {
                message = '找不到package.json文件, 请使用nbm init初始化';
            }
        }
    } else {
        message = '待发布目标不存在';
    }

    if (message) {
        console.log('');
        console.log('    ' + message);
        console.log('');
        process.exit(1);
    }

    var args = ['publish'].concat(process.argv.slice(3));
    for (let i = 1; i < args.length; i++) {
        if (args[i] === '--tag') {
            if (args[i + 1] && !/^-/.test(args[i + 1])) {
                args.splice(i, 2);
            } else {
                args.splice(i, 1);
            }
            break;
        } else if (/^--tag=/.test(args[i])) {
            args.splice(i, 1);
            break;
        }
    }
    if (options.tag) {
        args.push(`--tag=${options.tag}`);
    }
    if (options.registry) {
        args.push(`--registry=${options.registry}`);
    }

    shell.spawn(configs.npm, args);
};
