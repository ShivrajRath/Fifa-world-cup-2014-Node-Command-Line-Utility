#!/usr/bin/env node

//Extracting user arguments

var userArguments = process.argv.slice(2);

if (userArguments.length > 1) {
    throw new Error('Only one argument may be specified');
}

// Shell to run phantom
var shell = require('child_process').execFile;

var phantomjs = require('phantomjs').path;

// This is the processing script
var scriptToExecute = __dirname + '/app.js';

var command = userArguments[0];

// Running phantom script
shell(phantomjs, [scriptToExecute, command], function(err, stdout, stderr) {
    if (err) {
        error(err);
        throw err;
    }
    try {
        log(stdout);
    } catch (err) {
        log('Whoops! It seems there was an error? You will find the stack trace below.');
        error(err);
    }

});

//Logging functions
function log(message) {
    process.stdout.write(message);
}

function error(err) {
    process.stderr.write(err);
}
