#!/usr/bin/env node

var sudo = require('../lib/utils/sudo');

(async function() {
    await sudo();

    require('./command');
})();
