/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Image = require('../src/lib/image');
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

describe('Image', () => {
    describe('new', () => {
        it('Should have extension', () => {
            var image = new Image(imageExample, '1-', '../tmp/', fields, false);
            image.should.have.property('name').equal('1-'+imageExample.filename+'.'+'jpeg');
        });

        it('Should not have extension', () => {
            var image = new Image(imageExample, '1-', '../tmp/', fields, true);
            image.should.have.property('name').equal('1-'+imageExample.filename);
        });
    });
    describe('base64', () => {
        it('Should decode base64', () => {
            var image = new Image(imageExample, '1-', '../tmp/', fields, false);
            image.base64Decode().should.be.equal('test');
        });
    });

    describe('write', () => {
        before(()=>{
            const name = __dirname + '/../tmp/1-' + imageExample.filename;
            try {
                fs.lstatSync(name);
                return fsp.unlink(name);
            }catch(e){}
        });

        it('Should write the image', () => {
            var image = new Image(imageExample, '1-', __dirname + '/../tmp/', fields, true);
            return image.write()
                .then(()=>{
                    try{
                        fs.lstatSync(image.path + '1-'+imageExample.filename );
                        return 'ok';
                    }catch(e){
                        return Promise.reject('The file doesn\'t exist ('+e+')');
                    }
                })
                .should.eventually.equal('ok');
        });

        it('Should write the right content', () => {
            var image = new Image(imageExample, '1-', __dirname + '/../tmp/', fields, true);
            return image.write()
                .then(()=>{
                    return fsp.readFile(image.path + '1-'+imageExample.filename ,'utf-8')
                })
                .should.eventually.equal('test');
        });

        it('Should throw error', () => {
            var image = new Image(imageExample, '1-', __dirname + '/../tmperr/', fields, true);
            return image.write()
                .catch((err)=>{
                    return 'ok-err';
                })
                .should.eventually.equal('ok-err');
        });
    });
});