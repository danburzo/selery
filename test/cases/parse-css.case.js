/* 
	Tests imported and adapted from: 
	https://github.com/tabatkins/parse-css/

	Note: Some of the original tests are skipped & commented out.
*/

export default [
	// tokenize()

	// -- SingleCharacterTokens
	{
		selector: '(',
		tokenize: [{ type: '(', start: 0, end: 0 }]
	},
	{
		selector: ')',
		tokenize: [{ type: ')', start: 0, end: 0 }]
	},
	{
		selector: '[',
		tokenize: [{ type: '[', start: 0, end: 0 }]
	},
	{
		selector: ']',
		tokenize: [{ type: ']', start: 0, end: 0 }]
	},
	{
		selector: ',',
		tokenize: [{ type: 'comma', start: 0, end: 0 }]
	},
	{
		selector: ':',
		tokenize: [{ type: 'colon', start: 0, end: 0 }]
	},
	{
		selector: ';',
		tokenize: [{ type: 'semicolon', start: 0, end: 0 }]
	},
	{
		selector: ')[',
		tokenize: [
			{ type: ')', start: 0, end: 0 },
			{ type: '[', start: 1, end: 1 }
		]
	},
	{
		selector: '[)',
		tokenize: [
			{ type: '[', start: 0, end: 0 },
			{ type: ')', start: 1, end: 1 }
		]
	},
	{
		selector: '{}',
		tokenize: [
			{ type: '{', start: 0, end: 0 },
			{ type: '}', start: 1, end: 1 }
		]
	},
	{
		selector: ',,',
		tokenize: [
			{ type: 'comma', start: 0, end: 0 },
			{ type: 'comma', start: 1, end: 1 }
		]
	},

	// -- MultipleCharacterTokens
	{
		selector: '~=',
		tokenize: [
			{ type: 'delim', value: '~', start: 0, end: 0 },
			{ type: 'delim', value: '=', start: 1, end: 1 }
		]
	},
	{
		selector: '|=',
		tokenize: [
			{ type: 'delim', value: '|', start: 0, end: 0 },
			{ type: 'delim', value: '=', start: 1, end: 1 }
		]
	},
	{
		selector: '^=',
		tokenize: [
			{ type: 'delim', value: '^', start: 0, end: 0 },
			{ type: 'delim', value: '=', start: 1, end: 1 }
		]
	},
	{
		selector: '$=',
		tokenize: [
			{ type: 'delim', value: '$', start: 0, end: 0 },
			{ type: 'delim', value: '=', start: 1, end: 1 }
		]
	},
	{
		selector: '*=',
		tokenize: [
			{ type: 'delim', value: '*', start: 0, end: 0 },
			{ type: 'delim', value: '=', start: 1, end: 1 }
		]
	},
	{
		selector: '||',
		tokenize: [
			{ type: 'delim', value: '|', start: 0, end: 0 },
			{ type: 'delim', value: '|', start: 1, end: 1 }
		]
	},
	{
		selector: '|||',
		tokenize: [
			{ type: 'delim', value: '|', start: 0, end: 0 },
			{ type: 'delim', value: '|', start: 1, end: 1 },
			{ type: 'delim', value: '|', start: 2, end: 2 }
		]
	},
	{
		selector: '<!--',
		tokenize: [{ type: 'cdo', start: 0, end: 3 }]
	},
	{
		selector: '<!---',
		tokenize: [
			{ type: 'cdo', start: 0, end: 3 },
			{ type: 'delim', value: '-', start: 4, end: 4 }
		]
	},
	{
		selector: '-->',
		tokenize: [{ type: 'cdc', start: 0, end: 2 }]
	},

	// -- DelimiterToken
	{
		selector: '^',
		tokenize: [{ type: 'delim', value: '^', start: 0, end: 0 }]
	},
	{
		selector: '*',
		tokenize: [{ type: 'delim', value: '*', start: 0, end: 0 }]
	},
	{
		selector: '%',
		tokenize: [{ type: 'delim', value: '%', start: 0, end: 0 }]
	},
	{
		selector: '~',
		tokenize: [{ type: 'delim', value: '~', start: 0, end: 0 }]
	},
	{
		selector: '&',
		tokenize: [{ type: 'delim', value: '&', start: 0, end: 0 }]
	},
	{
		selector: '|',
		tokenize: [{ type: 'delim', value: '|', start: 0, end: 0 }]
	},
	{
		selector: '\x7f',
		tokenize: [{ type: 'delim', value: '\x7f', start: 0, end: 0 }]
	},
	{
		selector: '\x01',
		tokenize: [{ type: 'delim', value: '\x01', start: 0, end: 0 }]
	},
	{
		selector: '~-',
		tokenize: [
			{ type: 'delim', value: '~', start: 0, end: 0 },
			{ type: 'delim', value: '-', start: 1, end: 1 }
		]
	},
	{
		selector: '^|',
		tokenize: [
			{ type: 'delim', value: '^', start: 0, end: 0 },
			{ type: 'delim', value: '|', start: 1, end: 1 }
		]
	},
	{
		selector: '$~',
		tokenize: [
			{ type: 'delim', value: '$', start: 0, end: 0 },
			{ type: 'delim', value: '~', start: 1, end: 1 }
		]
	},
	{
		selector: '*^',
		tokenize: [
			{ type: 'delim', value: '*', start: 0, end: 0 },
			{ type: 'delim', value: '^', start: 1, end: 1 }
		]
	},

	// -- WhitespaceTokens
	{
		selector: '   ',
		tokenize: [{ type: 'whitespace', start: 0, end: 2 }]
	},
	{
		selector: '\n\rS',
		tokenize: [
			{ type: 'whitespace', start: 0, end: 1 },
			{ type: 'ident', value: 'S', start: 2, end: 2 }
		]
	},
	{
		selector: '   *',
		tokenize: [
			{ type: 'whitespace', start: 0, end: 2 },
			{ type: 'delim', value: '*', start: 3, end: 3 }
		]
	},
	{
		selector: '\r\n\f\t2',
		tokenize: [
			{ type: 'whitespace', start: 0, end: 2 },
			{ type: 'number', value: 2, start: 3, end: 3 }
		]
	},

	// -- Escapes
	{
		selector: 'hel\\6Co',
		tokenize: [{ type: 'ident', value: 'hello', start: 0, end: 6 }]
	},
	{
		selector: '\\26 B',
		tokenize: [{ type: 'ident', value: '&B', start: 0, end: 4 }]
	},
	{
		selector: "'hel\\6c o'",
		tokenize: [{ type: 'string', value: 'hello', start: 0, end: 9 }]
	},
	{
		selector: "'spac\\65\r\ns'",
		tokenize: [{ type: 'string', value: 'spaces', start: 0, end: 10 }]
	},
	{
		selector: 'spac\\65\r\ns',
		tokenize: [{ type: 'ident', value: 'spaces', start: 0, end: 8 }]
	},

	{
		selector: 'spac\\65',
		tokenize: [{ type: 'ident', value: 'space', start: 0, end: 6 }]
	},

	{
		selector: 'spac\\65\n\rs',
		tokenize: [
			{ type: 'ident', value: 'space', start: 0, end: 7 },
			{ type: 'whitespace', start: 8, end: 8 },
			{ type: 'ident', value: 's', start: 9, end: 9 }
		]
	},
	{
		selector: 'sp\\61\tc\\65\fs',
		tokenize: [{ type: 'ident', value: 'spaces', start: 0, end: 11 }]
	},

	// first whitespace after escaped codepoint is part of ident
	{
		selector: 'hel\\6c  o',
		tokenize: [
			{ type: 'ident', value: 'hell', start: 0, end: 6 },
			{ type: 'whitespace', start: 7, end: 7 },
			{ type: 'ident', value: 'o', start: 8, end: 8 }
		]
	},
	// {
	// 	selector: 'test\\\n',
	// 	skip: true,
	// 	tokenize: [
	// 		{ type: 'ident', value: 'test' },
	// 		{ type: 'delim', value: '\\' },
	// 		{ type: 'whitespace' }
	// 	]
	// },
	{
		selector: 'test\\D799',
		tokenize: [{ type: 'ident', value: 'test\uD799', start: 0, end: 8 }]
	},
	{
		selector: '\\E000',
		tokenize: [{ type: 'ident', value: '\uE000', start: 0, end: 4 }]
	},
	{
		selector: 'te\\s\\t',
		tokenize: [{ type: 'ident', value: 'test', start: 0, end: 5 }]
	},
	{
		selector: 'spaces\\ in\\\tident',
		tokenize: [{ type: 'ident', value: 'spaces in\tident', start: 0, end: 16 }]
	},
	{
		selector: '\\.\\,\\:\\!',
		tokenize: [{ type: 'ident', value: '.,:!', start: 0, end: 7 }]
	},
	// {
	// 	selector: '\\\r',
	// 	skip: true,
	// 	tokenize: [{ type: 'delim', value: '\\' }, { type: 'whitespace' }]
	// },
	// {
	// 	selector: '\\\f',
	// 	skip: true,
	// 	tokenize: [{ type: 'delim', value: '\\' }, { type: 'whitespace' }]
	// },
	// {
	// 	selector: '\\\r\n',
	// 	skip: true,
	// 	tokenize: [{ type: 'delim', value: '\\' }, { type: 'whitespace' }]
	// },
	{
		selector: 'null\\\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD', start: 0, end: 5 }]
	},
	{
		selector: 'null\\\0\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD\uFFFD', start: 0, end: 6 }]
	},
	{
		selector: 'null\\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD', start: 0, end: 5 }]
	},
	{
		selector: 'null\\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD', start: 0, end: 5 }]
	},
	{
		selector: 'null\\0000',
		tokenize: [{ type: 'ident', value: 'null\uFFFD', start: 0, end: 8 }]
	},
	{
		selector: 'large\\110000',
		tokenize: [{ type: 'ident', value: 'large\uFFFD', start: 0, end: 11 }]
	},
	{
		selector: 'large\\23456a',
		tokenize: [{ type: 'ident', value: 'large\uFFFD', start: 0, end: 11 }]
	},
	{
		selector: 'surrogate\\D800',
		tokenize: [{ type: 'ident', value: 'surrogate\uFFFD', start: 0, end: 13 }]
	},
	{
		selector: 'surrogate\\0DABC',
		tokenize: [{ type: 'ident', value: 'surrogate\uFFFD', start: 0, end: 14 }]
	},
	{
		selector: '\\00DFFFsurrogate',
		tokenize: [{ type: 'ident', value: '\uFFFDsurrogate', start: 0, end: 15 }]
	},
	{
		selector: '\\10fFfF',
		tokenize: [{ type: 'ident', value: '\u{10ffff}', start: 0, end: 6 }]
	},
	{
		selector: '\\10fFfF0',
		tokenize: [{ type: 'ident', value: '\u{10ffff}0', start: 0, end: 7 }]
	},
	{
		selector: '\\10000000',
		tokenize: [{ type: 'ident', value: '\u{100000}00', start: 0, end: 8 }]
	},
	// {
	// 	selector: 'eof\\',
	// 	skip: true,
	// 	tokenize: [{ type: 'ident', value: 'eof\uFFFD' }]
	// },

	// -- identToken
	{
		selector: 'simple-ident',
		tokenize: [{ type: 'ident', value: 'simple-ident', start: 0, end: 11 }]
	},
	{
		selector: 'testing123',
		tokenize: [{ type: 'ident', value: 'testing123', start: 0, end: 9 }]
	},
	{
		selector: 'hello!',
		tokenize: [
			{ type: 'ident', value: 'hello', start: 0, end: 4 },
			{ type: 'delim', value: '!', start: 5, end: 5 }
		]
	},
	{
		selector: 'world\x05',
		tokenize: [
			{ type: 'ident', value: 'world', start: 0, end: 4 },
			{ type: 'delim', value: '\x05', start: 5, end: 5 }
		]
	},
	{
		selector: '_under score',
		tokenize: [
			{ type: 'ident', value: '_under', start: 0, end: 5 },
			{ type: 'whitespace', start: 6, end: 6 },
			{ type: 'ident', value: 'score', start: 7, end: 11 }
		]
	},
	{
		selector: '-_underscore',
		tokenize: [{ type: 'ident', value: '-_underscore', start: 0, end: 11 }]
	},
	{
		selector: '-text',
		tokenize: [{ type: 'ident', value: '-text', start: 0, end: 4 }]
	},
	{
		selector: '-\\6d',
		tokenize: [{ type: 'ident', value: '-m', start: 0, end: 3 }]
	},
	{
		selector: '--abc',
		tokenize: [{ type: 'ident', value: '--abc', start: 0, end: 4 }]
	},
	{
		selector: '--',
		tokenize: [{ type: 'ident', value: '--', start: 0, end: 1 }]
	},
	{
		selector: '--11',
		tokenize: [{ type: 'ident', value: '--11', start: 0, end: 3 }]
	},
	{
		selector: '---',
		tokenize: [{ type: 'ident', value: '---', start: 0, end: 2 }]
	},
	{
		selector: '\u2003', // em-space
		tokenize: [{ type: 'delim', value: '\u2003', start: 0, end: 0 }]
	},
	{
		selector: '\u{A0}', // non-breaking space
		tokenize: [{ type: 'delim', value: '\u{A0}', start: 0, end: 0 }]
	},
	{
		selector: '\u1234',
		tokenize: [{ type: 'ident', value: '\u1234', start: 0, end: 0 }]
	},
	{
		selector: '\u{12345}',
		tokenize: [{ type: 'ident', value: '\u{12345}', start: 0, end: 0 }]
	},
	{
		selector: '\0',
		tokenize: [{ type: 'ident', value: '\uFFFD', start: 0, end: 0 }]
	},
	{
		selector: 'ab\0c',
		tokenize: [{ type: 'ident', value: 'ab\uFFFDc', start: 0, end: 3 }]
	},

	// -- FunctionToken
	{
		selector: 'scale(2)',
		tokenize: [
			{ type: 'function', value: 'scale', start: 0, end: 5 },
			{ type: 'number', value: 2, start: 6, end: 6 },
			{ type: ')', start: 7, end: 7 }
		]
	},
	{
		selector: 'foo-bar\\ baz(',
		tokenize: [{ type: 'function', value: 'foo-bar baz', start: 0, end: 12 }]
	},
	{
		selector: 'fun\\(ction(',
		tokenize: [{ type: 'function', value: 'fun(ction', start: 0, end: 10 }]
	},
	{
		selector: '-foo(',
		tokenize: [{ type: 'function', value: '-foo', start: 0, end: 4 }]
	},
	{
		selector: 'url("foo.gif"',
		tokenize: [
			{ type: 'function', value: 'url', start: 0, end: 3 },
			{ type: 'string', value: 'foo.gif', start: 4, end: 12 }
		]
	},
	{
		selector: "foo(  'bar.gif'",
		tokenize: [
			{ type: 'function', value: 'foo', start: 0, end: 3 },
			{ type: 'whitespace', start: 4, end: 5 },
			{ type: 'string', value: 'bar.gif', start: 6, end: 14 }
		]
	},
	{
		selector: "url(  'bar.gif'",
		tokenize: [
			{ type: 'function', value: 'url', start: 0, end: 4 },
			{ type: 'whitespace', start: 5, end: 5 },
			{ type: 'string', value: 'bar.gif', start: 6, end: 14 }
		]
	},

	// -- AtKeywordToken
	{
		selector: '@at-keyword',
		tokenize: [{ type: 'at-keyword', value: 'at-keyword', start: 0, end: 10 }]
	},
	{
		selector: '@testing123',
		tokenize: [{ type: 'at-keyword', value: 'testing123', start: 0, end: 10 }]
	},
	{
		selector: '@hello!',
		tokenize: [
			{ type: 'at-keyword', value: 'hello', start: 0, end: 5 },
			{ type: 'delim', value: '!', start: 6, end: 6 }
		]
	},
	{
		selector: '@-text',
		tokenize: [{ type: 'at-keyword', value: '-text', start: 0, end: 5 }]
	},
	{
		selector: '@--abc',
		tokenize: [{ type: 'at-keyword', value: '--abc', start: 0, end: 5 }]
	},
	{
		selector: '@--',
		tokenize: [{ type: 'at-keyword', value: '--', start: 0, end: 2 }]
	},
	{
		selector: '@--11',
		tokenize: [{ type: 'at-keyword', value: '--11', start: 0, end: 4 }]
	},
	{
		selector: '@---',
		tokenize: [{ type: 'at-keyword', value: '---', start: 0, end: 3 }]
	},
	{
		selector: '@\\ ',
		tokenize: [{ type: 'at-keyword', value: ' ', start: 0, end: 2 }]
	},
	{
		selector: '@-\\ ',
		tokenize: [{ type: 'at-keyword', value: '- ', start: 0, end: 3 }]
	},
	{
		selector: '@@',
		tokenize: [
			{ type: 'delim', value: '@', start: 0, end: 0 },
			{ type: 'delim', value: '@', start: 1, end: 1 }
		]
	},
	{
		selector: '@2',
		tokenize: [
			{ type: 'delim', value: '@', start: 0, end: 0 },
			{ type: 'number', value: 2, start: 1, end: 1 }
		]
	},
	{
		selector: '@-1',
		tokenize: [
			{ type: 'delim', value: '@', start: 0, end: 0 },
			{ type: 'number', value: -1, sign: '-', start: 1, end: 2 }
		]
	},

	// -- UrlToken
	{
		selector: 'url(foo.gif)',
		tokenize: [{ type: 'url', value: 'foo.gif', start: 0, end: 11 }]
	},
	{
		selector: 'urL(https://example.com/cats.png)',
		tokenize: [
			{ type: 'url', value: 'https://example.com/cats.png', start: 0, end: 32 }
		]
	},
	// {
	// 	skip: true,
	// 	selector: 'uRl(what-a.crazy^URL~this\\ is!)',
	// 	tokenize: [{ type: 'url', value: 'what-a.crazy^URL~this is!' }]
	// },
	{
		selector: 'uRL(123#test)',
		tokenize: [{ type: 'url', value: '123#test', start: 0, end: 12 }]
	},
	// {
	// 	skip: true,
	// 	selector: 'Url(escapes\\ \\"\\\'\\)\\()',
	// 	tokenize: [{ type: 'url', value: 'escapes "\')(' }]
	// },
	{
		selector: 'UrL(   whitespace   )',
		tokenize: [{ type: 'url', value: 'whitespace', start: 0, end: 20 }]
	},
	// {
	// 	skip: true,
	// 	selector: 'URl( whitespace-eof ',
	// 	tokenize: [{ type: 'url', value: 'whitespace-eof' }]
	// },
	// {
	// 	skip: true,
	// 	selector: 'URL(eof',
	// 	tokenize: [{ type: 'url', value: 'eof' }]
	// },
	{
		selector: 'url(not/*a*/comment)',
		tokenize: [{ type: 'url', value: 'not/*a*/comment', start: 0, end: 19 }]
	},
	{
		selector: 'urL()',
		tokenize: [{ type: 'url', value: '', start: 0, end: 4 }]
	},

	// {
	// 	skip: true,
	// 	selector: 'uRl(white space),',
	// 	tokenize: [{ type: 'bad-url' }, { type: 'comma' }]
	// },
	// {
	// 	skip: true,
	// 	selector: 'Url(b(ad),',
	// 	tokenize: [{ type: 'bad-url' }, { type: 'comma' }]
	// },
	// {
	// 	skip: true,
	// 	selector: "uRl(ba'd):",
	// 	tokenize: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	skip: true,
	// 	selector: 'urL(b"ad):',
	// 	tokenize: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	skip: true,
	// 	selector: 'uRl(b"ad):',
	// 	tokenize: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	skip: true,
	// 	selector: 'Url(b\\\rad):',
	// 	tokenize: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	skip: true,
	// 	selector: 'url(b\\\nad):',
	// 	tokenize: [{ type: 'bad-url' }, { type: 'colon' }]
	// },
	// {
	// 	skip: true,
	// 	selector: "url(/*'bad')*/",
	// 	tokenize: [
	// 		{ type: 'bad-url' },
	// 		{ type: 'delim', value: '*' },
	// 		{ type: 'delim', value: '/' }
	// 	]
	// },
	// {
	// 	skip: true,
	// 	selector: "url(ba'd\\))",
	// 	tokenize: [{ type: 'bad-url' }]
	// },
	// {
	// 	skip: true,
	// 	selector: "url(ba'd\\\\))",
	// 	tokenize: [{ type: 'bad-url' }, { type: ')' }]
	// },

	// -- StringToken
	{
		selector: "'text'",
		tokenize: [{ type: 'string', value: 'text', start: 0, end: 5 }]
	},
	{
		selector: '"text"',
		tokenize: [{ type: 'string', value: 'text', start: 0, end: 5 }]
	},
	{
		selector: "'testing, 123!'",
		tokenize: [{ type: 'string', value: 'testing, 123!', start: 0, end: 14 }]
	},
	{
		selector: "'es\\'ca\\\"pe'",
		tokenize: [{ type: 'string', value: 'es\'ca"pe', start: 0, end: 11 }]
	},
	{
		selector: '\'"quotes"\'',
		tokenize: [{ type: 'string', value: '"quotes"', start: 0, end: 9 }]
	},
	{
		selector: '"\'quotes\'"',
		tokenize: [{ type: 'string', value: "'quotes'", start: 0, end: 9 }]
	},
	// {
	// 	skip: true,
	// 	selector: '"mismatch\'',
	// 	tokenize: [{ type: 'string', value: "mismatch'" }]
	// },
	{
		selector: "'text\x05\t\x13'",
		tokenize: [{ type: 'string', value: 'text\x05\t\x13', start: 0, end: 8 }]
	},
	// {
	// 	skip: true,
	// 	selector: '"end on eof',
	// 	tokenize: [{ type: 'string', value: 'end on eof' }]
	// },
	{
		selector: "'esca\\\nped'",
		tokenize: [{ type: 'string', value: 'escaped', start: 0, end: 10 }]
	},
	{
		selector: '"esc\\\faped"',
		tokenize: [{ type: 'string', value: 'escaped', start: 0, end: 10 }]
	},
	{
		selector: "'new\\\rline'",
		tokenize: [{ type: 'string', value: 'newline', start: 0, end: 10 }]
	},
	{
		selector: '"new\\\r\nline"',
		tokenize: [{ type: 'string', value: 'newline', start: 0, end: 10 }]
	},
	// {
	// 	skip: true,
	// 	selector: "'bad\nstring",
	// 	tokenize: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	// {
	// 	skip: true,
	// 	selector: "'bad\rstring",
	// 	tokenize: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	// {
	// 	skip: true,
	// 	selector: "'bad\r\nstring",
	// 	tokenize: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	// {
	// 	skip: true,
	// 	selector: "'bad\fstring",
	// 	tokenize: [
	// 		{ type: 'bad-string' },
	// 		{ type: 'whitespace' },
	// 		{ type: 'ident', value: 'string' }
	// 	]
	// },
	{
		selector: "'\0'",
		tokenize: [{ type: 'string', value: '\uFFFD', start: 0, end: 2 }]
	},
	{
		selector: "'hel\0lo'",
		tokenize: [{ type: 'string', value: 'hel\uFFFDlo', start: 0, end: 7 }]
	},
	{
		selector: "'h\\65l\0lo'",
		tokenize: [{ type: 'string', value: 'hel\uFFFDlo', start: 0, end: 9 }]
	},

	// -- HashToken
	{
		selector: '#id-selector',
		tokenize: [
			{ type: 'hash', value: 'id-selector', id: true, start: 0, end: 11 }
		]
	},
	{
		selector: '#FF7700',
		tokenize: [{ type: 'hash', value: 'FF7700', id: true, start: 0, end: 6 }]
	},
	{
		selector: '#3377FF',
		tokenize: [{ type: 'hash', value: '3377FF', start: 0, end: 6 }]
	},
	{
		selector: '#\\ ',
		tokenize: [{ type: 'hash', value: ' ', id: true, start: 0, end: 2 }]
	},
	{
		selector: '# ',
		tokenize: [
			{ type: 'delim', value: '#', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 }
		]
	},
	// {
	// 	skip: true,
	// 	selector: '#\\\n',
	// 	tokenize: [
	// 		{ type: 'delim', value: '#' },
	// 		{ type: 'delim', value: '\\' },
	// 		{ type: 'whitespace' }
	// 	]
	// },
	// {
	// 	skip: true,
	// 	selector: '#\\\r\n',
	// 	tokenize: [
	// 		{ type: 'delim', value: '#' },
	// 		{ type: 'delim', value: '\\' },
	// 		{ type: 'whitespace' }
	// 	]
	// },
	{
		selector: '#!',
		tokenize: [
			{ type: 'delim', value: '#', start: 0, end: 0 },
			{ type: 'delim', value: '!', start: 1, end: 1 }
		]
	},

	// -- NumberToken
	{
		selector: '10',
		tokenize: [{ type: 'number', value: 10, start: 0, end: 1 }]
	},
	{
		selector: '12.0',
		tokenize: [{ type: 'number', value: 12, start: 0, end: 3 }]
	},
	{
		selector: '+45.6',
		tokenize: [{ type: 'number', value: 45.6, sign: '+', start: 0, end: 4 }]
	},
	{
		selector: '-7',
		tokenize: [{ type: 'number', value: -7, sign: '-', start: 0, end: 1 }]
	},
	{
		selector: '010',
		tokenize: [{ type: 'number', value: 10, start: 0, end: 2 }]
	},
	{
		selector: '10e0',
		tokenize: [{ type: 'number', value: 10, start: 0, end: 3 }]
	},
	{
		selector: '12e3',
		tokenize: [{ type: 'number', value: 12000, start: 0, end: 3 }]
	},
	{
		selector: '3e+1',
		tokenize: [{ type: 'number', value: 30, start: 0, end: 3 }]
	},
	{
		selector: '12E-1',
		tokenize: [{ type: 'number', value: 1.2, start: 0, end: 4 }]
	},
	{
		selector: '.7',
		tokenize: [{ type: 'number', value: 0.7, start: 0, end: 1 }]
	},
	{
		selector: '-.3',
		tokenize: [{ type: 'number', value: -0.3, sign: '-', start: 0, end: 2 }]
	},
	{
		selector: '+637.54e-2',
		tokenize: [{ type: 'number', value: 6.3754, sign: '+', start: 0, end: 9 }]
	},
	{
		selector: '-12.34E+2',
		tokenize: [{ type: 'number', value: -1234, sign: '-', start: 0, end: 8 }]
	},
	{
		selector: '+ 5',
		tokenize: [
			{ type: 'delim', value: '+', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 },
			{ type: 'number', value: 5, start: 2, end: 2 }
		]
	},
	{
		selector: '-+12',
		tokenize: [
			{ type: 'delim', value: '-', start: 0, end: 0 },
			{ type: 'number', value: 12, sign: '+', start: 1, end: 3 }
		]
	},
	{
		selector: '+-21',
		tokenize: [
			{ type: 'delim', value: '+', start: 0, end: 0 },
			{ type: 'number', value: -21, sign: '-', start: 1, end: 3 }
		]
	},
	{
		selector: '++22',
		tokenize: [
			{ type: 'delim', value: '+', start: 0, end: 0 },
			{ type: 'number', value: 22, sign: '+', start: 1, end: 3 }
		]
	},
	{
		selector: '13.',
		tokenize: [
			{ type: 'number', value: 13, start: 0, end: 1 },
			{ type: 'delim', value: '.', start: 2, end: 2 }
		]
	},
	{
		selector: '1.e2',
		tokenize: [
			{ type: 'number', value: 1, start: 0, end: 0 },
			{ type: 'delim', value: '.', start: 1, end: 1 },
			{ type: 'ident', value: 'e2', start: 2, end: 3 }
		]
	},
	{
		selector: '2e3.5',
		tokenize: [
			{ type: 'number', value: 2000, start: 0, end: 2 },
			{ type: 'number', value: 0.5, start: 3, end: 4 }
		]
	},
	{
		selector: '2e3.',
		tokenize: [
			{ type: 'number', value: 2000, start: 0, end: 2 },
			{ type: 'delim', value: '.', start: 3, end: 3 }
		]
	},
	{
		selector: '1000000000000000000000000',
		tokenize: [{ type: 'number', value: 1e24, start: 0, end: 24 }]
	},

	// -- DimensionToken
	{
		selector: '10px',
		tokenize: [{ type: 'dimension', value: 10, unit: 'px', start: 0, end: 3 }]
	},
	{
		selector: '12.0em',
		tokenize: [{ type: 'dimension', value: 12, unit: 'em', start: 0, end: 5 }]
	},
	{
		selector: '-12.0em',
		tokenize: [
			{ type: 'dimension', value: -12, unit: 'em', sign: '-', start: 0, end: 6 }
		]
	},
	{
		selector: '+45.6__qem',
		tokenize: [
			{
				type: 'dimension',
				value: 45.6,
				unit: '__qem',
				sign: '+',
				start: 0,
				end: 9
			}
		]
	},
	{
		selector: '5e',
		tokenize: [{ type: 'dimension', value: 5, unit: 'e', start: 0, end: 1 }]
	},
	{
		selector: '5px-2px',
		tokenize: [
			{ type: 'dimension', value: 5, unit: 'px-2px', start: 0, end: 6 }
		]
	},
	{
		selector: '5e-',
		tokenize: [{ type: 'dimension', value: 5, unit: 'e-', start: 0, end: 2 }]
	},
	{
		selector: '5\\ ',
		tokenize: [{ type: 'dimension', value: 5, unit: ' ', start: 0, end: 2 }]
	},
	{
		selector: '40\\70\\78',
		tokenize: [{ type: 'dimension', value: 40, unit: 'px', start: 0, end: 7 }]
	},
	{
		selector: '4e3e2',
		tokenize: [{ type: 'dimension', value: 4000, unit: 'e2', start: 0, end: 4 }]
	},
	{
		selector: '0x10px',
		tokenize: [{ type: 'dimension', value: 0, unit: 'x10px', start: 0, end: 5 }]
	},
	{
		selector: '4unit ',
		tokenize: [
			{ type: 'dimension', value: 4, unit: 'unit', start: 0, end: 4 },
			{ type: 'whitespace', start: 5, end: 5 }
		]
	},
	{
		selector: '5e+',
		tokenize: [
			{ type: 'dimension', value: 5, unit: 'e', start: 0, end: 1 },
			{ type: 'delim', value: '+', start: 2, end: 2 }
		]
	},
	{
		selector: '2e.5',
		tokenize: [
			{ type: 'dimension', value: 2, unit: 'e', start: 0, end: 1 },
			{ type: 'number', value: 0.5, start: 2, end: 3 }
		]
	},
	{
		selector: '2e+.5',
		tokenize: [
			{ type: 'dimension', value: 2, unit: 'e', start: 0, end: 1 },
			{ type: 'number', value: 0.5, sign: '+', start: 2, end: 4 }
		]
	},

	// -- PercentageToken
	{
		selector: '10%',
		tokenize: [{ type: 'percentage', value: 10, start: 0, end: 2 }]
	},
	{
		selector: '+12.0%',
		tokenize: [{ type: 'percentage', value: 12, sign: '+', start: 0, end: 5 }]
	},
	{
		selector: '-48.99%',
		tokenize: [
			{ type: 'percentage', value: -48.99, sign: '-', start: 0, end: 6 }
		]
	},
	{
		selector: '6e-1%',
		tokenize: [{ type: 'percentage', value: 0.6, start: 0, end: 4 }]
	},
	{
		selector: '5%%',
		tokenize: [
			{ type: 'percentage', value: 5, start: 0, end: 1 },
			{ type: 'delim', value: '%', start: 2, end: 2 }
		]
	},

	// -- UnicodeRangeToken
	{
		selector: 'u+012345-123456',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'number', value: 12345, sign: '+', start: 1, end: 7 },
			{ type: 'number', value: -123456, sign: '-', start: 8, end: 14 }
		]
	},
	{
		selector: 'U+1234-2345',
		tokenize: [
			{ type: 'ident', value: 'U', start: 0, end: 0 },
			{ type: 'number', value: 1234, sign: '+', start: 1, end: 5 },
			{ type: 'number', value: -2345, sign: '-', start: 6, end: 10 }
		]
	},
	{
		selector: 'u+222-111',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'number', value: 222, sign: '+', start: 1, end: 4 },
			{ type: 'number', value: -111, sign: '-', start: 5, end: 8 }
		]
	},
	{
		selector: 'U+CafE-d00D',
		tokenize: [
			{ type: 'ident', value: 'U', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'ident', value: 'CafE-d00D', start: 2, end: 10 }
		]
	},
	{
		selector: 'U+2??',
		tokenize: [
			{ type: 'ident', value: 'U', start: 0, end: 0 },
			{ type: 'number', value: 2, sign: '+', start: 1, end: 2 },
			{ type: 'delim', value: '?', start: 3, end: 3 },
			{ type: 'delim', value: '?', start: 4, end: 4 }
		]
	},
	{
		selector: 'U+ab12??',
		tokenize: [
			{ type: 'ident', value: 'U', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'ident', value: 'ab12', start: 2, end: 5 },
			{ type: 'delim', value: '?', start: 6, end: 6 },
			{ type: 'delim', value: '?', start: 7, end: 7 }
		]
	},
	{
		selector: 'u+??????',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'delim', value: '?', start: 2, end: 2 },
			{ type: 'delim', value: '?', start: 3, end: 3 },
			{ type: 'delim', value: '?', start: 4, end: 4 },
			{ type: 'delim', value: '?', start: 5, end: 5 },
			{ type: 'delim', value: '?', start: 6, end: 6 },
			{ type: 'delim', value: '?', start: 7, end: 7 }
		]
	},
	{
		selector: 'u+??',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'delim', value: '?', start: 2, end: 2 },
			{ type: 'delim', value: '?', start: 3, end: 3 }
		]
	},
	{
		selector: 'u+222+111',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'number', value: 222, sign: '+', start: 1, end: 4 },
			{ type: 'number', value: 111, sign: '+', start: 5, end: 8 }
		]
	},
	{
		selector: 'u+12345678',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'number', value: 12345678, sign: '+', start: 1, end: 9 }
		]
	},
	{
		selector: 'u+123-12345678',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'number', value: 123, sign: '+', start: 1, end: 4 },
			{ type: 'number', value: -12345678, sign: '-', start: 5, end: 13 }
		]
	},
	{
		selector: 'u+cake',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'ident', value: 'cake', start: 2, end: 5 }
		]
	},
	{
		selector: 'u+1234-gggg',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{
				type: 'dimension',
				value: 1234,
				unit: '-gggg',
				sign: '+',
				start: 1,
				end: 10
			}
		]
	},
	{
		selector: 'U+ab12???',
		tokenize: [
			{ type: 'ident', value: 'U', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'ident', value: 'ab12', start: 2, end: 5 },
			{ type: 'delim', value: '?', start: 6, end: 6 },
			{ type: 'delim', value: '?', start: 7, end: 7 },
			{ type: 'delim', value: '?', start: 8, end: 8 }
		]
	},
	{
		selector: 'u+a1?-123',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'ident', value: 'a1', start: 2, end: 3 },
			{ type: 'delim', value: '?', start: 4, end: 4 },
			{ type: 'number', value: -123, sign: '-', start: 5, end: 8 }
		]
	},
	{
		selector: 'u+1??4',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'number', value: 1, sign: '+', start: 1, end: 2 },
			{ type: 'delim', value: '?', start: 3, end: 3 },
			{ type: 'delim', value: '?', start: 4, end: 4 },
			{ type: 'number', value: 4, start: 5, end: 5 }
		]
	},
	{
		selector: 'u+z',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'ident', value: 'z', start: 2, end: 2 }
		]
	},
	{
		selector: 'u+',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 }
		]
	},
	{
		selector: 'u+-543',
		tokenize: [
			{ type: 'ident', value: 'u', start: 0, end: 0 },
			{ type: 'delim', value: '+', start: 1, end: 1 },
			{ type: 'number', value: -543, sign: '-', start: 2, end: 5 }
		]
	},

	// -- CommentToken
	{
		selector: '/*comment*/a',
		tokenize: [{ type: 'ident', value: 'a', start: 11, end: 11 }]
	},
	{
		selector: '/**\\2f**//',
		tokenize: [{ type: 'delim', value: '/', start: 9, end: 9 }]
	},
	{
		selector: '/**y*a*y**/ ',
		tokenize: [{ type: 'whitespace', start: 11, end: 11 }]
	},
	{
		selector: ',/* \n :) \n */)',
		tokenize: [
			{ type: 'comma', start: 0, end: 0 },
			{ type: ')', start: 13, end: 13 }
		]
	},
	{
		selector: ':/*/*/',
		tokenize: [{ type: 'colon', start: 0, end: 0 }]
	},
	{
		selector: '/**/*',
		tokenize: [{ type: 'delim', value: '*', start: 4, end: 4 }]
	}
	// {
	// 	skip: true,
	// 	selector: ';/******',
	// 	tokenize: [{ type: 'semicolon' }]
	// }
];
