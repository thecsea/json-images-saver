# json-images-saver

[![npm version](https://badge.fury.io/js/json-images-saver.svg)](https://badge.fury.io/js/json-images-saver)

Save to files all base64 images contained in the json

It can be easily integrated with the output of [static site creator](https://github.com/thecsea/static-site-creator)

## Features
- [x] gulp support (with multiple json files support)
- [ ] gulp steam support
- [x] laravel elixir support
- [x] support of [angular-base64-upload](https://github.com/adonespitogo/angular-base64-upload) export (default options)
- [x] custom base 64 pattern
- [x] *any name* support
- [ ] *any name* support for multiple keys
- [x] delete old images as option (in gulp version)

## TODO
- [ ] test wrong cases for base64_structure
- [ ] travis integration
- [ ] elixir notify
- [ ] remove old dir when dir name is changed

## Examples
### Elixir with gulp
``` javascript
"use strict";
var elixir = require('laravel-elixir');
require('laravel-elixir-pug');
require('json-images-saver/elixir');
var fs = require('fs');
var gulp = require('gulp');
var through = require('through2');
var args = require('yargs').argv;

class JsonCollection{

    constructor() {
        this._list =  [];
        this.data = {};
    }

    set(name, json){
        if(!(name in this._list))
            this.add(name);
        try {
            this._list[name] = JSON.parse(json.toString('utf-8'));
        }catch(e){
            this._list[name] = json.toString('utf-8');
        }
    }

    add(name){
        var _this = this;
        Object.defineProperty(this.data, name, { get: function() { return _this._list[name]} , set: function(value){}, enumerable: true, configurable: true});
    }
}

function jsonPipe() {
    return function () {
        // Creating a stream through which each file will pass
        var stream = through.obj(function (file, enc, cb) {
            if (file.isNull()) {
                // return empty file
                return cb(null, file);
            }
            if (file.isBuffer()) {
                let name = file.path.split('/'); //TODO checks
                name = name[name.length - 1];
                jsonCollection.set(name.substr(0, name.length - ('json'.length + 1)), file.contents);
                return cb(null, file);
            }
            if (file.isStream()) {
                return cb(new PluginError(PLUGIN_NAME, 'Not yet supported'));
            }
        });
        stream.on('end', function () {
            pugVars.locked = false;
            gulp.start('pug');
        });
        return stream;
    }
}

var jsonCollection = new JsonCollection();
var pugVars = {locked:true};

elixir(function (mix) {
    mix.jsonImagesSaver('data/**/*.json',jsonPipe(),'json',{images_path:__dirname+'/public/img/data/', delete_files:true})
        .pug({
            locals: {
                data: jsonCollection,
                pugVars: pugVars
            },
        });
    if(args._.indexOf('watch') != -1) {
        setTimeout(()=> {
            fs.writeFile(__dirname + '/data/test.json', '{"time":"' + new Date().toTimeString() + '"}', function () {
            });
        }, 1000);
    }
});

```

- *locked* is used in pug file to lock the compilation until the json is ready, this way is needed because we have to call elixir-pug at the begining to initialize it (to create the gulp task)
- the timeout is needed to start jsonImagesSaver the first time, to have data to pass pug (they are stored only in the memory)