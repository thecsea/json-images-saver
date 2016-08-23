/**
 * Created by claudio on 23/08/16.
 */
"use strict";

exports.getField = function getField(field, obj){
    //end
    if(field.length == 1 || field.length == 0)
        return obj;

    var name = field.pop();
    if(name == 'any')
        return getField(field, obj[Object.keys(obj)[0]]);
    if(typeof obj[name] === 'undefined')
        throw new Error('Wrong field name');
    return getField(field, obj[name]);
};

String.prototype.parseForUrl = function(){return this.trim().toLocaleLowerCase().replace(new RegExp('( )|(\\\\)|(/)|(\')|(#)', 'g'), '-')};
