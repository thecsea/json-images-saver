/**
 * Created by claudio on 23/08/16.
 */
var ImageSaver = require('./src/imageSaver');

/**
 *
 * @param content JSON or OBJECT
 * @param options
 * @returns Promise
 */
module.exports = function(content, options){
    return new ImageSaver(content, options).parse();
}
