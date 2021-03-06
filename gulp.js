/**
 * Created by claudio on 24/08/16.
 */
"use strict";
// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var jsonImagesSaver = require('./index');
var StreamFromPromise = require('stream-from-promise');
var vinylBuffer = require('vinyl-buffer');
var fsp = require('fs-extra');
const rimrafPromise = require('rimraf-promise');

// Consts
const PLUGIN_NAME = 'json-images-saver';

// Plugin level function(dealing with files)
function gulpJsonImagesSaver(fileExtension, options) {

    if (!fileExtension) {
        throw new PluginError(PLUGIN_NAME, 'Missing fileExtension!');
    }

    if (!options) {
        options = {};
    }

    if (!('images_path' in options))
        options.images_path = 'public/images/';

    var delete_files = false;
    if (('delete_files' in options) && options.delete_files)
        delete_files = true;

    let isWin = /^win/.test(process.platform);

    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {
        let optionsCopy = JSON.parse(JSON.stringify(options));
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }
        if (file.isBuffer()) {
            let name = '';
            if(isWin)
                name = file.path.split('\\'); //TODO check length
            else
                name = file.path.split('/'); //TODO check length

            name = name[name.length-1];
            optionsCopy.images_path = optionsCopy.images_path + name.substr(0,name.length-(fileExtension.length+1)) + '/'; //+1 of .
            return fsp.stat(optionsCopy.images_path)
                .catch(()=>fsp.mkdir(optionsCopy.images_path))
                .then(()=>delete_files?rimrafPromise(optionsCopy.images_path):'')
                .then(()=>delete_files?fsp.mkdir(optionsCopy.images_path):'')
                .then(()=>jsonImagesSaver(file.contents.toString('utf-8'), optionsCopy))
                .then((value)=> {
                    file.contents = new Buffer(JSON.stringify(value));
                    cb(null, file);
                })
                .catch((err)=>cb(new PluginError(PLUGIN_NAME, err)));
        }
        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Not yet supported'));//file.contents = StreamFromPromise();
        }


    });

}

// Exporting the plugin main function
module.exports = gulpJsonImagesSaver;