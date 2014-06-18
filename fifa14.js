#!/usr/bin/env node

//Extracting user arguments

var userArguments = process.argv.slice(2);

if (userArguments.length > 1) {
    throw new Error('Only one argument may be specified');
}

var shell = require('child_process').execFile;

var phantomjs = require('phantomjs').path;

var scriptToExecute = __dirname + '/app.js';

var command = userArguments[0];

shell(phantomjs, [scriptToExecute, command], function(err, stdout, stderr) {
    if (err) {
    	error(err);
    	throw err;
	}
    try {
        // data = JSON.parse(stdout);
        log(stdout);
    } catch (err) {
        log('Whoops! It seems there was an error? You will find the stack trace below.');
        error(err);
    }

});

function log(message) {
    process.stdout.write(message);
}

function error(err) {
    process.stderr.write(err);
}
