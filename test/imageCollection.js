/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var ImageCollection = require('../src/lib/imageCollection');
var fsp = require('fs-extra');
var fs = require('fs');

chai.should();

var exampleImage = {
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

describe('Image Collection', () => {
    describe('new', () => {
        it('Should not have images', () => {
            var imageCollection = new ImageCollection( __dirname + '/../tmp/', fields, true);
            imageCollection.should.have.property('images').with.length(0);
        });
    });

    describe('add', () => {
        //befor is needed only for write, but if we inserit it into write we have an error
        before(()=>{
            const names = [
                __dirname + '/../tmp/0-' + exampleImage.filename,
                __dirname + '/../tmp/1-' + exampleImage.filename
            ];
            names.forEach((name)=> {
                try {
                    fs.lstatSync(name);
                    return fsp.unlink(name);
                } catch (e) {
                }
            });
        });

        it('Should add the image to array', () => {
            var imageCollection = new ImageCollection( __dirname + '/../tmp/', fields, true);
            imageCollection.should.have.property('images').with.length(0);
            return imageCollection.add(exampleImage).then((value)=>{
                value.should.have.property('name').equal('0-'+exampleImage.filename);
                imageCollection.should.have.property('images').with.length(1);
                return imageCollection.add(exampleImage);
            }).then((value)=>{
                value.should.have.property('name').equal('1-'+exampleImage.filename);
                return imageCollection;
            }).should.eventually.have.property('images').with.length(2);
        });

        describe('write', () => {
            it('Should write the image', () => {
                var imageCollection = new ImageCollection( __dirname + '/../tmp/', fields, true);
                var image = imageCollection.add(exampleImage);
                return image
                    .then((value)=>{
                        value.should.have.property('name').equal('0-'+exampleImage.filename)
                        try{
                            fs.lstatSync(value.path + '1-'+exampleImage.filename );
                            return 'ok';
                        }catch(e){
                            return Promise.reject('The file doesn\'t exist ('+e+')');
                        }
                    })
                    .should.eventually.equal('ok');
            });

            it('Should write the right content', () => {
                var imageCollection = new ImageCollection( __dirname + '/../tmp/', fields, true);
                var image = imageCollection.add(exampleImage);
                return image
                    .then((value)=>{
                        value.should.have.property('name').equal('0-'+exampleImage.filename)
                        return fsp.readFile(value.path + '1-'+exampleImage.filename ,'utf-8')
                    })
                    .should.eventually.equal('test');
            });
        });

        describe('extension', () => {
            it('Should have extension', () => {
                var imageCollection = new ImageCollection( __dirname + '/../tmp/', fields, false);
                var image = imageCollection.add(exampleImage);
                return image.should.eventually.have.property('name').equal('0-'+exampleImage.filename+'.'+'jpeg');
            });

            it('Should not have extension', () => {
                var imageCollection = new ImageCollection( __dirname + '/../tmp/', fields, true);
                var image = imageCollection.add(exampleImage);
                return image.should.eventually.have.property('name').equal('0-'+exampleImage.filename);
            });
        })
    });
});