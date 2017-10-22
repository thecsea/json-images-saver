/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var utils = require('./utils');
var mime = require('mime-types');
var fsp = require('fs-extra');

module.exports = class Image{
    constructor(image, name, path, fields, extension_in_name, saveImageFunction) {
        this.image = image;
        this.fields = fields;
        this.path = path;
        this.name = name + utils.parseForUrl(this.getName());
        if(!extension_in_name)
            this.name += '.' + this.getExtension();
        this.saveImageFunction = (saveImageFunction && typeof saveImageFunction == 'function') ? saveImageFunction:fsp.writeFile;
    }

    write(){
        return this.saveImageFunction(this.path + this.name , this.base64Decode())
            .then(()=>{
                //console.info(this.name +' saved!');
            })
            .catch((err)=>{
                throw err;
            });
    }

    base64Decode(){
        return new Buffer(this.getBase64(), 'base64');
    }

    getBase64(){
        return utils.getField(this.fields.base64.split('/').reverse(),  this.image);
    }

    getName(){
        return utils.getField(this.fields.name.split('/').reverse(),  this.image);
    }

    getExtension(){
        return mime.extension(utils.getField(this.fields.mime.split('/').reverse(),  this.image));
    }
}
