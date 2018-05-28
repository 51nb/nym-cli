var npm = require('../../../lib/utils/npm');
var Package = require('../../../lib/utils/package');

module.exports = function() {
    var args = process.argv.slice(2);
    if (args.length) {
        npm.spawn(args);

        if (Package.hasNpmLock() && Package.hasYarnLock()) {
            Package.delNpmLock();
        }
    } else {
        this.showHelp();
    }
};