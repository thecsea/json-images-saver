/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var ImageSaver = require('../src/imageSaver');
//var assert = chai.assert;

// npm test --coverage to get coverage

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


describe('Image Saver', () => {
    describe('new', () => {
        describe('content', () => {
            it('Should parse content', () => {
                var imageSaver = new ImageSaver('{"pippo":"test"}');
                imageSaver.should.have.property('content');
                imageSaver.content.should.have.property('pippo').equal('test');
            });

            it('Should not parse content', () => {
                var imageSaver = new ImageSaver({"pippo": "test"});
                imageSaver.should.have.property('content');
                imageSaver.content.should.have.property('pippo').equal('test');
            });
        });

        describe('options', () => {
            it('Should insert default options', () => {
                var imageSaver = new ImageSaver('{"pippo":"test"}');
                JSON.stringify(imageSaver.options).should.be.equal(JSON.stringify({
                    images_path: 'public/images',
                    base64_structure: {
                        filetype: 'something',
                        filename: 'something',
                        filesize: 'something',
                        base64: 'something'
                    },
                    fields: {
                        base64: 'base64',
                        mime: 'filetype',
                        name: 'filename',
                    },
                    extension_in_name: true
                }));
            });

            it('Should remove wrong options', () => {
                var imageSaver = new ImageSaver('{"pippo":"test"}', {pippo:"test"});
                imageSaver.options.should.not.have.property('pippo');
            });

            it('Should insert custom options', () => {
                var imageSaver = new ImageSaver('{"pippo":"test"}', {fields: {base64:"test"}});
                JSON.stringify(imageSaver.options.fields).should.equal(JSON.stringify({base64: 'test',
                    mime: 'filetype',
                    name: 'filename'}));
            });
        });
    });

    describe('base64', () => {
        it('Should recognize simple pattern', () => {
            var data = {
                test:"tttt",
                img:JSON.parse(JSON.stringify(exampleImage))
            }
            var imageSaver = new ImageSaver(data);
            imageSaver.base64Pattern().should.be.equal(false); //empty object
            imageSaver.base64Pattern(data).should.be.equal(false);
            imageSaver.base64Pattern(data.img).should.be.equal(true);
        });

        it('Should recognize complex pattern', () => {
            var img = JSON.parse(JSON.stringify(exampleImage));
            img = {test1:{test2:img}};
            var data = {
                test:"tttt",
                img: img,
            };
            //structure not changed
            var imageSaver = new ImageSaver(data);
            imageSaver.base64Pattern(data).should.be.equal(false);
            imageSaver.base64Pattern(data.img).should.be.equal(false);

            //structure changed
            var options = {base64_structure: {test1: {test2:{
                filetype: 'something',
                filename: 'something',
                filesize: 'something',
                base64: 'something'
            }}}};
            var imageSaver = new ImageSaver(data, options);
            imageSaver.base64Pattern(data).should.be.equal(false);
            imageSaver.base64Pattern(data.img).should.be.equal(true);
        });

        it('Should recognize inner image', () => {
            var data = {
                test:"tttt",
                test1:{test2:{img:JSON.parse(JSON.stringify(exampleImage))}}
            }
            var imageSaver = new ImageSaver(data);
            imageSaver.base64Pattern(data).should.be.equal(false);
            imageSaver.base64Pattern(data.test1.test2.img).should.be.equal(true);
        });

        describe('any', () => {
            it('Should recognize any in the middle', () => {
                var img = JSON.parse(JSON.stringify(exampleImage));
                img = {test1:{test4:img}};
                var data = {
                    test:"tttt",
                    img: img,
                };
                //structure not changed
                var imageSaver = new ImageSaver(data);
                imageSaver.base64Pattern(data).should.be.equal(false);
                imageSaver.base64Pattern(data.img).should.be.equal(false);

                //structure changed
                var options = {base64_structure: {test1: {any:{
                    filetype: 'something',
                    filename: 'something',
                    filesize: 'something',
                    base64: 'something'
                }}}};
                var imageSaver = new ImageSaver(data, options);
                imageSaver.base64Pattern(data).should.be.equal(false);
                imageSaver.base64Pattern(data.img).should.be.equal(true);
            });

            it('Should recognize any at the beginning', () => {
                var img = JSON.parse(JSON.stringify(exampleImage));
                img = {test1:{test4:img}};
                var data = {
                    test:"tttt",
                    img: img,
                };
                //structure not changed
                var imageSaver = new ImageSaver(data);
                imageSaver.base64Pattern(data).should.be.equal(false);
                imageSaver.base64Pattern(data.img).should.be.equal(false);

                //structure changed
                var options = {base64_structure: {any: {test4:{
                    filetype: 'something',
                    filename: 'something',
                    filesize: 'something',
                    base64: 'something'
                }}}};
                var imageSaver = new ImageSaver(data, options);
                imageSaver.base64Pattern(data).should.be.equal(false);
                imageSaver.base64Pattern(data.img).should.be.equal(true);
            });

            it('Should recognize two any', () => {
                var img = JSON.parse(JSON.stringify(exampleImage));
                img = {test1:{test4:img}};
                var data = {
                    test:"tttt",
                    img: img,
                };
                //structure not changed
                var imageSaver = new ImageSaver(data);
                imageSaver.base64Pattern(data).should.be.equal(false);
                imageSaver.base64Pattern(data.img).should.be.equal(false);

                //structure changed
                var options = {base64_structure: {any: {any:{
                    filetype: 'something',
                    filename: 'something',
                    filesize: 'something',
                    base64: 'something'
                }}}};
                var imageSaver = new ImageSaver(data, options);
                imageSaver.base64Pattern(data).should.be.equal(false);
                imageSaver.base64Pattern(data.img).should.be.equal(true);
            });
        });
    })
});


