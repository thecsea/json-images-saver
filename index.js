/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var Extend = require('extend');
var Pick = require('object.pick');
var fs = require('fs');

module.exports = function(content, options){
    return new ImageSaver(content, options).parse();
};


class ImageSaver {
    constructor(content, options){
        this.options = ImageSaver.validateOptions(options);
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
            base64_name: 'any/base64'
            }
        }, options);

        options = Pick(options, [
            'images_path',
            'base64_structure',
            'base64_name'
        ]);

        return options;
    }

    parse(content = this.content, collection = new ImageCollection(this.options.images_path, this.options.base64_name)) {
        return Object.keys(content).map((value)=>{
            if (this.base64Pattern(value)) {
                return collection.add(value).path;
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

    constructor(path, base64Name) {
        this.path = path;
        this.base64Name = base64Name;
        this.images = [];
    }

    add(image){
        var imgObj = new Image(image, this.path +'/'+ this.images.length, this.base64Name); //TODO extension
        imgObj.write();
        this.images.push(imgObj);
        return imgObj;
    }
}

class Image{

    constructor(image, path, base64Name) {
        this.image = image;
        this.path = path;
        this.base64Name = base64Name;
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

    getBase64(image = this.image, base64Name = this.base64Name.split('/')){
        //end
        if(base64Name.length == 0)
            return image;

        var name = base64Name.pop();
        if(name == 'any')
            return this.getBase64(image[Object.keys(image)[0]],base64Name);
        return this.getBase64(image[name],base64Name);
    }
}