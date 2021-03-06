/**
 * Created by claudio on 23/08/16.
 */
var ImagesSaver = require('./src/imagesSaver');

/**
 *
 * @param content JSON or OBJECT
 * @param options
 * @returns Promise
 */
module.exports = function(content, options, saveImageFunction){
    return new ImagesSaver(content, options, saveImageFunction).parse();
}
