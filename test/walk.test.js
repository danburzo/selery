import tape from 'tape';
import { walk } from '../src/index.js';

tape('walk', t => {
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

	t.equal(out, 'nth-childisdivprimarysecondary');
	t.end();
});
