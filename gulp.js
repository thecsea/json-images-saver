/**
 * Created by claudio on 24/08/16.
 */
"use strict";
// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var jsonImageSaver = require('./index');
var StreamFromPromise = require('stream-from-promise');
var vinylBuffer = require('vinyl-buffer');

// Consts
const PLUGIN_NAME = 'json-image-saver';

// Plugin level function(dealing with files)
function gulpJsonImageSaver(options) {

    /*if (!options) {
        throw new PluginError(PLUGIN_NAME, 'Missing options!');
    }*/

    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }
        if (file.isBuffer()) {
             //TODO try catch
            try {
                var data = jsonImageSaver(file.contents.toString('utf-8'), options);
            }catch(err){
                cb(new PluginError(PLUGIN_NAME, err));
                return ;
            }
            data.then((value)=>{
                file.contents = new Buffer(JSON.stringify(value));
                cb(null, file);
            }).catch((err)=>{
                cb(new PluginError(PLUGIN_NAME, err));
            });
            return ;
        }
        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Not yet supported'));//file.contents = StreamFromPromise();
        }


    });

}

// Exporting the plugin main function
module.exports = gulpJsonImageSaver;