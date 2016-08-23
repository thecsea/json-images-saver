/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var ImageCollection = require('../src/lib/imageCollection');
var fsp = require('fs-promise');
var fs = require('fs');

chai.should();

var imageExample = {
    base64:"dGVzdA==", //='test'
    filename:"test",
    filesize:"111",
    filetype:"image/jpeg"
};
var fields = {
    base64: 'any/base64',
    mime: 'any/filetype',
    name: 'any/filename',
};

describe('Image Collection', () => {
    describe('new', () => {
        it('Should not have images', () => {
            var image = new ImageCollection('1-', '../tmp/', fields, true);
            image.should.have.property('images').with.length(0);
        });
    });
});