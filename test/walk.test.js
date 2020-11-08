import tape from 'tape';
import { walk } from '../src/index';

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
			}
		]
	};

	let out = '';
	walk(ast, node => {
		out += node.identifier || '';
	});

	t.equal(out, 'divprimary');
	t.end();
});
