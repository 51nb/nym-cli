var fs = require('fs');
var path = require('path');
var helper = require('../../../lib/utils/helper');
var Package = require('../../../lib/utils/package');
var loading = require('../../../lib/utils/loading');
var log = require('../../../lib/utils/log');

module.exports = async function(packages) {
    if (!packages.length) this.showHelp();

    loading('正在查找，请耐心等待...');

    var pkgs = {};
    for (let pkg of helper.aliasNames(packages)) {
        pkgs[pkg] = {
            name: pkg,
            version: await Package.getLatest(pkg),
            locals: []
        }
    }

    scan(process.cwd(), pkgs);

    loading.close();

    var rows = [];
    rows.push(`| Package | Current | Latest | Location |`);
    rows.push(`| ------- | ------: | -----: | -------- |`);

    for (let i in pkgs) {
        if (!pkgs.hasOwnProperty(i)) continue;
        let pkg = pkgs[i];
        let version = pkg.version ? `<green>${pkg.version}</green>` : `<gray>-</gray>`;
        if (!pkg.locals.length) {
            rows.push(`| <gray>${pkg.name}</gray> | <gray>-</gray> | ${version} | <gray>-</gray> |`);
        } else {
            pkg.locals.forEach(p => {
                let name = pkg.version === p.version ? `<cyan>${pkg.name}</cyan>` : `<red>${pkg.name}</red>`;
                let location = path.relative(process.cwd(), p.location);
                rows.push(`| ${name} | ${p.version} | ${version} | ${location} |`);
            });
        }
    }

    log('\n');
    log(rows.join('\n'));
    log('\n');
};

function scan(dir, pkgs) {
    fs.readdirSync(dir, pkgs).forEach(name => {
        var fullPath = path.resolve(dir, name);
        if (fs.lstatSync(fullPath).isDirectory()) {
            helper.safeRun(function() {
                var pkg = fs.readFileSync(path.resolve(fullPath, 'package.json'), 'utf8');
                pkg = JSON.parse(pkg);

                if (pkgs[pkg.name]) {
                    pkgs[pkg.name].locals.push({
                        version: pkg.version,
                        location: fullPath
                    });
                }
            });

            scan(fullPath, pkgs);
        }
    });
}