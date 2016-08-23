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
    base64: 'base64',
    mime: 'filetype',
    name: 'filename',
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

    describe('getField', () => {
        it('Should support any in the middle', () => {
            var imageExampleCopy = JSON.parse(JSON.stringify(imageExample));
            delete imageExampleCopy.filename;
            imageExampleCopy.test1 = {test4:{name:'pippo'}};
            var fieldsCopy = JSON.parse(JSON.stringify(fields));
            fieldsCopy.name = 'test1/any/name';
            var image = new Image(imageExampleCopy, '1-', '../tmp/', fieldsCopy, false);
            image.getName().should.be.equal('pippo');
        });

        it('Should support two any', () => {
            var imageExampleCopy = JSON.parse(JSON.stringify(imageExample));
            delete imageExampleCopy.filename;
            imageExampleCopy.test1 = {test4:{name:'pippo'}};
            var fieldsCopy = JSON.parse(JSON.stringify(fields));
            fieldsCopy.name = 'test1/any/any';
            var image = new Image(imageExampleCopy, '1-', '../tmp/', fieldsCopy, false);
            image.getName().should.be.equal('pippo');
        });

        it('Should support any at the beginning', () => {
            var imageExampleCopy = JSON.parse(JSON.stringify(imageExample));
            delete imageExampleCopy.filename;
            imageExampleCopy.test1 = {test2:{name:'pippo'}};
            imageExampleCopy = {test0:imageExampleCopy};
            var fieldsCopy = JSON.parse(JSON.stringify(fields));
            fieldsCopy.name = 'any/test1/test2/name';
            fieldsCopy.filetype = 'any/'+fieldsCopy.filetype;
            fieldsCopy.mime = 'any/'+fieldsCopy.mime;
            var image = new Image(imageExampleCopy, '1-', '../tmp/', fieldsCopy, false);
            image.getName().should.be.equal('pippo');
        });

        it('Should support long chain', () => {
            var imageExampleCopy = JSON.parse(JSON.stringify(imageExample));
            delete imageExampleCopy.filename;
            imageExampleCopy.test1 = {test2:{name:'pippo'}};
            var fieldsCopy = JSON.parse(JSON.stringify(fields));
            fieldsCopy.name = 'test1/test2/name';
            var image = new Image(imageExampleCopy, '1-', '../tmp/', fieldsCopy, false);
            image.getName().should.be.equal('pippo');
        });

        it('Should throw excpetion', () => {
            var imageExampleCopy = JSON.parse(JSON.stringify(imageExample));
            delete imageExampleCopy.filename;
            imageExampleCopy.test1 = {test4:{name:'pippo'}};
            var fieldsCopy = JSON.parse(JSON.stringify(fields));
            fieldsCopy.name = 'test1/test2/name';
            var thrown  = false;
            try {
                var image = new Image(imageExampleCopy, '1-', '../tmp/', fieldsCopy, false);
            }catch(e){
                thrown = true;
            }
            thrown.should.be.equal(true);
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