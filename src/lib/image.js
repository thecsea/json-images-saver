/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var utils = require('./utils');
var mime = require('mime-types');
var fs = require('fs');

module.exports = class Image{
    constructor(image, path, fields, extension_in_name) {
        this.image = image;
        this.fields = fields;
        this.path = path + this.getName().parseForUrl();
        if(!extension_in_name)
            this.path += '.' + this.getExtension();
        this.base64 = this.getBase64();
    }

    write(){
        fs.writeFile(this.path, this.base64Decode(), (err) => {
            if (err) throw err;
            console.log(this.path +' saved!');
        });
    }

    base64Decode(){
        return new Buffer(this.base64, 'base64').toString('utf8');
    }

    getBase64(){
        return utils.getField(this.fields.base64.split('/'),  this.image);
    }

    getName(){
        return utils.getField(this.fields.name.split('/'),  this.image);
    }

    getExtension(){
        return mime.extension(utils.getField(this.fields.mime.split('/'),  this.image));
    }
}
