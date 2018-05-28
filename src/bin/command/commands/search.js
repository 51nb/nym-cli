var configs = require('../../../lib/configs');
var openUrl = require('../../../lib/utils/openUrl');
var shell = require('../../../lib/utils/shell');

module.exports = function(keyword, options) {
    if (options.browser) {
        var url;
        if (options.npm) {
            url = `${configs.official}/search?q=${keyword}`;
        } else {
            url = `${configs.homepage}/browse/keyword/${keyword}`;
        }

        openUrl(url);
    } else {
        var args = ['search', keyword];
        if (options.long) args.push('--long');

        var registry = configs[options.npm ? 'masterRegistry' : 'searchRegistry'];
        args.push(`--registry=${registry}`);

        shell.spawn(configs.npm, args);
    }
};
