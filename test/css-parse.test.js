// Tests from: https://github.com/tabatkins/parse-css/
import test from 'node:test';
import assert from 'node:assert';
import { tokenize } from '../src/index.js';

const tests = [
	// tokenize()

	// -- SingleCharacterTokens
	{
		css: '(',
		expected: [{ type: '(' }]
	},
	{
		css: ')',
		expected: [{ type: ')' }]
	},
	{
		css: '[',
		expected: [{ type: '[' }]
	},
	{
		css: ']',
		expected: [{ type: ']' }]
	},
	{
		css: ',',
		expected: [{ type: 'comma' }]
	},
	{
		css: ':',
		expected: [{ type: 'colon' }]
	},
	{
		css: ';',
		expected: [{ type: 'semicolon' }]
	},
	{
		css: ')[',
		expected: [{ type: ')' }, { type: '[' }]
	},
	{
		css: '[)',
		expected: [{ type: '[' }, { type: ')' }]
	},
	{
		css: '{}',
		expected: [{ type: '{' }, { type: '}' }]
	},
	{
		css: ',,',
		expected: [{ type: 'comma' }, { type: 'comma' }]
	},

	// -- MultipleCharacterTokens
	{
		css: '~=',
		expected: [
			{ type: 'delim', value: '~' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		css: '|=',
		expected: [
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		css: '^=',
		expected: [
			{ type: 'delim', value: '^' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		css: '$=',
		expected: [
			{ type: 'delim', value: '$' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		css: '*=',
		expected: [
			{ type: 'delim', value: '*' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		css: '||',
		expected: [
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' }
		]
	},
	{
		css: '|||',
		expected: [
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' }
		]
	},
	{
		css: '<!--',
		expected: [{ type: 'cdo' }]
	},
	{
		css: '<!---',
		expected: [{ type: 'cdo' }, { type: 'delim', value: '-' }]
	},
	{
		css: '-->',
		expected: [{ type: 'cdc' }]
	},

	// -- DelimiterToken
	{
		css: '^',
		expected: [{ type: 'delim', value: '^' }]
	},
	{
		css: '*',
		expected: [{ type: 'delim', value: '*' }]
	},
	{
		css: '%',
		expected: [{ type: 'delim', value: '%' }]
	},
	{
		css: '~',
		expected: [{ type: 'delim', value: '~' }]
	},
	{
		css: '&',
		expected: [{ type: 'delim', value: '&' }]
	},
	{
		css: '|',
		expected: [{ type: 'delim', value: '|' }]
	},
	{
		css: '\x7f',
		expected: [{ type: 'delim', value: '\x7f' }]
	},
	{
		css: '\x01',
		expected: [{ type: 'delim', value: '\x01' }]
	},
	{
		css: '~-',
		expected: [
			{ type: 'delim', value: '~' },
			{ type: 'delim', value: '-' }
		]
	},
	{
		css: '^|',
		expected: [
			{ type: 'delim', value: '^' },
			{ type: 'delim', value: '|' }
		]
	},
	{
		css: '$~',
		expected: [
			{ type: 'delim', value: '$' },
			{ type: 'delim', value: '~' }
		]
	},
	{
		css: '*^',
		expected: [
			{ type: 'delim', value: '*' },
			{ type: 'delim', value: '^' }
		]
	},

	// -- WhitespaceTokens
	{
		css: '   ',
		expected: [{ type: 'whitespace' }]
	},
	{
		css: '\n\rS',
		expected: [{ type: 'whitespace' }, { type: 'ident', value: 'S' }]
	},
	{
		css: '   *',
		expected: [{ type: 'whitespace' }, { type: 'delim', value: '*' }]
	},
	{
		css: '\r\n\f\t2',
		expected: [{ type: 'whitespace' }, { type: 'number', value: 2 }]
	},

	// -- Escapes
	{
		css: 'hel\\6Co',
		expected: [{ type: 'ident', value: 'hello' }]
	},
	{
		css: '\\26 B',
		expected: [{ type: 'ident', value: '&B' }]
	},
	{
		css: "'hel\\6c o'",
		expected: [{ type: 'string', value: 'hello' }]
	},
	{
		css: "'spac\\65\r\ns'",
		expected: [{ type: 'string', value: 'spaces' }]
	},
	{
		css: 'spac\\65\r\ns',
		expected: [{ type: 'ident', value: 'spaces' }]
	},
	{
		css: 'spac\\65\n\rs',
		expected: [
			{ type: 'ident', value: 'space' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 's' }
		]
	},
	{
		css: 'sp\\61\tc\\65\fs',
		expected: [{ type: 'ident', value: 'spaces' }]
	},
	{
		css: 'hel\\6c  o',
		expected: [
			{ type: 'ident', value: 'hell' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'o' }
		]
	},
	{
		css: 'test\\\n',
		expected: [
			{ type: 'ident', value: 'test' },
			{ type: 'delim', value: '\\' },
			{ type: 'whitespace' }
		]
	},
	{
		css: 'test\\D799',
		expected: [{ type: 'ident', value: 'test\uD799' }]
	},
	{
		css: '\\E000',
		expected: [{ type: 'ident', value: '\uE000' }]
	},
	{
		css: 'te\\s\\t',
		expected: [{ type: 'ident', value: 'test' }]
	},
	{
		css: 'spaces\\ in\\\tident',
		expected: [{ type: 'ident', value: 'spaces in\tident' }]
	},
	{
		css: '\\.\\,\\:\\!',
		expected: [{ type: 'ident', value: '.,:!' }]
	},
	{
		css: '\\\r',
		expected: [{ type: 'delim', value: '\\' }, { type: 'whitespace' }]
	},
	{
		css: '\\\f',
		expected: [{ type: 'delim', value: '\\' }, { type: 'whitespace' }]
	},
	{
		css: '\\\r\n',
		expected: [{ type: 'delim', value: '\\' }, { type: 'whitespace' }]
	},
	{
		css: 'null\\\0',
		expected: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		css: 'null\\\0\0',
		expected: [{ type: 'ident', value: 'null\uFFFD\uFFFD' }]
	},
	{
		css: 'null\\0',
		expected: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		css: 'null\\0',
		expected: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		css: 'null\\0000',
		expected: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		css: 'large\\110000',
		expected: [{ type: 'ident', value: 'large\uFFFD' }]
	},
	{
		css: 'large\\23456a',
		expected: [{ type: 'ident', value: 'large\uFFFD' }]
	},
	{
		css: 'surrogate\\D800',
		expected: [{ type: 'ident', value: 'surrogate\uFFFD' }]
	},
	{
		css: 'surrogate\\0DABC',
		expected: [{ type: 'ident', value: 'surrogate\uFFFD' }]
	},
	{
		css: '\\00DFFFsurrogate',
		expected: [{ type: 'ident', value: '\uFFFDsurrogate' }]
	},
	{
		css: '\\10fFfF',
		expected: [{ type: 'ident', value: '\u{10ffff}' }]
	},
	{
		css: '\\10fFfF0',
		expected: [{ type: 'ident', value: '\u{10ffff}0' }]
	},
	{
		css: '\\10000000',
		expected: [{ type: 'ident', value: '\u{100000}00' }]
	},
	{
		css: 'eof\\',
		expected: [{ type: 'ident', value: 'eof\uFFFD' }]
	},

	// -- identToken
	{
		css: 'simple-ident',
		expected: [{ type: 'ident', value: 'simple-ident' }]
	},
	{
		css: 'testing123',
		expected: [{ type: 'ident', value: 'testing123' }]
	},
	{
		css: 'hello!',
		expected: [
			{ type: 'ident', value: 'hello' },
			{ type: 'delim', value: '!' }
		]
	},
	{
		css: 'world\x05',
		expected: [
			{ type: 'ident', value: 'world' },
			{ type: 'delim', value: '\x05' }
		]
	},
	{
		css: '_under score',
		expected: [
			{ type: 'ident', value: '_under' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'score' }
		]
	},
	{
		css: '-_underscore',
		expected: [{ type: 'ident', value: '-_underscore' }]
	},
	{
		css: '-text',
		expected: [{ type: 'ident', value: '-text' }]
	},
	{
		css: '-\\6d',
		expected: [{ type: 'ident', value: '-m' }]
	},
	{
		css: '--abc',
		expected: [{ type: 'ident', value: '--abc' }]
	},
	{
		css: '--',
		expected: [{ type: 'ident', value: '--' }]
	},
	{
		css: '--11',
		expected: [{ type: 'ident', value: '--11' }]
	},
	{
		css: '---',
		expected: [{ type: 'ident', value: '---' }]
	},
	{
		css: '\u2003', // em-space
		expected: [{ type: 'delim', value: '\u2003' }]
	},
	{
		css: '\u{A0}', // non-breaking space
		expected: [{ type: 'delim', value: '\u{A0}' }]
	},
	{
		css: '\u1234',
		expected: [{ type: 'ident', value: '\u1234' }]
	},
	{
		css: '\u{12345}',
		expected: [{ type: 'ident', value: '\u{12345}' }]
	},
	{
		css: '\0',
		expected: [{ type: 'ident', value: '\uFFFD' }]
	},
	{
		css: 'ab\0c',
		expected: [{ type: 'ident', value: 'ab\uFFFDc' }]
	},
	{
		css: 'ab\0c',
		expected: [{ type: 'ident', value: 'ab\uFFFDc' }]
	},

	// -- FunctionToken
	{
		css: 'scale(2)',
		expected: [
			{ type: 'function', value: 'scale' },
			{ type: 'number', value: 2 },
			{ type: ')' }
		]
	},
	{
		css: 'foo-bar\\ baz(',
		expected: [{ type: 'function', value: 'foo-bar baz' }]
	},
	{
		css: 'fun\\(ction(',
		expected: [{ type: 'function', value: 'fun(ction' }]
	},
	{
		css: '-foo(',
		expected: [{ type: 'function', value: '-foo' }]
	},
	{
		css: 'url("foo.gif"',
		expected: [
			{ type: 'function', value: 'url' },
			{ type: 'string', value: 'foo.gif' }
		]
	},
	{
		css: "foo(  'bar.gif'",
		expected: [
			{ type: 'function', value: 'foo' },
			{ type: 'whitespace' },
			{ type: 'string', value: 'bar.gif' }
		]
	},
	{
		css: "url(  'bar.gif'",
		expected: [
			{ type: 'function', value: 'url' },
			{ type: 'whitespace' },
			{ type: 'string', value: 'bar.gif' }
		]
	},

	// -- AtKeywordToken
	{
		css: '@at-keyword',
		expected: [{ type: 'at-keyword', value: 'at-keyword' }]
	},
	{
		css: '@testing123',
		expected: [{ type: 'at-keyword', value: 'testing123' }]
	},
	{
		css: '@hello!',
		expected: [
			{ type: 'at-keyword', value: 'hello' },
			{ type: 'delim', value: '!' }
		]
	},
	{
		css: '@-text',
		expected: [{ type: 'at-keyword', value: '-text' }]
	},
	{
		css: '@--abc',
		expected: [{ type: 'at-keyword', value: '--abc' }]
	},
	{
		css: '@--',
		expected: [{ type: 'at-keyword', value: '--' }]
	},
	{
		css: '@--11',
		expected: [{ type: 'at-keyword', value: '--11' }]
	},
	{
		css: '@---',
		expected: [{ type: 'at-keyword', value: '---' }]
	},
	{
		css: '@\\ ',
		expected: [{ type: 'at-keyword', value: ' ' }]
	},
	{
		css: '@-\\ ',
		expected: [{ type: 'at-keyword', value: '- ' }]
	},
	{
		css: '@@',
		expected: [
			{ type: 'delim', value: '@' },
			{ type: 'delim', value: '@' }
		]
	},
	{
		css: '@2',
		expected: [
			{ type: 'delim', value: '@' },
			{ type: 'number', value: 2 }
		]
	},
	{
		css: '@-1',
		expected: [
			{ type: 'delim', value: '@' },
			{ type: 'number', value: -1 }
		]
	},

	// -- UrlToken
	{
		css: 'url(foo.gif)',
		expected: [{ type: 'url', value: 'foo.gif' }]
	},
	{
		css: 'urL(https://example.com/cats.png)',
		expected: [{ type: 'url', value: 'https://example.com/cats.png' }]
	},
	{
		css: 'uRl(what-a.crazy^URL~this\\ is!)',
		expected: [{ type: 'url', value: 'what-a.crazy^URL~this is!' }]
	},
	{
		css: 'uRL(123#test)',
		expected: [{ type: 'url', value: '123#test' }]
	},
	{
		css: 'Url(escapes\\ \\"\\\'\\)\\()',
		expected: [{ type: 'url', value: 'escapes "\')(' }]
	},
	{
		css: 'UrL(   whitespace   )',
		expected: [{ type: 'url', value: 'whitespace' }]
	},
	{
		css: 'URl( whitespace-eof ',
		expected: [{ type: 'url', value: 'whitespace-eof' }]
	},
	{
		css: 'URL(eof',
		expected: [{ type: 'url', value: 'eof' }]
	},
	{
		css: 'url(not/*a*/comment)',
		expected: [{ type: 'url', value: 'not/*a*/comment' }]
	},
	{
		css: 'urL()',
		expected: [{ type: 'url', value: '' }]
	},

	// {
	// 	css: 'uRl(white space),',
	// 	expected: [{ type: 'bad-url' }, { type: 'comma' }]
	// },
	// {
	// 	css: 'Url(b(ad),',
	// 	expected: [{ type: 'bad-url' }, { type: 'comma' }]
	// },
	// {
	// 	css: "uRl(ba'd):",
	// 	expected: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	css: 'urL(b"ad):',
	// 	expected: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	css: 'uRl(b"ad):',
	// 	expected: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	css: 'Url(b\\\rad):',
	// 	expected: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	css: 'url(b\\\nad):',
	// 	expected: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	css: "url(/*'bad')*/",
	// 	expected: [
	// 		{ type: 'bad-url' },
	// 		{ type: 'delim', value: '*' },
	// 		{ type: 'delim', value: '/' }
	// 	]
	// },
	// {
	// 	css: "url(ba'd\\))",
	// 	expected: [{ type: 'bad-url' }]
	// },
	// {
	// 	css: "url(ba'd\\\\))",
	// 	expected: [{ type: 'bad-url' }, { type: ')' }]
	// },

	// -- StringToken
	{
		css: "'text'",
		expected: [{ type: 'string', value: 'text' }]
	},
	{
		css: '"text"',
		expected: [{ type: 'string', value: 'text' }]
	},
	{
		css: "'testing, 123!'",
		expected: [{ type: 'string', value: 'testing, 123!' }]
	},
	{
		css: "'es\\'ca\\\"pe'",
		expected: [{ type: 'string', value: 'es\'ca"pe' }]
	},
	{
		css: '\'"quotes"\'',
		expected: [{ type: 'string', value: '"quotes"' }]
	},
	{
		css: '"\'quotes\'"',
		expected: [{ type: 'string', value: "'quotes'" }]
	},
	{
		css: '"mismatch\'',
		expected: [{ type: 'string', value: "mismatch'" }]
	},
	{
		css: "'text\x05\t\x13'",
		expected: [{ type: 'string', value: 'text\x05\t\x13' }]
	},
	{
		css: '"end on eof',
		expected: [{ type: 'string', value: 'end on eof' }]
	},
	{
		css: "'esca\\\nped'",
		expected: [{ type: 'string', value: 'escaped' }]
	},
	{
		css: '"esc\\\faped"',
		expected: [{ type: 'string', value: 'escaped' }]
	},
	{
		css: "'new\\\rline'",
		expected: [{ type: 'string', value: 'newline' }]
	},
	{
		css: '"new\\\r\nline"',
		expected: [{ type: 'string', value: 'newline' }]
	},
	// {
	// 	css: "'bad\nstring",
	// 	expected: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	// {
	// 	css: "'bad\rstring",
	// 	expected: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	// {
	// 	css: "'bad\r\nstring",
	// 	expected: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	// {
	// 	css: "'bad\fstring",
	// 	expected: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	{
		css: "'\0'",
		expected: [{ type: 'string', value: '\uFFFD' }]
	},
	{
		css: "'hel\0lo'",
		expected: [{ type: 'string', value: 'hel\uFFFDlo' }]
	},
	{
		css: "'h\\65l\0lo'",
		expected: [{ type: 'string', value: 'hel\uFFFDlo' }]
	},

	// -- HashToken
	{
		css: '#id-selector',
		expected: [{ type: 'hash', value: 'id-selector', id: true }]
	},
	{
		css: '#FF7700',
		expected: [{ type: 'hash', value: 'FF7700', id: true }]
	},
	{
		css: '#3377FF',
		expected: [{ type: 'hash', value: '3377FF', id: false }]
	},
	{
		css: '#\\ ',
		expected: [{ type: 'hash', value: ' ', id: true }]
	},
	{
		css: '# ',
		expected: [{ type: 'delim', value: '#' }, { type: 'whitespace' }]
	},
	{
		css: '#\\\n',
		expected: [
			{ type: 'delim', value: '#' },
			{ type: 'delim', value: '\\' },
			{ type: 'whitespace' }
		]
	},
	{
		css: '#\\\r\n',
		expected: [
			{ type: 'delim', value: '#' },
			{ type: 'delim', value: '\\' },
			{ type: 'whitespace' }
		]
	},
	{
		css: '#!',
		expected: [
			{ type: 'delim', value: '#' },
			{ type: 'delim', value: '!' }
		]
	},

	// -- NumberToken
	{
		css: '10',
		expected: [{ type: 'number', value: 10 }]
	},
	{
		css: '12.0',
		expected: [{ type: 'number', value: 12 }]
	},
	{
		css: '+45.6',
		expected: [{ type: 'number', value: 45.6 }]
	},
	{
		css: '-7',
		expected: [{ type: 'number', value: -7 }]
	},
	{
		css: '010',
		expected: [{ type: 'number', value: 10 }]
	},
	{
		css: '10e0',
		expected: [{ type: 'number', value: 10 }]
	},
	{
		css: '12e3',
		expected: [{ type: 'number', value: 12000 }]
	},
	{
		css: '3e+1',
		expected: [{ type: 'number', value: 30 }]
	},
	{
		css: '12E-1',
		expected: [{ type: 'number', value: 1.2 }]
	},
	{
		css: '.7',
		expected: [{ type: 'number', value: 0.7 }]
	},
	{
		css: '-.3',
		expected: [{ type: 'number', value: -0.3 }]
	},
	{
		css: '+637.54e-2',
		expected: [{ type: 'number', value: 6.3754 }]
	},
	{
		css: '-12.34E+2',
		expected: [{ type: 'number', value: -1234 }]
	},
	{
		css: '+ 5',
		expected: [
			{ type: 'delim', value: '+' },
			{ type: 'whitespace' },
			{ type: 'number', value: 5 }
		]
	},
	{
		css: '-+12',
		expected: [
			{ type: 'delim', value: '-' },
			{ type: 'number', value: 12 }
		]
	},
	{
		css: '+-21',
		expected: [
			{ type: 'delim', value: '+' },
			{ type: 'number', value: -21 }
		]
	},
	{
		css: '++22',
		expected: [
			{ type: 'delim', value: '+' },
			{ type: 'number', value: 22 }
		]
	},
	{
		css: '13.',
		expected: [
			{ type: 'number', value: 13 },
			{ type: 'delim', value: '.' }
		]
	},
	{
		css: '1.e2',
		expected: [
			{ type: 'number', value: 1 },
			{ type: 'delim', value: '.' },
			{ type: 'ident', value: 'e2' }
		]
	},
	{
		css: '2e3.5',
		expected: [
			{ type: 'number', value: 2000 },
			{ type: 'number', value: 0.5 }
		]
	},
	{
		css: '2e3.',
		expected: [
			{ type: 'number', value: 2000 },
			{ type: 'delim', value: '.' }
		]
	},
	{
		css: '1000000000000000000000000',
		expected: [{ type: 'number', value: 1e24 }]
	},

	// -- DimensionToken
	{
		css: '10px',
		expected: [{ type: 'dimension', value: 10, unit: 'px' }]
	},
	{
		css: '12.0em',
		expected: [{ type: 'dimension', value: 12, unit: 'em' }]
	},
	{
		css: '-12.0em',
		expected: [{ type: 'dimension', value: -12, unit: 'em' }]
	},
	{
		css: '+45.6__qem',
		expected: [{ type: 'dimension', value: 45.6, unit: '__qem' }]
	},
	{
		css: '5e',
		expected: [{ type: 'dimension', value: 5, unit: 'e' }]
	},
	{
		css: '5px-2px',
		expected: [{ type: 'dimension', value: 5, unit: 'px-2px' }]
	},
	{
		css: '5e-',
		expected: [{ type: 'dimension', value: 5, unit: 'e-' }]
	},
	{
		css: '5\\ ',
		expected: [{ type: 'dimension', value: 5, unit: ' ' }]
	},
	{
		css: '40\\70\\78',
		expected: [{ type: 'dimension', value: 40, unit: 'px' }]
	},
	{
		css: '4e3e2',
		expected: [{ type: 'dimension', value: 4000, unit: 'e2' }]
	},
	{
		css: '0x10px',
		expected: [{ type: 'dimension', value: 0, unit: 'x10px' }]
	},
	{
		css: '4unit ',
		expected: [
			{ type: 'dimension', value: 4, unit: 'unit' },
			{ type: 'whitespace' }
		]
	},
	{
		css: '5e+',
		expected: [
			{ type: 'dimension', value: 5, unit: 'e' },
			{ type: 'delim', value: '+' }
		]
	},
	{
		css: '2e.5',
		expected: [
			{ type: 'dimension', value: 2, unit: 'e' },
			{ type: 'number', value: 0.5 }
		]
	},
	{
		css: '2e+.5',
		expected: [
			{ type: 'dimension', value: 2, unit: 'e' },
			{ type: 'number', value: 0.5 }
		]
	},

	// -- PercentageToken
	{
		css: '10%',
		expected: [{ type: 'percentage', value: 10 }]
	},
	{
		css: '+12.0%',
		expected: [{ type: 'percentage', value: 12 }]
	},
	{
		css: '-48.99%',
		expected: [{ type: 'percentage', value: -48.99 }]
	},
	{
		css: '6e-1%',
		expected: [{ type: 'percentage', value: 0.6 }]
	},
	{
		css: '5%%',
		expected: [
			{ type: 'percentage', value: 5 },
			{ type: 'delim', value: '%' }
		]
	},

	// -- UnicodeRangeToken
	{
		css: 'u+012345-123456',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 12345 },
			{ type: 'number', value: -123456 }
		]
	},
	{
		css: 'U+1234-2345',
		expected: [
			{ type: 'ident', value: 'U' },
			{ type: 'number', value: 1234 },
			{ type: 'number', value: -2345 }
		]
	},
	{
		css: 'u+222-111',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 222 },
			{ type: 'number', value: -111 }
		]
	},
	{
		css: 'U+CafE-d00D',
		expected: [
			{ type: 'ident', value: 'U' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'CafE-d00D' }
		]
	},
	{
		css: 'U+2??',
		expected: [
			{ type: 'ident', value: 'U' },
			{ type: 'number', value: 2 },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		css: 'U+ab12??',
		expected: [
			{ type: 'ident', value: 'U' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'ab12' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		css: 'u+??????',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		css: 'u+??',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		css: 'u+222+111',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 222 },
			{ type: 'number', value: 111 }
		]
	},
	{
		css: 'u+12345678',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 12345678 }
		]
	},
	{
		css: 'u+123-12345678',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 123 },
			{ type: 'number', value: -12345678 }
		]
	},
	{
		css: 'u+cake',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'cake' }
		]
	},
	{
		css: 'u+1234-gggg',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'dimension', value: 1234, unit: '-gggg' }
		]
	},
	{
		css: 'U+ab12???',
		expected: [
			{ type: 'ident', value: 'U' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'ab12' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		css: 'u+a1?-123',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'a1' },
			{ type: 'delim', value: '?' },
			{ type: 'number', value: -123 }
		]
	},
	{
		css: 'u+1??4',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 1 },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'number', value: 4 }
		]
	},
	{
		css: 'u+z',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'z' }
		]
	},
	{
		css: 'u+',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' }
		]
	},
	{
		css: 'u+-543',
		expected: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'number', value: -543 }
		]
	},

	// -- CommentToken
	{
		css: '/*comment*/a',
		expected: [{ type: 'ident', value: 'a' }]
	},
	{
		css: '/**\\2f**//',
		expected: [{ type: 'delim', value: '/' }]
	},
	{
		css: '/**y*a*y**/ ',
		expected: [{ type: 'whitespace' }]
	},
	{
		css: ',/* \n :) \n */)',
		expected: [{ type: 'comma' }, { type: ')' }]
	},
	{
		css: ':/*/*/',
		expected: [{ type: 'colon' }]
	},
	{
		css: '/**/*',
		expected: [{ type: 'delim', value: '*' }]
	}
	// {
	// 	css: ';/******',
	// 	expected: [{ type: 'semicolon' }]
	// }
];

tests.forEach(testcase => {
	test(testcase.css, t => {
		assert.deepStrictEqual(tokenize(testcase.css), testcase.expected);
	});
});
