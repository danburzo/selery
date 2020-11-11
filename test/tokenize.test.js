import tape from 'tape';
import { tokenize } from '../src/index.js';

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
