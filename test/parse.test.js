import tape from 'tape';
import { parse } from '../src/index';

tape('Basic parsing', t => {
	t.deepEqual(parse('article a[href="#"]'), {
		type: 'SelectorList',
		selectors: [
			{
				type: 'ComplexSelector',
				left: {
					type: 'TypeSelector',
					identifier: 'article'
				},
				right: {
					type: 'CompoundSelector',
					selectors: [
						{
							type: 'TypeSelector',
							identifier: 'a'
						},
						{
							type: 'AttributeSelector',
							identifier: 'href',
							value: '#',
							matcher: '='
						}
					]
				},
				combinator: ' '
			}
		]
	});

	t.end();
});
