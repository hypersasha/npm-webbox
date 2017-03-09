/**
 * Server Module.
 * V0.1-181016
 *
 * Last Updates:
 * - setServerRoot added.
 */

var colors, express, fs, pathmodule, bodyParser;
const logger = require('./Noty.js');
var noty = new logger.Noty("done");
const https = require('https');

/**
 * Constructor.
 * @param
 * @constructor
 */
function Box() {
    colors = require('colors/safe');
    express = require('express');
    fs = require('fs');
    pathmodule = require('path');
    bodyParser = require('body-parser');

    noty.log(colors.cyan.bold('Starting WebBox.', 'done'));

    this.app = express();
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());                        // Include Express
    this.port = 80;                                         // Default listening port
    this.path = pathmodule.dirname(require.main.filename);  // Get project path
    this.module_path_abs = __dirname; // Get module path
    this.module_path = "/node_modules/webbox/";
    this.root = null;
    this.escapePaths = {};
}

/**
 * Starts web-server on port = <srv_port>
 * @param srv_port (Int): Port of your server
 */
Box.prototype.createServer = function(srv_port, ssl) {
    this.port = srv_port;

    // Start listening port

    if (ssl) { // start with SSL
        if (!ssl.key) {
            noty.log('Cannot find path to SSL key.', 'err');
            return;
        }
        if (!ssl.cert) {
            noty.log('Cannot find path to SSL certificate.', 'err');
            return;
        }

        var privateKey = fs.readFileSync( ssl.key );
        var certificate = fs.readFileSync( ssl.cert );

        https.createServer({
            key: privateKey,
            cert: certificate
        }, this.app).listen(this.port);
    } else {
        this.app.listen(this.port);
    }
    noty.log('Server listening on port *:' + this.port, 'done');
};

/**
 * Makes directory as root of the server.
 * @param dir (String): Path to directory, which will be the root of the server
 */

Box.prototype.setServerRoot = function(dir){

    if (this.root != null) {
        noty.log('Cannot set root as: ' + dir + ', because root already set.', 'err');
        return;
    }

    var escape = this.escapePaths;
    if (this.isNoEscapes()) {
        noty.log('No escape paths was declared! Be sure, you put setServerRoot after all POST/GET handlers.', 'info');
    }

    var fileAbsPath = pathmodule.join(this.path, dir);
    this.root = dir;

    // Chek for existing index.html file
    var checkIndex = Box.fileExists(fileAbsPath, 'index.html');

    if (escape['/'] === undefined && escape['/index.html'] === undefined) {
        if (checkIndex.fileExists) {
            var indexPath = pathmodule.join(fileAbsPath, 'index.html');
            this.app.get('/', function (req, res){
                res.sendFile(indexPath);
            });
        } else {
            this.app.get('/', function (req, res){
                res.sendStatus(404);
            });
        }
    }

    // Set all folders as resources (Recourse method)
    var regex = /(.+?)(\.[^.]*$|$)/;
    this.app.get(regex, function (req, res) {
        // console.log(req.query); GET Query Params
        var pathname = req._parsedUrl.pathname; //Get url path name

        // If user callback exists
        if (escape[pathname] !== undefined &&
            typeof escape[pathname] == "function") {
            escape[pathname](req, res);
            return;
        }

        // Else try to find page
        var pathname = decodeURI(req._parsedUrl.pathname);
        var checkFile = Box.fileExists(fileAbsPath, pathname);
        if (checkFile.fileExists) {
            res.status(checkFile.status).sendFile(pathmodule.join(fileAbsPath, pathname));
        } else {
            res.sendStatus(checkFile.status);
        }
    });
};

/**
 * Check file existing.
 * - If file not found, it returns object with fileExists = false, status = 404.
 * - If file is a directory, fileExists = false, status = 403 (Forbidden)
 * - If file was found, fileExists = true, status = 200
 * @param path
 * @param filename
 * @returns {{fileExists: boolean, status: number}}
 */

Box.fileExists = function (path, filename) {
    path = pathmodule.join(path, filename);
    var result = {
        fileExists: false,
        status: 404
    };
    try {
        var stats = fs.statSync(path);
        if (stats !== undefined) {
            if (stats.isFile()){
                noty.log('GET: ' + path + ' FOUND');
                result.fileExists = true;
                result.status = 200;
            } else if (stats.isDirectory()) {
                noty.log('GET: ' + path + ' RESTRICT DIRECTORY');
                result.fileExists = false;
                result.status = 403;
            } else {
                noty.log('GET: ' + path + ' NOT FOUND', 'err');
                result.fileExists = false;
                result.status = 404;
            }
        } else {
            noty.log('GET: ' + path + ' NOT FOUND', 'err');
            result.fileExists = false;
            result.status = 404;
        }
    } catch (err) {
        //console.log(err);
    }
    if (!result.fileExists)
        noty.log('GET: ' + path + " ERROR", 'warn');
    return result;
};

/**
 * Makes all files in dir as downloadable.
 * @param dir
 */
Box.prototype.newDownloadFolder = function (dir) {
    var abs_path = this.path + '/';
    this.app.get(dir+':name', function (req, res, next) {
        var pth = abs_path + dir + req.params.name;
        res.sendFile(pth);
    });
    noty.log('New download folder: ' + dir, 'done');
};

/**
 * TODO: DEPRECATED!
 * Creates a new GET/POST request listener with user-function.
 * @param req_path
 * @param method
 * @param callback
 */
Box.prototype.newRequestListener = function(req_path, method, callback) {
    if (method.toLowerCase() == "get") {
        this.app.get(req_path, function(req,res) {
            callback(req, res);
        });
    }
    else if (method.toLowerCase() == "post") {
        this.app.post(req_path, function(req,res) {
            callback(req, res);
        });
    }
};

/**
 * Creates a new POST request listener.
 * @param path
 * @param callback
 */
Box.prototype.onPost = function(path, callback) {
    this.app.post(path, function(req,res) {
        callback(req, res);
    });
};

/**
 * Creates a new GET-request listener.
 * @param path
 * @param callback
 */
Box.prototype.onGet = function(path, callback) {
    this.escapePaths[path] = callback;
};

/**
 * Send response as JSON-object.
 * @param res
 * @param json_obj
 * @param status: HTTP status code
 */
Box.prototype.sendJSON = function (res, json_obj, status) {
    if (status == undefined) {
        status = 200;
    }
    res.status(status).json(json_obj);
    res.end();
};

/**
 * Redirect user to <path>.
 * @param res
 * @param path
 */
Box.prototype.redirectLink = function(res, path) {
    res.redirect(path);
};

/**
 * Loads an example of using Material-UI with ReactJS.
 */
Box.prototype.helloWorld = function() {
    var dir = pathmodule.join(this.module_path, '/example');
    this.setServerRoot(dir);
};

Box.prototype.isNoEscapes = function () {
    var obj = this.escapePaths;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

exports.Box=Box;