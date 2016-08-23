/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var utils = require('./utils');
var mime = require('mime-types');
var fsp = require('fs-promise');

module.exports = class Image{
    constructor(image, name, path, fields, extension_in_name) {
        this.image = image;
        this.fields = fields;
        this.path = path;
        this.name = name + this.getName().parseForUrl();
        if(!extension_in_name)
            this.name += '.' + this.getExtension();
    }

    write(){
        return fsp.writeFile(this.path + this.name , this.base64Decode())
            .then(()=>{
                //console.info(this.name +' saved!');
            })
            .catch((err)=>{
                throw err;
            });
    }

    base64Decode(){
        return new Buffer(this.getBase64(), 'base64').toString('utf8');
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
