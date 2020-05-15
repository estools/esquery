import esquery from '../esquery.js';
import literal from './fixtures/literal.js';
import conditional from './fixtures/conditional.js';
import forLoop from './fixtures/forLoop.js';
import simpleFunction from './fixtures/simpleFunction.js';
import simpleProgram from './fixtures/simpleProgram.js';

describe('Attribute query', function () {

    it('conditional', function () {
        let matches = esquery(conditional, '[name="x"]');
        assert.includeMembers(matches, [
            conditional.body[0].test.left,
            conditional.body[0].alternate.body[0].expression.left,
            conditional.body[1].test.left.left.left,
            conditional.body[1].test.right
        ]);

        matches = esquery(conditional, '[callee.name="foo"]');
        assert.includeMembers(matches, [
            conditional.body[0].consequent.body[0].expression
        ]);

        matches = esquery(conditional, '[operator]');
        assert.includeMembers(matches, [
            conditional.body[0].test,
            conditional.body[0].alternate.body[0].expression,
            conditional.body[1].test,
            conditional.body[1].test.left,
            conditional.body[1].test.left.left
        ]);

        matches = esquery(conditional, '[prefix=true]');
        assert.includeMembers(matches, [
            conditional.body[1].consequent.body[0].expression.right
        ]);
    });

    it('literal with special escapes', function () {
        const matches = esquery(literal, 'Literal[value=\'\\b\\f\\n\\r\\t\\v and just a \\ back\\slash\']');
        assert.includeMembers(matches, [
            literal.body[0].declarations[0].init
        ]);
    });

    it('literal with decimal', function () {
        const matches = esquery(literal, 'Literal[value=21.35]');
        assert.includeMembers(matches, [
            literal.body[1].declarations[0].init
        ]);
    });

    it('literal with extra whitespace', function () {
        const matches = esquery(literal, 'Literal[value  =  21.35]');
        assert.includeMembers(matches, [
            literal.body[1].declarations[0].init
        ]);
    });

    it('literal with backslashes', function () {
        const matches = esquery(literal, 'Literal[value="\\z"]');
        assert.includeMembers(matches, [
            literal.body[2].declarations[0].init
        ]);
    });

    it('literal with backslash after beginning', function () {
        const matches = esquery(literal, 'Literal[value="abc\\z"]');
        assert.includeMembers(matches, [
            literal.body[3].declarations[0].init
        ]);
    });

    it('for loop', function () {
        let matches = esquery(forLoop, '[operator="="]');
        assert.includeMembers(matches, [
            forLoop.body[0].init
        ]);

        matches = esquery(forLoop, '[object.name="foo"]');
        assert.includeMembers(matches, [
            forLoop.body[0].test.right
        ]);

        matches = esquery(forLoop, '[operator]');
        assert.includeMembers(matches, [
            forLoop.body[0].init,
            forLoop.body[0].test,
            forLoop.body[0].update
        ]);
    });

    it('simple function', function () {
        let matches = esquery(simpleFunction, '[kind="var"]');
        assert.includeMembers(matches, [
            simpleFunction.body[0].body.body[0]
        ]);

        matches = esquery(simpleFunction, '[id.name="foo"]');
        assert.includeMembers(matches, [
            simpleFunction.body[0]
        ]);

        matches = esquery(simpleFunction, '[left]');
        assert.includeMembers(matches, [
            simpleFunction.body[0].body.body[0].declarations[0].init
        ]);
    });

    it('simple program', function () {
        let matches = esquery(simpleProgram, '[kind="var"]');
        assert.includeMembers(matches, [
            simpleProgram.body[0],
            simpleProgram.body[1]
        ]);

        matches = esquery(simpleProgram, '[id.name="y"]');
        assert.includeMembers(matches, [
            simpleProgram.body[1].declarations[0]
        ]);

        matches = esquery(simpleProgram, '[body]');
        assert.includeMembers(matches, [
            simpleProgram,
            simpleProgram.body[3].consequent
        ]);
    });

    it('conditional regexp', function () {
        const matches = esquery(conditional, '[name=/x|foo/]');
        assert.includeMembers(matches, [
            conditional.body[0].test.left,
            conditional.body[0].consequent.body[0].expression.callee,
            conditional.body[0].alternate.body[0].expression.left
        ]);
    });

    it('simple function regexp', function () {
        const matches = esquery(simpleFunction, '[name=/x|foo/]');
        assert.includeMembers(matches, [
            simpleFunction.body[0].id,
            simpleFunction.body[0].params[0],
            simpleFunction.body[0].body.body[0].declarations[0].init.left
        ]);
    });

    it('simple function numeric', function () {
        const matches = esquery(simpleFunction, 'FunctionDeclaration[params.0.name=x]');
        assert.includeMembers(matches, [
            simpleFunction.body[0]
        ]);
    });

    it('simple program regexp', function () {
        const matches = esquery(simpleProgram, '[name=/[asdfy]/]');
        assert.includeMembers(matches, [
            simpleProgram.body[1].declarations[0].id,
            simpleProgram.body[3].test,
            simpleProgram.body[3].consequent.body[0].expression.left
        ]);
    });

    it('multiple regexp flags (i and u)', function () {
        const matches = esquery(simpleProgram, '[name=/\\u{61}|[SDFY]/iu]');
        assert.includeMembers(matches, [
            simpleProgram.body[1].declarations[0].id,
            simpleProgram.body[3].test,
            simpleProgram.body[3].consequent.body[0].expression.left
        ]);
    });

    if (parseInt(process.version) >= 8) {
        it('regexp flag (s)', function () {
            const matches = esquery(literal, '[value=/\f.\r/s]');
            assert.includeMembers(matches, [
                literal.body[0].declarations[0].init
            ]);
        });
    }

    it('regexp flag (m)', function () {
        const matches = esquery(literal, '[value=/^\r/m]');
        assert.includeMembers(matches, [
            literal.body[0].declarations[0].init
        ]);
    });

    it('for loop regexp', function () {
        const matches = esquery(forLoop, '[name=/i|foo/]');
        assert.includeMembers(matches, [
            forLoop.body[0].init.left,
            forLoop.body[0].test.left,
            forLoop.body[0].test.right.object,
            forLoop.body[0].update.argument,
            forLoop.body[0].body.body[0].expression.callee.object,
            forLoop.body[0].body.body[0].expression.callee.property
        ]);
    });

    it('nonexistent attribute regexp', function () {
        const matches = esquery(conditional, '[foobar=/./]');
        assert.lengthOf(matches, 0);
    });

    it('not string', function () {
        const matches = esquery(conditional, '[name!="x"]');
        assert.includeMembers(matches, [
            conditional.body[0].consequent.body[0].expression.callee,
            conditional.body[1].consequent.body[0].expression.left
        ]);
    });

    it('not type', function () {
        const matches = esquery(conditional, '[value!=type(number)]');
        assert.includeMembers(matches, [
            conditional.body[1].test.left.left.right,
            conditional.body[1].test.left.right,
            conditional.body[1].alternate
        ]);
    });

    it('not regexp', function () {
        const matches = esquery(conditional, '[name!=/x|y/]');
        assert.includeMembers(matches, [
            conditional.body[0].consequent.body[0].expression.callee
        ]);
    });

    it('less than', function () {
        const matches = esquery(conditional, '[body.length<2]');
        assert.includeMembers(matches, [
            conditional.body[0].consequent,
            conditional.body[0].alternate,
            conditional.body[1].consequent,
            conditional.body[1].alternate.consequent
        ]);
    });

    it('greater than', function () {
        const matches = esquery(conditional, '[body.length>1]');
        assert.includeMembers(matches, [
            conditional
        ]);
    });

    it('less than or equal', function () {
        const matches = esquery(conditional, '[body.length<=2]');
        assert.includeMembers(matches, [
            conditional,
            conditional.body[0].consequent,
            conditional.body[0].alternate,
            conditional.body[1].consequent,
            conditional.body[1].alternate.consequent
        ]);
    });

    it('greater than or equal', function () {
        const matches = esquery(conditional, '[body.length>=1]');
        assert.includeMembers(matches, [
            conditional,
            conditional.body[0].consequent,
            conditional.body[0].alternate,
            conditional.body[1].consequent,
            conditional.body[1].alternate.consequent
        ]);
    });

    it('attribute type', function () {
        let matches = esquery(conditional, '[test=type(object)]');
        assert.includeMembers(matches, [
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ]);

        matches = esquery(conditional, '[value=type(boolean)]');
        assert.includeMembers(matches, [
            conditional.body[1].test.left.right,
            conditional.body[1].alternate.test
        ]);
    });

});
