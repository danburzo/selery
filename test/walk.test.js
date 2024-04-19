/*
	Tests for the AST walker.
*/

import test from 'node:test';
import assert from 'node:assert';
import { walk } from '../src/index.js';

test('walk', t => {
	let ast = {
		type: 'SelectorList',
		selectors: [
			{
				type: 'ComplexSelector',
				combinator: '>',
				left: {
					type: 'IdSelector',
					identifier: 'div'
				},
				right: {
					type: 'ClassSelector',
					identifier: 'primary'
				}
			},
			{
				type: 'PseudoClassSelector',
				identifier: 'nth-child',
				argument: [{}]
			},
			{
				type: 'PseudoClassSelector',
				identifier: 'is',
				argument: {
					type: 'ClassSelector',
					identifier: 'secondary'
				}
			}
		]
	};

	let out = '';
	walk(ast, node => {
		out += node.identifier || '';
	});

	assert.equal(out, 'nth-childisdivprimarysecondary');
});
