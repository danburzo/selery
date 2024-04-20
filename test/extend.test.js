import test from 'node:test';
import assert from 'node:assert';
import { parse } from '../src/index.js';

/*
	Test extending the syntaxes and combinators.
*/
test('Extend combinators', () => {
	assert.deepStrictEqual(parse('a => b', { combinators: ['=>'] }), {
		type: 'SelectorList',
		selectors: [
			{
				type: 'ComplexSelector',
				combinator: '=>',
				left: {
					type: 'TypeSelector',
					identifier: 'a'
				},
				right: {
					type: 'TypeSelector',
					identifier: 'b'
				}
			}
		]
	});
});
