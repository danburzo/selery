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
		tokenize: [{ type: '(' }]
	},
	{
		selector: ')',
		tokenize: [{ type: ')' }]
	},
	{
		selector: '[',
		tokenize: [{ type: '[' }]
	},
	{
		selector: ']',
		tokenize: [{ type: ']' }]
	},
	{
		selector: ',',
		tokenize: [{ type: 'comma' }]
	},
	{
		selector: ':',
		tokenize: [{ type: 'colon' }]
	},
	{
		selector: ';',
		tokenize: [{ type: 'semicolon' }]
	},
	{
		selector: ')[',
		tokenize: [{ type: ')' }, { type: '[' }]
	},
	{
		selector: '[)',
		tokenize: [{ type: '[' }, { type: ')' }]
	},
	{
		selector: '{}',
		tokenize: [{ type: '{' }, { type: '}' }]
	},
	{
		selector: ',,',
		tokenize: [{ type: 'comma' }, { type: 'comma' }]
	},

	// -- MultipleCharacterTokens
	{
		selector: '~=',
		tokenize: [
			{ type: 'delim', value: '~' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		selector: '|=',
		tokenize: [
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		selector: '^=',
		tokenize: [
			{ type: 'delim', value: '^' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		selector: '$=',
		tokenize: [
			{ type: 'delim', value: '$' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		selector: '*=',
		tokenize: [
			{ type: 'delim', value: '*' },
			{ type: 'delim', value: '=' }
		]
	},
	{
		selector: '||',
		tokenize: [
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' }
		]
	},
	{
		selector: '|||',
		tokenize: [
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' }
		]
	},
	{
		selector: '<!--',
		tokenize: [{ type: 'cdo' }]
	},
	{
		selector: '<!---',
		tokenize: [{ type: 'cdo' }, { type: 'delim', value: '-' }]
	},
	{
		selector: '-->',
		tokenize: [{ type: 'cdc' }]
	},

	// -- DelimiterToken
	{
		selector: '^',
		tokenize: [{ type: 'delim', value: '^' }]
	},
	{
		selector: '*',
		tokenize: [{ type: 'delim', value: '*' }]
	},
	{
		selector: '%',
		tokenize: [{ type: 'delim', value: '%' }]
	},
	{
		selector: '~',
		tokenize: [{ type: 'delim', value: '~' }]
	},
	{
		selector: '&',
		tokenize: [{ type: 'delim', value: '&' }]
	},
	{
		selector: '|',
		tokenize: [{ type: 'delim', value: '|' }]
	},
	{
		selector: '\x7f',
		tokenize: [{ type: 'delim', value: '\x7f' }]
	},
	{
		selector: '\x01',
		tokenize: [{ type: 'delim', value: '\x01' }]
	},
	{
		selector: '~-',
		tokenize: [
			{ type: 'delim', value: '~' },
			{ type: 'delim', value: '-' }
		]
	},
	{
		selector: '^|',
		tokenize: [
			{ type: 'delim', value: '^' },
			{ type: 'delim', value: '|' }
		]
	},
	{
		selector: '$~',
		tokenize: [
			{ type: 'delim', value: '$' },
			{ type: 'delim', value: '~' }
		]
	},
	{
		selector: '*^',
		tokenize: [
			{ type: 'delim', value: '*' },
			{ type: 'delim', value: '^' }
		]
	},

	// -- WhitespaceTokens
	{
		selector: '   ',
		tokenize: [{ type: 'whitespace' }]
	},
	{
		selector: '\n\rS',
		tokenize: [{ type: 'whitespace' }, { type: 'ident', value: 'S' }]
	},
	{
		selector: '   *',
		tokenize: [{ type: 'whitespace' }, { type: 'delim', value: '*' }]
	},
	{
		selector: '\r\n\f\t2',
		tokenize: [{ type: 'whitespace' }, { type: 'number', value: 2 }]
	},

	// -- Escapes
	{
		selector: 'hel\\6Co',
		tokenize: [{ type: 'ident', value: 'hello' }]
	},
	{
		selector: '\\26 B',
		tokenize: [{ type: 'ident', value: '&B' }]
	},
	{
		selector: "'hel\\6c o'",
		tokenize: [{ type: 'string', value: 'hello' }]
	},
	{
		selector: "'spac\\65\r\ns'",
		tokenize: [{ type: 'string', value: 'spaces' }]
	},
	{
		selector: 'spac\\65\r\ns',
		tokenize: [{ type: 'ident', value: 'spaces' }]
	},
	{
		selector: 'spac\\65\n\rs',
		tokenize: [
			{ type: 'ident', value: 'space' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 's' }
		]
	},
	{
		selector: 'sp\\61\tc\\65\fs',
		tokenize: [{ type: 'ident', value: 'spaces' }]
	},
	{
		selector: 'hel\\6c  o',
		tokenize: [
			{ type: 'ident', value: 'hell' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'o' }
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
		tokenize: [{ type: 'ident', value: 'test\uD799' }]
	},
	{
		selector: '\\E000',
		tokenize: [{ type: 'ident', value: '\uE000' }]
	},
	{
		selector: 'te\\s\\t',
		tokenize: [{ type: 'ident', value: 'test' }]
	},
	{
		selector: 'spaces\\ in\\\tident',
		tokenize: [{ type: 'ident', value: 'spaces in\tident' }]
	},
	{
		selector: '\\.\\,\\:\\!',
		tokenize: [{ type: 'ident', value: '.,:!' }]
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
		tokenize: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		selector: 'null\\\0\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD\uFFFD' }]
	},
	{
		selector: 'null\\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		selector: 'null\\0',
		tokenize: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		selector: 'null\\0000',
		tokenize: [{ type: 'ident', value: 'null\uFFFD' }]
	},
	{
		selector: 'large\\110000',
		tokenize: [{ type: 'ident', value: 'large\uFFFD' }]
	},
	{
		selector: 'large\\23456a',
		tokenize: [{ type: 'ident', value: 'large\uFFFD' }]
	},
	{
		selector: 'surrogate\\D800',
		tokenize: [{ type: 'ident', value: 'surrogate\uFFFD' }]
	},
	{
		selector: 'surrogate\\0DABC',
		tokenize: [{ type: 'ident', value: 'surrogate\uFFFD' }]
	},
	{
		selector: '\\00DFFFsurrogate',
		tokenize: [{ type: 'ident', value: '\uFFFDsurrogate' }]
	},
	{
		selector: '\\10fFfF',
		tokenize: [{ type: 'ident', value: '\u{10ffff}' }]
	},
	{
		selector: '\\10fFfF0',
		tokenize: [{ type: 'ident', value: '\u{10ffff}0' }]
	},
	{
		selector: '\\10000000',
		tokenize: [{ type: 'ident', value: '\u{100000}00' }]
	},
	// {
	// 	selector: 'eof\\',
	// 	skip: true,
	// 	tokenize: [{ type: 'ident', value: 'eof\uFFFD' }]
	// },

	// -- identToken
	{
		selector: 'simple-ident',
		tokenize: [{ type: 'ident', value: 'simple-ident' }]
	},
	{
		selector: 'testing123',
		tokenize: [{ type: 'ident', value: 'testing123' }]
	},
	{
		selector: 'hello!',
		tokenize: [
			{ type: 'ident', value: 'hello' },
			{ type: 'delim', value: '!' }
		]
	},
	{
		selector: 'world\x05',
		tokenize: [
			{ type: 'ident', value: 'world' },
			{ type: 'delim', value: '\x05' }
		]
	},
	{
		selector: '_under score',
		tokenize: [
			{ type: 'ident', value: '_under' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'score' }
		]
	},
	{
		selector: '-_underscore',
		tokenize: [{ type: 'ident', value: '-_underscore' }]
	},
	{
		selector: '-text',
		tokenize: [{ type: 'ident', value: '-text' }]
	},
	{
		selector: '-\\6d',
		tokenize: [{ type: 'ident', value: '-m' }]
	},
	{
		selector: '--abc',
		tokenize: [{ type: 'ident', value: '--abc' }]
	},
	{
		selector: '--',
		tokenize: [{ type: 'ident', value: '--' }]
	},
	{
		selector: '--11',
		tokenize: [{ type: 'ident', value: '--11' }]
	},
	{
		selector: '---',
		tokenize: [{ type: 'ident', value: '---' }]
	},
	{
		selector: '\u2003', // em-space
		tokenize: [{ type: 'delim', value: '\u2003' }]
	},
	{
		selector: '\u{A0}', // non-breaking space
		tokenize: [{ type: 'delim', value: '\u{A0}' }]
	},
	{
		selector: '\u1234',
		tokenize: [{ type: 'ident', value: '\u1234' }]
	},
	{
		selector: '\u{12345}',
		tokenize: [{ type: 'ident', value: '\u{12345}' }]
	},
	{
		selector: '\0',
		tokenize: [{ type: 'ident', value: '\uFFFD' }]
	},
	{
		selector: 'ab\0c',
		tokenize: [{ type: 'ident', value: 'ab\uFFFDc' }]
	},
	{
		selector: 'ab\0c',
		tokenize: [{ type: 'ident', value: 'ab\uFFFDc' }]
	},

	// -- FunctionToken
	{
		selector: 'scale(2)',
		tokenize: [
			{ type: 'function', value: 'scale' },
			{ type: 'number', value: 2 },
			{ type: ')' }
		]
	},
	{
		selector: 'foo-bar\\ baz(',
		tokenize: [{ type: 'function', value: 'foo-bar baz' }]
	},
	{
		selector: 'fun\\(ction(',
		tokenize: [{ type: 'function', value: 'fun(ction' }]
	},
	{
		selector: '-foo(',
		tokenize: [{ type: 'function', value: '-foo' }]
	},
	{
		selector: 'url("foo.gif"',
		tokenize: [
			{ type: 'function', value: 'url' },
			{ type: 'string', value: 'foo.gif' }
		]
	},
	{
		selector: "foo(  'bar.gif'",
		tokenize: [
			{ type: 'function', value: 'foo' },
			{ type: 'whitespace' },
			{ type: 'string', value: 'bar.gif' }
		]
	},
	{
		selector: "url(  'bar.gif'",
		tokenize: [
			{ type: 'function', value: 'url' },
			{ type: 'whitespace' },
			{ type: 'string', value: 'bar.gif' }
		]
	},

	// -- AtKeywordToken
	{
		selector: '@at-keyword',
		tokenize: [{ type: 'at-keyword', value: 'at-keyword' }]
	},
	{
		selector: '@testing123',
		tokenize: [{ type: 'at-keyword', value: 'testing123' }]
	},
	{
		selector: '@hello!',
		tokenize: [
			{ type: 'at-keyword', value: 'hello' },
			{ type: 'delim', value: '!' }
		]
	},
	{
		selector: '@-text',
		tokenize: [{ type: 'at-keyword', value: '-text' }]
	},
	{
		selector: '@--abc',
		tokenize: [{ type: 'at-keyword', value: '--abc' }]
	},
	{
		selector: '@--',
		tokenize: [{ type: 'at-keyword', value: '--' }]
	},
	{
		selector: '@--11',
		tokenize: [{ type: 'at-keyword', value: '--11' }]
	},
	{
		selector: '@---',
		tokenize: [{ type: 'at-keyword', value: '---' }]
	},
	{
		selector: '@\\ ',
		tokenize: [{ type: 'at-keyword', value: ' ' }]
	},
	{
		selector: '@-\\ ',
		tokenize: [{ type: 'at-keyword', value: '- ' }]
	},
	{
		selector: '@@',
		tokenize: [
			{ type: 'delim', value: '@' },
			{ type: 'delim', value: '@' }
		]
	},
	{
		selector: '@2',
		tokenize: [
			{ type: 'delim', value: '@' },
			{ type: 'number', value: 2 }
		]
	},
	{
		selector: '@-1',
		tokenize: [
			{ type: 'delim', value: '@' },
			{ type: 'number', value: -1, sign: '-' }
		]
	},

	// -- UrlToken
	{
		selector: 'url(foo.gif)',
		tokenize: [{ type: 'url', value: 'foo.gif' }]
	},
	{
		selector: 'urL(https://example.com/cats.png)',
		tokenize: [{ type: 'url', value: 'https://example.com/cats.png' }]
	},
	// {
	// 	skip: true,
	// 	selector: 'uRl(what-a.crazy^URL~this\\ is!)',
	// 	tokenize: [{ type: 'url', value: 'what-a.crazy^URL~this is!' }]
	// },
	{
		selector: 'uRL(123#test)',
		tokenize: [{ type: 'url', value: '123#test' }]
	},
	// {
	// 	skip: true,
	// 	selector: 'Url(escapes\\ \\"\\\'\\)\\()',
	// 	tokenize: [{ type: 'url', value: 'escapes "\')(' }]
	// },
	{
		selector: 'UrL(   whitespace   )',
		tokenize: [{ type: 'url', value: 'whitespace' }]
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
		tokenize: [{ type: 'url', value: 'not/*a*/comment' }]
	},
	{
		selector: 'urL()',
		tokenize: [{ type: 'url', value: '' }]
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
		tokenize: [{ type: 'string', value: 'text' }]
	},
	{
		selector: '"text"',
		tokenize: [{ type: 'string', value: 'text' }]
	},
	{
		selector: "'testing, 123!'",
		tokenize: [{ type: 'string', value: 'testing, 123!' }]
	},
	{
		selector: "'es\\'ca\\\"pe'",
		tokenize: [{ type: 'string', value: 'es\'ca"pe' }]
	},
	{
		selector: '\'"quotes"\'',
		tokenize: [{ type: 'string', value: '"quotes"' }]
	},
	{
		selector: '"\'quotes\'"',
		tokenize: [{ type: 'string', value: "'quotes'" }]
	},
	// {
	// 	skip: true,
	// 	selector: '"mismatch\'',
	// 	tokenize: [{ type: 'string', value: "mismatch'" }]
	// },
	{
		selector: "'text\x05\t\x13'",
		tokenize: [{ type: 'string', value: 'text\x05\t\x13' }]
	},
	// {
	// 	skip: true,
	// 	selector: '"end on eof',
	// 	tokenize: [{ type: 'string', value: 'end on eof' }]
	// },
	{
		selector: "'esca\\\nped'",
		tokenize: [{ type: 'string', value: 'escaped' }]
	},
	{
		selector: '"esc\\\faped"',
		tokenize: [{ type: 'string', value: 'escaped' }]
	},
	{
		selector: "'new\\\rline'",
		tokenize: [{ type: 'string', value: 'newline' }]
	},
	{
		selector: '"new\\\r\nline"',
		tokenize: [{ type: 'string', value: 'newline' }]
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
		tokenize: [{ type: 'string', value: '\uFFFD' }]
	},
	{
		selector: "'hel\0lo'",
		tokenize: [{ type: 'string', value: 'hel\uFFFDlo' }]
	},
	{
		selector: "'h\\65l\0lo'",
		tokenize: [{ type: 'string', value: 'hel\uFFFDlo' }]
	},

	// -- HashToken
	{
		selector: '#id-selector',
		tokenize: [{ type: 'hash', value: 'id-selector', id: true }]
	},
	{
		selector: '#FF7700',
		tokenize: [{ type: 'hash', value: 'FF7700', id: true }]
	},
	{
		selector: '#3377FF',
		tokenize: [{ type: 'hash', value: '3377FF' }]
	},
	{
		selector: '#\\ ',
		tokenize: [{ type: 'hash', value: ' ', id: true }]
	},
	{
		selector: '# ',
		tokenize: [{ type: 'delim', value: '#' }, { type: 'whitespace' }]
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
			{ type: 'delim', value: '#' },
			{ type: 'delim', value: '!' }
		]
	},

	// -- NumberToken
	{
		selector: '10',
		tokenize: [{ type: 'number', value: 10 }]
	},
	{
		selector: '12.0',
		tokenize: [{ type: 'number', value: 12 }]
	},
	{
		selector: '+45.6',
		tokenize: [{ type: 'number', value: 45.6, sign: '+' }]
	},
	{
		selector: '-7',
		tokenize: [{ type: 'number', value: -7, sign: '-' }]
	},
	{
		selector: '010',
		tokenize: [{ type: 'number', value: 10 }]
	},
	{
		selector: '10e0',
		tokenize: [{ type: 'number', value: 10 }]
	},
	{
		selector: '12e3',
		tokenize: [{ type: 'number', value: 12000 }]
	},
	{
		selector: '3e+1',
		tokenize: [{ type: 'number', value: 30 }]
	},
	{
		selector: '12E-1',
		tokenize: [{ type: 'number', value: 1.2 }]
	},
	{
		selector: '.7',
		tokenize: [{ type: 'number', value: 0.7 }]
	},
	{
		selector: '-.3',
		tokenize: [{ type: 'number', value: -0.3, sign: '-' }]
	},
	{
		selector: '+637.54e-2',
		tokenize: [{ type: 'number', value: 6.3754, sign: '+' }]
	},
	{
		selector: '-12.34E+2',
		tokenize: [{ type: 'number', value: -1234, sign: '-' }]
	},
	{
		selector: '+ 5',
		tokenize: [
			{ type: 'delim', value: '+' },
			{ type: 'whitespace' },
			{ type: 'number', value: 5 }
		]
	},
	{
		selector: '-+12',
		tokenize: [
			{ type: 'delim', value: '-' },
			{ type: 'number', value: 12, sign: '+' }
		]
	},
	{
		selector: '+-21',
		tokenize: [
			{ type: 'delim', value: '+' },
			{ type: 'number', value: -21, sign: '-' }
		]
	},
	{
		selector: '++22',
		tokenize: [
			{ type: 'delim', value: '+' },
			{ type: 'number', value: 22, sign: '+' }
		]
	},
	{
		selector: '13.',
		tokenize: [
			{ type: 'number', value: 13 },
			{ type: 'delim', value: '.' }
		]
	},
	{
		selector: '1.e2',
		tokenize: [
			{ type: 'number', value: 1 },
			{ type: 'delim', value: '.' },
			{ type: 'ident', value: 'e2' }
		]
	},
	{
		selector: '2e3.5',
		tokenize: [
			{ type: 'number', value: 2000 },
			{ type: 'number', value: 0.5 }
		]
	},
	{
		selector: '2e3.',
		tokenize: [
			{ type: 'number', value: 2000 },
			{ type: 'delim', value: '.' }
		]
	},
	{
		selector: '1000000000000000000000000',
		tokenize: [{ type: 'number', value: 1e24 }]
	},

	// -- DimensionToken
	{
		selector: '10px',
		tokenize: [{ type: 'dimension', value: 10, unit: 'px' }]
	},
	{
		selector: '12.0em',
		tokenize: [{ type: 'dimension', value: 12, unit: 'em' }]
	},
	{
		selector: '-12.0em',
		tokenize: [{ type: 'dimension', value: -12, unit: 'em', sign: '-' }]
	},
	{
		selector: '+45.6__qem',
		tokenize: [{ type: 'dimension', value: 45.6, unit: '__qem', sign: '+' }]
	},
	{
		selector: '5e',
		tokenize: [{ type: 'dimension', value: 5, unit: 'e' }]
	},
	{
		selector: '5px-2px',
		tokenize: [{ type: 'dimension', value: 5, unit: 'px-2px' }]
	},
	{
		selector: '5e-',
		tokenize: [{ type: 'dimension', value: 5, unit: 'e-' }]
	},
	{
		selector: '5\\ ',
		tokenize: [{ type: 'dimension', value: 5, unit: ' ' }]
	},
	{
		selector: '40\\70\\78',
		tokenize: [{ type: 'dimension', value: 40, unit: 'px' }]
	},
	{
		selector: '4e3e2',
		tokenize: [{ type: 'dimension', value: 4000, unit: 'e2' }]
	},
	{
		selector: '0x10px',
		tokenize: [{ type: 'dimension', value: 0, unit: 'x10px' }]
	},
	{
		selector: '4unit ',
		tokenize: [
			{ type: 'dimension', value: 4, unit: 'unit' },
			{ type: 'whitespace' }
		]
	},
	{
		selector: '5e+',
		tokenize: [
			{ type: 'dimension', value: 5, unit: 'e' },
			{ type: 'delim', value: '+' }
		]
	},
	{
		selector: '2e.5',
		tokenize: [
			{ type: 'dimension', value: 2, unit: 'e' },
			{ type: 'number', value: 0.5 }
		]
	},
	{
		selector: '2e+.5',
		tokenize: [
			{ type: 'dimension', value: 2, unit: 'e' },
			{ type: 'number', value: 0.5, sign: '+' }
		]
	},

	// -- PercentageToken
	{
		selector: '10%',
		tokenize: [{ type: 'percentage', value: 10 }]
	},
	{
		selector: '+12.0%',
		tokenize: [{ type: 'percentage', value: 12, sign: '+' }]
	},
	{
		selector: '-48.99%',
		tokenize: [{ type: 'percentage', value: -48.99, sign: '-' }]
	},
	{
		selector: '6e-1%',
		tokenize: [{ type: 'percentage', value: 0.6 }]
	},
	{
		selector: '5%%',
		tokenize: [
			{ type: 'percentage', value: 5 },
			{ type: 'delim', value: '%' }
		]
	},

	// -- UnicodeRangeToken
	{
		selector: 'u+012345-123456',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 12345, sign: '+' },
			{ type: 'number', value: -123456, sign: '-' }
		]
	},
	{
		selector: 'U+1234-2345',
		tokenize: [
			{ type: 'ident', value: 'U' },
			{ type: 'number', value: 1234, sign: '+' },
			{ type: 'number', value: -2345, sign: '-' }
		]
	},
	{
		selector: 'u+222-111',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 222, sign: '+' },
			{ type: 'number', value: -111, sign: '-' }
		]
	},
	{
		selector: 'U+CafE-d00D',
		tokenize: [
			{ type: 'ident', value: 'U' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'CafE-d00D' }
		]
	},
	{
		selector: 'U+2??',
		tokenize: [
			{ type: 'ident', value: 'U' },
			{ type: 'number', value: 2, sign: '+' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		selector: 'U+ab12??',
		tokenize: [
			{ type: 'ident', value: 'U' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'ab12' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		selector: 'u+??????',
		tokenize: [
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
		selector: 'u+??',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		selector: 'u+222+111',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 222, sign: '+' },
			{ type: 'number', value: 111, sign: '+' }
		]
	},
	{
		selector: 'u+12345678',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 12345678, sign: '+' }
		]
	},
	{
		selector: 'u+123-12345678',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 123, sign: '+' },
			{ type: 'number', value: -12345678, sign: '-' }
		]
	},
	{
		selector: 'u+cake',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'cake' }
		]
	},
	{
		selector: 'u+1234-gggg',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'dimension', value: 1234, unit: '-gggg', sign: '+' }
		]
	},
	{
		selector: 'U+ab12???',
		tokenize: [
			{ type: 'ident', value: 'U' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'ab12' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' }
		]
	},
	{
		selector: 'u+a1?-123',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'a1' },
			{ type: 'delim', value: '?' },
			{ type: 'number', value: -123, sign: '-' }
		]
	},
	{
		selector: 'u+1??4',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'number', value: 1, sign: '+' },
			{ type: 'delim', value: '?' },
			{ type: 'delim', value: '?' },
			{ type: 'number', value: 4 }
		]
	},
	{
		selector: 'u+z',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'ident', value: 'z' }
		]
	},
	{
		selector: 'u+',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' }
		]
	},
	{
		selector: 'u+-543',
		tokenize: [
			{ type: 'ident', value: 'u' },
			{ type: 'delim', value: '+' },
			{ type: 'number', value: -543, sign: '-' }
		]
	},

	// -- CommentToken
	{
		selector: '/*comment*/a',
		tokenize: [{ type: 'ident', value: 'a' }]
	},
	{
		selector: '/**\\2f**//',
		tokenize: [{ type: 'delim', value: '/' }]
	},
	{
		selector: '/**y*a*y**/ ',
		tokenize: [{ type: 'whitespace' }]
	},
	{
		selector: ',/* \n :) \n */)',
		tokenize: [{ type: 'comma' }, { type: ')' }]
	},
	{
		selector: ':/*/*/',
		tokenize: [{ type: 'colon' }]
	},
	{
		selector: '/**/*',
		tokenize: [{ type: 'delim', value: '*' }]
	}
	// {
	// 	skip: true,
	// 	selector: ';/******',
	// 	tokenize: [{ type: 'semicolon' }]
	// }
];
