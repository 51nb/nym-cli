try {
    var config = require('../lib/utils/config');
    config.npmDel(['prefix', 'registry', 'nbm-last-check', 'nbm-auto-check', 'nbm-use', 'global']);
} catch(e) {}
