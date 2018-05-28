var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var log = require('./src/lib/utils/log');

var source = path.resolve(__dirname, 'src');
var target = path.resolve(__dirname, 'app');
var isDev = !!~process.argv.indexOf('--dev');

if (isDev) {
    fs.watch(source, {recursive: true}, build);
} else {
    build();
}

function build(eventType, filename) {
    var files;
    if (filename) {
        files = [path.resolve(source, filename)];
    } else {
        files = traversal(source);
    }
    log.cyan('准备编译...');
    files.forEach(transform);
    log.cyan('编译结束.\n');
}

function transform(file) {
    log.magenta('开始编译: ' + file);
    var filePath = path.relative(source, file);
    var fullPath = path.resolve(target, filePath);

    try {
        var ret = babel.transformFileSync(file, {
            "presets": [
                ["env",{
                    "targets": {
                        "node": "4.0"
                    }
                }]
            ],
            "plugins": [
                ["transform-runtime", {
                    "helpers": false,
                    "polyfill": false,
                    "regenerator": true,
                    "moduleName": "babel-runtime"
                }]
            ]
        });

        writeFile(fullPath, ret.code);
        log.green('编译成功: ' + fullPath);
    } catch(e) {
        log.red('编译失败: ' + fullPath);
    }
}

function traversal(dir) {
    var files = [];

    fs.readdirSync(dir).forEach(function(name) {
        var full = path.resolve(dir, name);
        if (fs.statSync(full).isFile()) {
            files.push(full);
        } else {
            files = files.concat(traversal(full));
        }
    });

    return files;
}

function writeFile(filename, content) {
    var p = path.relative(__dirname, filename);
    var d = p.split(/[\/\\]/);
    var f = __dirname;
    while (d.length > 1) {
        f = path.resolve(f, d.shift());
        if (!fs.existsSync(f)) fs.mkdirSync(f);
    }

    fs.writeFileSync(filename, content);
}