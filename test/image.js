/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var Image = require('../src/lib/image');

chai.should();

var imageExample = {
    base64:"dGVzdA==",
    filename:"test",
    filesize:"111",
    filetype:"image/jpeg"
};
var fields = {
    base64: 'any/base64',
    mime: 'any/filetype',
    name: 'any/filename',
};

describe('Image', () => {
    describe('new', () => {
        it('Should have extension', () => {
            var image = new Image(imageExample, '../tmp/', fields, false);
            image.should.have.property('path').equal('../tmp/'+imageExample.filename+'.'+'jpeg');
        });

        it('Should not have extension', () => {
            var image = new Image(imageExample, '../tmp/', fields, true);
            image.should.have.property('path').equal('../tmp/'+imageExample.filename);
        });
    });
});
