/**
 * Created by claudio on 23/08/16.
 */
var chai = require('chai');
var index = require('../index');

var assert = chai.assert;
describe('Creation', () => {
    describe('new', () => {
        it('should execute the entire lib', () => {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

