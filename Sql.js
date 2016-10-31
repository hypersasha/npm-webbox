/**
 * Sql Module.
 * V0.1-211016
 *
 * Last Updates:
 * -
 */

var colors, express, fs, pathmodule, mysql;
const logger = require('./Noty.js');
var noty = new logger.Noty("all");

/**
 * Constructor of this Box.
 * @constructor
 */
function Box() {
    colors = require('colors/safe');
    express = require('express');
    fs = require('fs');
    pathmodule = require('path');
    mysql = require('mysql');

    this.connection = null;
    this.user = null;
    this.password = null;
    this.host = null;
}

/**
 * Connects to MySQL-database
 * @param host - database host ('localhost' as default)
 * @param user
 * @param pass
 * @param database
 */
Box.prototype.connect = function (user, pass, database, host) {

    // Check arguments
    if (user === undefined || pass === undefined || database === undefined)
    {
        noty.log('MySQL connect error! One of arguments (user, password or database) was not initialized.', 'err');
        return;
    }

    // Compose a connection object
    this.connection = mysql.createConnection({
        host: host || 'localhost',
        user: user,
        password: pass,
        database: database
    });

    // Connect to database
    this.connection.connect(function(err) {
        if (err) {
            noty.log('MySQL connect error! :(', 'err');
            noty.log(err.stack);
        } else {
            noty.log('Connected to MySQL. Hello, '+user+'. :)', 'done');
        }
    });
}

/**
 * Makes Query to database and responds to callback-function.
 * @param query: SQL-query
 * @param query_params (optional): Parametrs for prepared statement
 * @param callback: callback-function
 */
Box.prototype.query = function (query, query_params, callback) {

    var result = null;

    if (query_params === undefined) {
        query_params = [];
    }

    if (typeof query_params === "function") {
        console.log('function!');
        callback = query_params;
        query_params = [];
    }

    this.connection.query(query, query_params, function(err, rows, fields) {
        if (!err) {
            result = {
                status: 1,
                rows: rows
            }
            if (fields !== undefined) {
                result['fields'] = fields;
            }
            callback(result);
        } else { // If error occurred.
            noty.log("SQL-query " + err, 'err');
            result = {
                status: 0,
                response: err
            }
            callback(result);
        }
    });
}

/**
 * Similar to query, but responds to user-agent with JSON-format.
 * @param query: -//-
 * @param query_params: -//-
 * @param res: response object from user request event
 */
Box.prototype.replyQuery = function (res, query, query_params) {

    if (res === undefined) {
        noty.log("Can't find 'res' parameter! at replyQuery(\<query\>, [query_params], \<res\>)", 'err');
    }

    this.query(query, query_params, function(response){
        res.format({
            'application/json': function() {
                res.status(200).json(response);
            }
        });
    });
}

exports.Box = Box;
