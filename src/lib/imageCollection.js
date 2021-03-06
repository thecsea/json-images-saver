/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var Image = require('./image');

module.exports = class ImageCollection{

    constructor(path, fields, extension_in_name, saveImageFunction, convertSVG) {
        this.path = path;
        this.fields = fields;
        this.extension_in_name = extension_in_name;
        this.saveImageFunction = saveImageFunction;
        this.convertSVG = convertSVG || false;
        this.images = [];
    }

    add(image){
        var imgObj = new Image(image, this.images.length + '-', this.path, this.fields, this.extension_in_name, this.saveImageFunction, this.convertSVG);
        var promise = imgObj.write();
        this.images.push(imgObj);
        return promise.then(()=>{
            return imgObj;
        });
    }
}