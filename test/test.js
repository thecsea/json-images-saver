/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var index = require('../index');
var ImageSaver = require('../src/imageSaver');
//var assert = chai.assert;

// npm test --coverage to get coverage

chai.should();
describe('Image saver', () => {
    describe('new', () => {
        it('should parse content', () => {
            var imageSaver = new ImageSaver('{"pippo":"test"}');
            imageSaver.should.have.property('content');
            imageSaver.content.should.have.property('pippo').equal('test');
        });
        it('should parse options', () => {
            var imageSaver = new ImageSaver('{"pippo":"test"}');
            JSON.stringify(imageSaver.options).should.be.equal(JSON.stringify({images_path: 'public/images',
                base64_structure: {any:{
                    filetype:'something',
                    filename:'something',
                    filesize:'something',
                    base64:'something'
                }},
                fields: {base64: 'any/base64',
                    mime: 'any/filetype',
                    name: 'any/filename',
                },
                extension_in_name: true}));
        });
    });
});

