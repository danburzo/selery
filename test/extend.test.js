import test from 'node:test';
import assert from 'node:assert';
import { parse } from '../src/index.js';

/*
	Test extending the syntaxes and combinators.
*/
test('Extend combinators', () => {
	assert.deepStrictEqual(parse('a => b', { combinators: ['=>'] }), {
		type: 'SelectorList',
		start: 0,
		end: 5,
		selectors: [
			{
				type: 'ComplexSelector',
				start: 0,
				end: 5,
				combinator: '=>',
				left: {
					type: 'TypeSelector',
					identifier: 'a',
					start: 0,
					end: 0
				},
				right: {
					type: 'TypeSelector',
					identifier: 'b',
					start: 5,
					end: 5
				}
			}
		]
	});
});
