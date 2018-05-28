var Spinner = require('cli-spinner').Spinner;

// loading
var spinner = null;
var loading = function(text) {
    if (spinner) {
        spinner.setSpinnerTitle(text);
    } else {
        spinner = new Spinner(text);
        spinner.setSpinnerString(18);
        spinner.start();
    }
};

loading.close = function() {
    if (spinner) {
        spinner.stop(true);
        spinner = null;
    }
};

process.on('unhandledRejection', e => {
    loading.close();
    console.error(e);
    process.exit(1);
});

module.exports = loading;
