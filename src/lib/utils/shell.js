var spawn = require('child_process').spawnSync;

/**
 * exec command string
 * @param {string} cmd
 * @param {string|number|Object} [cwd]
 * @param {Object|number} [env]
 * @param {number} [mode] 0 - 继承模式, 1 - 带返回结果, 2 - 静默模式, 1x - shell模式
 */
exports.exec = function(cmd, cwd, env, mode = 0) {
    var isShell = false;

    for (var i = Math.min(arguments.length - 1, 4) - 1; i >= 0 ; i--) {
        if (typeof arguments[i] === 'number') {
            isShell = arguments[i] >= 10 && arguments[i] < 20;
            break;
        }
    }

    if (isShell) {
        return this.spawn(cmd, [], cwd, env, mode);
    } else {
        var args = cmd.split(/ +/);
        return this.spawn(args.shift(), args, cwd, env, mode);
    }
};

/**
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {string|number|Object} [cwd]
 * @param {Object|number} [env]
 * @param {number} [mode] 0 - 继承模式, 1 - 带返回结果, 2 - 静默模式, 1x - shell模式
 */
exports.spawn = function(cmd, args, cwd, env, mode = 0) {
    var type;

    type = typeof cwd;
    if (type === 'object') {
        env = cwd;
        cwd = process.cwd();
    } else if (type === 'number') {
        mode = cwd;
        env = process.env;
        cwd = process.cwd();
    }

    type = typeof env;
    if (type === 'number') {
        mode = env;
        env = process.env;
    }

    var options = {};
    options.env = env || process.env;
    options.cwd = cwd || process.cwd();

    switch (mode) {
        case 0:
        case 10:
            options.stdio = 'inherit';
            break;
        case 1:
        case 11:
            options.encoding  = 'utf8';
            break;
        case 2:
        case 12:
            break;
    }

    if (mode >= 10 && mode < 20) options.shell = true;

    var ret = spawn(cmd, args, options);

    if (mode === 1 || mode === 11) {
        return ret.stdout && ret.stdout.replace(/^\n+|\n+$/, '');
    } else {
        return ret;
    }
};

exports.which = function(app) {
    return this.exec(`which ${app}`, 11);
};
