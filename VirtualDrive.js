/**
 * Virtual Drive.
 * v0.0.1
 */

var colors, express, fs, pathmodule, bodyParser, multiparty;
const logger = require('./Noty.js');
var noty = new logger.Noty("all");

/**
 * Constructor.
 * @param server
 * @param root
 * @param config
 * @constructor
 */
function Box(server, root) {

	try {
		if (server === undefined || root === undefined || typeof root !== "string"){
			throw new Error;
		}
	} catch (e) {
		noty.log('Wrong arguments at Virtual Drive constructor.', 'err');
		console.log(e.stack);
		return;
	}

	colors = require('colors/safe');
    express = require('express');
    fs = require('fs');
    pathmodule = require('path');
    bodyParser = require('body-parser');
    multiparty = require('multiparty');

    this.server = server;
    this.root = null;
    this.driveRoot = root;

    if (this.server.root != null && this.server.root !== undefined) {
    	this.root = pathmodule.join(this.server.path, this.server.root, root);
    	noty.log('Starting VirtualDrive at: ' + this.root, 'info');

    	if (!Box.dirExists(this.root)) {
    		noty.log('Cannot find ' + this.root + '! This directory was automatically created.', 'warn');
    		Box.mkDir(this.root);
    	}

    } else {
    	noty.log('Cannot find a server root!', 'err');
    }
}

/**
 * Creates a new directory.
 * @param path
 */
Box.mkDir = function (path) {
	try {
    	fs.mkdirSync(path);
  	} catch(e) {
    	if ( e.code == 'EEXIST' ) {
    		noty.log('Directory ' + path + ' already exists!','err');
    	}
  	}
}

/**
 * Check if directory at path exists
 * @param path
 * @returns {boolean}
 */
Box.dirExists = function (path) {
	try {
		var stats = fs.statSync(path);
		if (stats !== undefined && stats.isDirectory()) {
			return true
        } else {
            return false;
        }
	} catch (e) {
		if (e.code != 'ENOENT')
			console.log(e);
	}
}

/**
 * Creates a new upload listener.
 * @param url
 * @param dir
 * @param props
 * @param callback
 */
Box.prototype.onUpload = function (url, dir, props, callback) {
	var dest = pathmodule.join(this.driveRoot, dir);
	var dir = pathmodule.join(this.root, dir);
	if (Box.dirExists(dir)) {
		this.server.app.post(url, function(req, res){
			var form = new multiparty.Form();
			var result = {
				files: []
			};
			var fstream = null;

			form.on("field", function(key, value){
				result.fields = JSON.parse(value);
			});

			form.on('file', function(name, file){
				var finfo = {};

				// if file too big
				if (file.size > props.maxSize) {
					finfo.errors = {code: 413, text: "Too Large File."};
					finfo.saved = false;
					result.files.push(finfo);
					fs.unlink(file.path);
					return;
				}

				// if file with wrong type
				if (props.fileTypes !== undefined) // if undef -> all types are avaliable
					if (props.fileTypes.indexOf(file.headers['content-type']) < 0) {
						finfo.errors = {code: 415, text: "Bad File Type."};
						finfo.saved = false;
						result.files.push(finfo);
						fs.unlink(file.path);
						return;
					}

				var len = (props.maxNameLength !== undefined && typeof props.maxNameLength == "number" ? props.maxNameLength : 12);
				var ext = Box.getFileExt(file.originalFilename);
				var fileName = (!props.saveName ? Box.genName(len, ext) : file.originalFilename);
				var filePath = pathmodule.join(dir, fileName);

				// Save file to dir
				var ws = fs.createWriteStream(filePath);
				ws.on('close', function(){
					fs.unlink(file.path); // remove tmp-file from multiparty
				});
				fs.createReadStream(file.path).pipe(ws);

				// Push finfo
				finfo.saved = true;
				finfo.name = fileName;
				finfo.path = pathmodule.join(dest, fileName);
				result.files.push(finfo);
			});

			form.on('close', function(data){
				callback(req, res, result);
			});

			form.parse(req);
		});
	} else { // Can't find destination directory
		var text = 'Cannot find directory ' + dir + ' in VirtualDrive root: '+this.root;
		text += '\nAll files, which uploads on ' + url + ' will be ignored! Fix it.';
		noty.log(text, 'err');
	}
}


/**
 * Get file extension from its name
 * @param name
 * @returns {T}
 */
Box.getFileExt = function( name ) {
	return name.split('.').pop();
}

/**
 * Generate name for new file
 * @param length: max name length
 * @param ext: file extension
 * @returns {string} generated name
 */
Box.genName = function(length, ext) {
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    if (ext !== undefined && typeof ext === "string") {
    	text += "."+ext;
    }
    return text;
}

exports.Box=Box;