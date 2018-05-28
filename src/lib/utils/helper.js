/**
 * 检测是否为publish命令
 * @param cmd
 * @returns {boolean}
 */
exports.isPublish = function(cmd) {
    return /^pu/.test(cmd);
};

/**
 * 判断是否为内部包
 * @param {string} pkg
 * @returns {boolean}
 */
exports.isInternal = function(pkg) {
    return pkg && /^@(u51|nb)\//.test(pkg);
};

/**
 * 包别名
 * @param {string|string[]} names
 * @returns {string[]}
 */
exports.aliasNames = function(names) {
    if (!Array.isArray(names)) names = [names];
    return names.map(name => {
        name = name.toLowerCase();

        return ({
            "nbm-cli": "@u51/nbm-cli",
            "fe-cli": "@u51/fe-cli",
            "nbm": "@u51/nbm-cli",
            "fe": "@u51/fe-cli"
        })[name] || (/^([@^])(?!([\w\-]+)\/)/.test(name) ? `${({
            '@': '@u51', 
            '^': '@nb'
        })[RegExp.$1]}/${name.substr(1)}` : name);
    });
};

/**
 * scope包名
 * @param {string|string[]} names
 * @param {string} scope
 * @returns {string[]}
 */
exports.scopeNames = function(names, scope) {
    if (scope && /^@/.test(scope)) {
        if (!Array.isArray(names)) names = [names];
        return names.map(name => `${scope}/${name}`);
    }

    return names;
};

/**
 * 取真正的包名，排除tag和版本号
 * @param {string} name
 * @returns {string}
 */
exports.realName = function(name) {
    var index = name.indexOf('@', 1);
    return index === -1 ? name : name.substr(0, index);
};

/**
 * 延迟指定毫秒数
 * @param ms
 * @returns {Promise<void>}
 */
exports.delay = function(ms) {
    return new Promise((resolve => setTimeout(resolve, ms)));
};

/**
 * 屏蔽运行错误
 * @param fn
 */
exports.safeRun = function(fn) {
    try {
        return typeof fn === 'function' && fn();
    } catch(e) {}
};

/**
 * 根据选项创建参数
 * @param args
 * @param options
 * @param maps
 */
exports.createArgs = function(args = [], options = {}, maps = {}) {
    for (let key in options) {
        if (!options.hasOwnProperty(key)) continue;
        if (key in maps) {
            let map = maps[key];
            let val = options[key];
            switch (typeof val) {
                case 'string':
                    if (val) {
                        args.push(`${map}=${val}`);
                    }
                    break;
                case 'object':
                    if (Array.isArray(val) && val.length) {
                        args.push(map);
                        args = args.concat(val);
                    }
                    break;
                case 'boolean':
                    if (/^!/.test(map)) {
                        if (!val) args.push(map.substr(1));
                    } else {
                        if (val) args.push(map);
                    }
                    break;
            }
        }
    }
};
