var path = require('path');
var Module = require('module');

module.exports = function(id, from) {
    try {
        var __filename = path.join(from, 'none.js');
        return Module._resolveFilename(id, {
            id: __filename,
            filename: __filename,
            paths: Module._nodeModulePaths(from)
        });
    } catch(e) {
        return null;
    }
};
