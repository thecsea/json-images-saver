/**
 * Created by claudio on 23/08/16.
 */
var ImageSaver = require('./src/imageSaver');

module.exports = function(content, options){
    return new ImageSaver(content, options).parse();
}
