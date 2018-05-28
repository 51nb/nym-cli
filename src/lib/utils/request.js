var fs = require('fs');
var path = require('path');
var Url = require('url');
var http = require('http');
var https = require('https');
var queryString = require('querystring');

/**
 * 发送请求
 * @param {string} url
 * @param {Object|function} options
 * @param [options.url] - url
 * @param [options.data] - data
 * @param [options.form] - 是否表单提交
 * @param [options.timeout] - timeout 5000ms
 * @param [options.headers] - 包含请求头的对象。
 * @param [options.method] - 指定 HTTP 请求方法的字符串。默认为 'GET'。
 */
function request(url, options = {}) {
    options = JSON.parse(JSON.stringify(options));

    if (url && typeof url === 'object') {
        url = options.url;
    }

    var data = '';
    if (options.data) {
        if (options.form) {
            data = queryString.stringify(options.data);
            options.headers = assign({}, options.headers, {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            });
        } else {
            data = JSON.stringify(options.data);
            options.headers = assign({}, options.headers, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            });
        }
    }

    resolveUrl(url, options);

    return new Promise((resolve, reject) => {
        options.timeout = options.timeout || 600000;

        var Http = options.protocol === 'https:' ? https : http;
        var req = Http.request(options, function(res) {
            var data = '';

            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                try {
                    res.data = data;
                    res.data = JSON.parse(data);
                } catch(e) {}

                // 请求结束
                var status = res.statusCode;
                if (status >= 200 && status < 300 || status === 304) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            });
        });

        // DNS 解析错误、TCP 级的错误、或实际的 HTTP 解析错误
        req.on('error', function(err) {
            reject(err);
        });

        // 超时
        req.on('timeout', function(err) {
            req.res && req.res.abort();
            req.abort();

            reject(err);
        });

        // 写入数据到请求主体
        req.write(data);

        // 请求结束
        req.end();
    });
}

request.get = function(url, options) {
    var opts = assign({}, options, { method: 'GET' });
    return request(url, opts);
};

request.delete = function(url, options) {
    var opts = assign({}, options, { method: 'DELETE' });
    return request(url, opts);
};

request.head = function(url, options) {
    var opts = assign({}, options, { method: 'HEAD' });
    return request(url, opts);
};

request.post = function(url, data, options) {
    var opts = assign({}, options, { method: 'POST', data: data });
    return request(url, opts);
};

request.put = function(url, data, options) {
    var opts = assign({}, options, { method: 'PUT', data: data });
    return request(url, opts);
};

request.download = function(url, target, options) {
    if (target && target.target) {
        options = target;
        target = options.target;
        delete options.target;
    }

    var dir;
    if (fs.existsSync(target)) fs.unlinkSync(target);
    if (!fs.existsSync(dir = path.dirname(target))) {
        mkdirs(dir);
    }

    resolveUrl(url, options);

    var Http = /^https:/.test(url) ? https : http;
    return new Promise((resolve, reject) => {
        var stream = fs.createWriteStream(target);
        Http.get(options, res => {
            res.pipe(stream);
            stream.on('finish', function() {
                stream.close(function() {
                    var status = res.statusCode;
                    if (status >= 200 && status < 300 || status === 304) {
                        resolve();
                    } else {
                        fs.unlinkSync(target);
                        reject({
                            status: res.statusCode,
                            message: res.statusMessage || 'Bad Request'
                        });
                    }
                });
            });
        }).on('error', err => {
            fs.unlinkSync(target);
            reject(err);
        });
    });
};

function resolveUrl(url, options) {
    if (options.params) {
        url += (!~url.indexOf('?') ? '?' : '') + queryString.stringify(options.params);
        delete options.params;
    }

    var opts = Url.parse(url);
    if (options.proxy) {
        if (!/^http(s?)/i.test(options.proxy)) {
            options.proxy = opts.protocol + '//' + options.proxy;
        }
        var proxies = Url.parse(options.proxy);
        options.host = proxies.hostname;
        options.port = proxies.port;
        options.path = url;
        options.headers = assign({}, options.headers, {
            Host: opts.hostname
        });
        delete options.proxy;
    } else {
        if (opts.protocol) options.protocol = opts.protocol;
        if (opts.hostname) options.hostname = opts.hostname;
        if (opts.port) options.port = opts.port;
        if (opts.auth) options.auth = opts.auth;
        if (opts.path) options.path = opts.path;
    }
}

function assign(target) {
    'use strict';
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

function mkdirs(dir) {
    var dirs = dir.split(/[\\\/]/);
    var full = dirs.shift();
    while (dirs.length) {
        full = full + path.sep + dirs.shift();
        if (!fs.existsSync(full)) {
            fs.mkdirSync(full);
        }
    }
}

module.exports = request;
