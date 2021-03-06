/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var utils = require('./utils');
var mime = require('mime-types');
var fsp = require('fs-extra');
const util = require('util');
var svg2img = util.promisify(require('svg2img'));

module.exports = class Image{
    constructor(image, name, path, fields, extension_in_name, saveImageFunction, convertSVG) {
        this.image = image;
        this.fields = fields;
        this.path = path;
        this.name = name + utils.parseForUrl(this.getName());
        if(!extension_in_name)
            this.name += '.' + this.getExtension();
        this.saveImageFunction = (saveImageFunction && typeof saveImageFunction == 'function') ? saveImageFunction:fsp.writeFile;
        this.convertSVG = convertSVG || false;
    }

    write(){
        if(this.convertSVG) this.name = this.name.replace(/\.svg$/gi,'.png');
        return this.getConvertedImg()
            .then(img=>this.saveImageFunction(this.path + this.name , img))
            .then(()=>{
                //console.info(this.name +' saved!');
            })
            .catch((err)=>{
                throw err;
            });
    }

    getConvertedImg(){
        var img = this.base64Decode();
        if(this.convertSVG && utils.getField(this.fields.mime.split('/').reverse(),  this.image) == 'image/svg+xml') img = svg2img(img);
        else img = Promise.resolve(img);
        return img;
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
