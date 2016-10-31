/**
 * Builder Module.
 * V0.1-181016
 *
 * Last Updates:
 * -
 */

const path = require("path");
const fs = require('fs');
const logger = require('./Noty.js');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var noty = new logger.Noty("all");

/**
 * Constructor.
 * @constructor
 */
function Box(example) {
    this.appPath = path.dirname(require.main.filename);
    this.moduleAbsPath = __dirname;
    this.myPack = path.resolve(this.moduleAbsPath, 'package.json');
    this.appPack = path.resolve(this.appPath, 'package.json');
    this.wpConfig = path.resolve(this.moduleAbsPath, 'webpack-dev-server.config.js');
    this.wpConfigDev = path.resolve(this.moduleAbsPath, 'superbox-dev-server.config.js');

    // Read our package.json
    var wb_pack = JSON.parse(fs.readFileSync(this.myPack, 'utf8'));

    // Read app package.json
    try {
        var app_pack = JSON.parse(fs.readFileSync(this.appPack, 'utf8'));
    } catch (e) {
        noty.log('Cannot find package.json, please create it first.', 'err');
        process.exit(1);
    }

    // Setup devDependencies in the app package.json
    for (var module in wb_pack['devDependencies']) {
        if (app_pack['devDependencies'] === undefined) {
            app_pack['devDependencies'] = {};
        }
        if (app_pack['devDependencies'][module] !== undefined) continue;
        app_pack['devDependencies'][module] = wb_pack['devDependencies'][module];
        noty.log('devDependencies added = ' + module + ": " + wb_pack['devDependencies'][module]);
    }

    // Setup dependencies in the app package.json
    for (var module in wb_pack['dependencies']) {
        if (app_pack['dependencies'] === undefined) {
            app_pack['dependencies'] = {};
        }
        if (app_pack['dependencies'][module] !== undefined) continue;
        app_pack['dependencies'][module] = wb_pack['dependencies'][module];
        noty.log('dependencies added = ' + module + ": " + wb_pack['dependencies'][module]);
    }

    // Setup scripts
    if (app_pack['scripts'] === undefined) app_pack['scripts'] = {};
    app_pack['scripts']['superbox'] = wb_pack['scripts']['superbox'];
    app_pack['scripts']['superboxdev'] = wb_pack['scripts']['superboxdev'];

    // Save changes
    fs.writeFile(this.appPack, JSON.stringify(app_pack, null, 2), (err) => {
        if (err) throw err;
        noty.log('A new package.json for Your app was created!', 'done');
        this.setupWebpack();
    });

    // Creates .babelrc file
    var babel = {"presets":["es2015", "react"]};
    fs.writeFileSync(path.join(this.appPath, '.babelrc'), JSON.stringify(babel, null, 2));
    noty.log('A .babel file was created!', 'done');
}

/**
 * All next methods creates and setup webpack configs.
 */
Box.prototype.setupWebpack = function() {

    // Prepare default webpack settings
    var default_settings = {
        "entry": null,
        "output": null,
        "outName": "app.js",
        "index": null,
        "port": "3000"
    };

    noty.log('Please, enter settings for webpack.', 'info');

    rl.question(' Entry point of your app: ', (answer) => { // get entry point
        default_settings.entry = answer;

        rl.question(' Build path: ', (answer) => { // get content base
            default_settings.output = answer;

            rl.question(' Output name (app.js): ', (answer) => { // get output filename
                if (answer != "" && answer != null)
                    default_settings.outName = answer;

                rl.question(' Index Folder (for DevServer): ', (answer) => {
                    if (answer != "" && answer != null) {
                        default_settings.index = answer;
                    } else {
                        noty.log('Cannot get Index Folder. Try again.', 'err');
                    }
                    rl.question(' DevServer Port (3000): ', (answer) => {
                        if (answer != "" && answer != null)
                            default_settings.port = answer;
                        this.makeConfig(default_settings);
                        rl.close();
                    });
                });
            });
        });
    });
}

Box.prototype.makeConfig = function(settings) {
    var boxConfig = this.wpConfig;
    var boxConfigDev = this.wpConfigDev;

    var appConfig = path.resolve(this.appPath, 'webpack-dev-server.config.js');
    var appConfigDev = path.resolve(this.appPath, 'superbox-dev-server.config.js');

    this.replaceConfigs(boxConfig, appConfig, settings);
    this.replaceConfigs(boxConfigDev, appConfigDev, settings);

    /*fs.readFile(boxConfig, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var cfg = data.replace(/WP_BUILD_PATH/g, settings.output);
        cfg = cfg.replace(/WP_ENTRY_POINT/g, settings.entry);
        cfg = cfg.replace(/WP_OUTPUT_NAME/g, settings.outName);

        fs.writeFile(appConfig, cfg, 'utf8', function (err) {
            if (err) return console.log(err);
        });
        noty.log('Webpack config was created at: ', 'done');
        noty.log(appConfig);
    });*/
}

Box.prototype.replaceConfigs = function (template, origin, settings) {
    fs.readFile(template, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var cfg = data.replace(/WP_BUILD_PATH/g, settings.output);
        cfg = cfg.replace(/WP_ENTRY_POINT/g, settings.entry);
        cfg = cfg.replace(/WP_OUTPUT_NAME/g, settings.outName);
        cfg = cfg.replace(/WP_CONTENT_BASE/g, settings.index);
        cfg = cfg.replace(/WP_SERVER_PORT/g, settings.port);

        fs.writeFile(origin, cfg, 'utf8', function (err) {
            if (err) return console.log(err);
        });
        noty.log('Webpack config was created at: ', 'done');
        noty.log(origin);
    });
}

exports.Box = Box;