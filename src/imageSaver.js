/**
 * Created by claudio on 23/08/16.
 */
"use strict";
var Extend = require('extend');
var Pick = require('object.pick');
var Collection = require('./lib/imageCollection');



module.exports = class ImageSaver {
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
            options = [];
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

    parse(content, collection) {
        if(typeof content === 'undefined')
            content = this.content;
        if(typeof collection === 'undefined')
            collection = new ImageCollection(this.options.images_path, this.options.fields, this.options.extension_in_name);

        return content.forEach((value, key)=>{
            if (this.base64Pattern(value)) {
                collection.add(value)
                    .then((image)=>{content[key] = name});
            }
            else if(typeof value === 'object')
                content[key] = this.parse(value, collection);
        })
    }


    base64Pattern(obj, structure) {
        if(typeof structure === 'undefined')
            structure = this.options.base64_structure;

        if(typeof obj !== 'object')
            return true;

        var structureKeys = Object.keys(structure);
        var objKeys = Object.keys(obj);
        if (structureKeys.length == 1 && structureKeys[0] == 'any' && objKeys.length == 1)
            return this.base64Pattern(obj[objKeys[0]], structure.any);

        return structureKeys.every((value)=> (objKeys.indexOf(value) != -1))
            && structureKeys.every((value)=> this.base64Pattern(obj[value], structure[value])); //we already know that the data exists, we have to verify subdata
    }
};