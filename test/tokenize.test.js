import tape from 'tape';
import { tokenize } from '../src/index';

tape('Comments', t => {
	t.deepEqual(tokenize('/* A comment */'), []);

	t.throws(() => {
		tokenize('/* A comment \\');
	}, /unterminated escape/);

	t.throws(() => {
		tokenize('/* A comment \\*/');
	}, /unterminated comment/);
	t.end();
});

tape('Whitespace', t => {
	t.equal(tokenize('a b	c\nd').filter(i => i.type === 'whitespace').length, 3);
	t.end();
});

tape('Strings', t => {
	t.deepEqual(
		tokenize('"a string"'),
		[{ type: 'string', value: 'a string' }],
		'double quotes'
	);

	t.deepEqual(
		tokenize("'another string'"),
		[{ type: 'string', value: 'another string' }],
		'single quotes'
	);

	t.throws(
		() => {
			tokenize('"broken string');
		},
		/unterminated string/,
		'unterminated string'
	);

	t.throws(
		() => {
			tokenize('"broken\nstring"');
		},
		/Unexpected newline/,
		'unexpected newline'
	);
	t.end();
});

tape('ID selectors', t => {
	t.deepEqual(
		tokenize('#hello'),
		[{ type: 'hash', id: true, value: 'hello' }],
		'simple ID selector'
	);

	t.deepEqual(
		tokenize('#he\\#llo'),
		[{ type: 'hash', id: true, value: 'he#llo' }],
		'ID selector with escapes'
	);

	t.deepEqual(
		tokenize('# hello')[0],
		{ type: 'delim', value: '#' },
		'malformed ID selector'
	);
	t.end();
});

tape('Complex selectors', t => {
	t.deepEqual(
		tokenize('div.primary > span'),
		[
			{ type: 'ident', value: 'div' },
			{ type: 'delim', value: '.' },
			{ type: 'ident', value: 'primary' },
			{ type: 'whitespace' },
			{ type: 'delim', value: '>' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'span' }
		],
		'complex selector'
	);
	t.end();
});
