var Cubb = require('cubb');
var cubb = new Cubb();

function log(content) {
    var text = cubb.render(content);
    text = text.replace(/^\n+|\n+$/g, '');
    console.log(text);
}

log.info = function(text) {
    var args = [
        '<bgBlackBright><cyanBright><b> INFO </b></cyanBright></bgBlackBright>',
        text
    ];

    log(args.join(' '));
};

log.warn = function(text) {
    var args = [
        '<bgBlackBright><yellowBright><b> WARN </b></yellowBright></bgBlackBright>',
        text
    ];

    log(args.join(' '));
};

log.error = function(text) {
    var args = [
        '<bgBlackBright><redBright><b> ERROR </b></redBright></bgBlackBright>',
        text
    ];

    log(args.join(' '));
};

log.success = function(text) {
    var args = [
        '<bgBlackBright><greenBright><b> SUCCESS </b></greenBright></bgBlackBright>',
        text
    ];

    log(args.join(' '));
};

log.red = function(text) {
    log('<redBright>' + text + '</redBright>');
};

log.cyan = function(text) {
    log('<cyanBright>' + text + '</cyanBright>');
};

log.blue = function(text) {
    log('<blueBright>' + text + '</blueBright>');
};

log.green = function(text) {
    log('<greenBright>' + text + '</greenBright>');
};

log.yellow = function(text) {
    log('<yellowBright>' + text + '</yellowBright>');
};

log.magenta = function(text) {
    log('<magentaBright>' + text + '</magentaBright>');
};

module.exports = log;