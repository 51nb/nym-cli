var path = require('path');
var spawn = require('child_process').spawnSync;

var configs = {
    bin: 'nbm',
    name: 'nbm-cli',
    pkgName: require('../../package.json').name,
    env: {
        // 二进制包镜像
        SASS_BINARY_SITE: "http://npm.taobao.org/mirrors/node-sass",
        ELECTRON_MIRROR: "http://npm.taobao.org/mirrors/electron/",
        SQLITE3_BINARY_SITE: "http://npm.taobao.org/mirrors/sqlite3",
        PYTHON_MIRROR: "http://npm.taobao.org/mirrors/python",
        PHANTOMJS_CDNURL: "http://npm.taobao.org/mirrors/phantomjs",
        CHROMEDRIVER_CDNURL: "http://npm.taobao.org/mirrors/chromedriver",
        OPERADRIVER_CDNURL: "http://npm.taobao.org/mirrors/operadriver",
        NPM_CONFIG_FSE_BINARY_HOST_MIRROR: "http://npm.taobao.org/mirrors/fsevents/",
        // npm更新提示
        NO_UPDATE_NOTIFIER: true,
    },
    disturl: "https://npm.taobao.org/dist",
    registry: "https://registry.npm.taobao.org",
    homepage: "http://npm.taobao.org",
    official: "https://www.npmjs.com",
    searchRegistry: "http://npmreg.mirrors.ustc.edu.cn",
    sourceRegistry: "https://registry.npm.taobao.org",
    masterRegistry: "http://registry.npmjs.org",
    npm: path.resolve(__dirname, '../../node_modules/.bin/npm'),
    npx: path.resolve(__dirname, '../../node_modules/.bin/npx'),
    yarn: path.resolve(__dirname, '../../node_modules/.bin/yarn'),
    keys: {
        use: 'nbmUse'
    }

};

Object.defineProperty(configs, 'prefix', {
    get() {
        return spawn('npm', ['prefix', '-g'], { encoding : 'utf8' }).stdout.replace(/^\n+|\n+$/, '');
    }
});

module.exports = configs;
