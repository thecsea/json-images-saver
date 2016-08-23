/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var Image = require('./image');

module.exports = class ImageCollection{

    constructor(path, fields, extension_in_name) {
        this.path = path;
        this.fields = fields;
        this.extension_in_name = extension_in_name;
        this.images = [];
    }

    add(image){
        var imgObj = new Image(image, this.path +'/', this.images.length + '-', this.fields, this.extension_in_name);
        imgObj.write();
        this.images.push(imgObj);
        return imgObj;
    }
}