/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var Extend = require('extend');
var Pick = require('object.pick');
var fs = require('fs');
var mime = require('mime-types');

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
            }},
            fields: {},
            extension_in_name: true
        }, options);

        options.fields = Extend({
            base64: 'any/base64',
            mime: 'any/filetype',
            name: 'any/filename',
        }, options.fields);

        options.fields = Pick(options.fields, [
            'base64',
            'mime',
            'name'
        ]);

        options = Pick(options, [
            'images_path',
            'base64_structure',
            'fields',
            'extension_in_name'
        ]);

        return options;
    }

    parse(content = this.content, collection = new ImageCollection(this.options.images_path, this.options.fields, this.options.extension_in_name)) {
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
            return this.base64Pattern(obj[objKeys[0]], structure.any);

        return structureKeys.every((value)=> (objKeys.indexOf(value) != -1))
            && structureKeys.every((value)=> this.base64Pattern(obj[value], structure[value])); //we already know that the data exists, we have to verify subdata
    }
}

class ImageCollection{

    constructor(path, fields, extension_in_name) {
        this.path = path;
        this.fields = fields;
        this.extension_in_name = extension_in_name;
        this.images = [];
    }

    add(image){
        var imgObj = new Image(image, this.path +'/'+ this.images.length, this.fields, this.extension_in_name);
        imgObj.write();
        this.images.push(imgObj);
        return imgObj;
    }
}

class Image{

    constructor(image, path, fields, extension_in_name) {
        this.image = image;
        if(extension_in_name)
            this.path = path + '-' + this.getName().parseForUrl();
        else
            this.path = path + '-' + this.getName().parseForUrl() + '.' + this.getExtension();
        this.fields = fields;
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
        return getField(this.fields.base64.split('/'),  this.image);
    }

    getName(){
        return getField(this.fields.name.split('/'),  this.image);
    }

    getExtension(){
        return mime.extension(getField(this.fields.mime.split('/'),  this.image));
    }
}

function getField(field, obj){
    //end
    if(field.length == 0)
        return obj;

    var name = field.pop();
    if(name == 'any')
        return this.getBase64(field, obj[Object.keys(obj)[0]]);
    if(typeof obj[name] === 'undefined')
        throw new Error('Wrong field name');
    return this.getBase64(field, obj[name]);
}

String.prototype.parseForUrl = function(){return this.trim().toLocaleLowerCase().replace(new RegExp('( )|(\\\\)|(/)|(\')|(#)', 'g'), '-')};