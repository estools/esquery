import esquery from '../esquery.js';
import forLoop from './fixtures/forLoop.js';
import ast from './fixtures/allClasses.js';

describe('match', function () {

    it('unknown selector type', function () {
        assert.throws(function () {
            esquery.match(forLoop, {
                type: 'badType'
            });
        }, Error);
    });

    it('unknown selector type', function () {
        assert.throws(function () {
            esquery.match(forLoop, {
                type: 'class',
                name: 'badName',
                value: { type: 'foobar' } });
        }, Error);
    });

    it('unknown class name', function () {
        assert.throws(function () {
            esquery.match(ast, {
                type: 'class',
                name: 'badName',
                value: { type: 'foobar' } });
        }, Error);
    });

    it('unknown type', function () {
        assert.throws(function () {
            esquery.match(forLoop, {
                type: 'attribute',
                name: 'foo',
                operator: '=',
                value: { type: 'foobar' } });
        }, Error);

        assert.throws(function () {
            esquery.match(forLoop, {
                type: 'attribute',
                name: 'foo',
                operator: '!=',
                value: { type: 'foobar' } });
        }, Error);
    });

    it('unknown operator', function () {
        assert.throws(function () {
            esquery.match(forLoop, {
                type: 'attribute',
                name: 'foo',
                operator: 'badOperator',
                value: { type: 'foobar' } });
        }, Error);
    });

    // Can remove need for this if remove `subjects`' `hasOwnProperty`
    //  check in favor of for-of (Node >=6.9.2) or use `Object.keys`
    it('selector with non-own properties', function () {
        assert.throws(function () {
            function Selector () {}
            Selector.prototype.inheritedMethod = function () {};
            const sel = new Selector();
            sel.type = 'class';
            sel.name = 'badName';
            sel.value = { type: 'foobar' };
            esquery.match(ast, sel);
        }, Error);
    });
});
