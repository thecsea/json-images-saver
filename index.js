/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var Extend = require('extend');
var Pick = require('object.pick');

module.exports = function(content, options){
    return new ImageSaver(content, options).parse();
};


class ImageSaver {
    constructor(content, options){
        this.options = imageSaver.validateOptions(options);
        if(typeof content === 'string') {
            try {
                content = JSON.parse(content)
            } catch (e) {
            }
        }

        this.content = content;
    }

    static validateOptions(options) {
        if (typeof options === "undefined") {
            return [];
        }

        options = Extend({
            images_path: 'public/images',
            base64_structure: {any:{
                filetype:'something',
                filename:'something',
                filesize:'something',
                base64:'something'
            },
            base64_name: 'base64'
            }
        }, options);

        options = Pick(options, [
            'images_path',
            'base64_structure',
            'base64_name'
        ]);

        return options;
    }

    parse(content = this.content, collection = new ImageCollection(this.options.images_path)) {
        return Object.keys(content).map((value)=>{
            if (this.base64Pattern(value)) {
                return ImageCollection.add(value).path;
            }
            if(typeof value === 'object')
                return this.parse(value, collection);
        })
    }


    base64Pattern(obj, structure = this.options.base64_structure) {
        if(typeof obj !== 'object')
            return true;

        var structureKeys = Object.keys(structure);
        var objKeys = Object.keys(obj);
        if (structureKeys.length == 1 && structureKeys[0] == 'any' && objKeys.length == 1)
            return this.base64Pattern(obj[objKeys[0]], structure.any)

        return structureKeys.every((value)=> (objKeys.indexOf(value) != -1))
            && structureKeys.every((value)=> this.base64Pattern(obj[value], structure[value])); //we already know that the data exists, we have to verify subdata
    }
}

class ImageCollection{

    constructor(path) {
        this.path = path;
        this.images = [];
    }

    add(image){
        var imgObj = new Image(image, this.path +'/'+ this.images.length); //TODO extension
        imgObj.write();
        this.images.push(imgObj);
        return imgObj;
    }
}

class Image{

    constructor(image, path) {
        this.image = image;
        this.path = path;
    }

    write(){

    }
}