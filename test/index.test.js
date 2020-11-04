import tape from 'tape';
import { parse } from '../src/index';

tape('parse', t => {
	t.deepEqual(parse('a'), {
		type: 'SelectorList',
		selectors: [
			{
				type: 'TypeSelector',
				identifier: 'a'
			}
		]
	});
	t.deepEqual(
		parse("a/* a comment */ b[href='val']"),
		{
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: ' ',
					left: {
						type: 'CompoundSelector',
						selectors: [
							{
								type: 'TypeSelector',
								identifier: 'a'
							}
						]
					},
					right: {
						type: 'CompoundSelector',
						selectors: [
							{
								type: 'TypeSelector',
								identifier: 'b'
							},
							{
								type: 'AttributeSelector',
								attribute: 'href',
								matcher: '=',
								value: 'val'
							}
						]
					}
				}
			]
		},
		'basic'
	);
	t.end();
});
