import tape from 'tape';
import { parse } from '../src/index';

let tests = [
	{
		selector: 'div',
		result: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'div'
				}
			]
		}
	},
	{
		selector: 'article a[href="#"]',
		result: {
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
		}
	},
	{
		selector: 'div:is(.primary, #main)',
		result: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'CompoundSelector',
					selectors: [
						{
							type: 'TypeSelector',
							identifier: 'div'
						},
						{
							type: 'PseudoClassSelector',
							identifier: 'is',
							argument: {
								type: 'SelectorList',
								selectors: [
									{
										type: 'ClassSelector',
										identifier: 'primary'
									},
									{
										type: 'IdSelector',
										identifier: 'main'
									}
								]
							}
						}
					]
				}
			]
		}
	}
];

tape('Parsing', t => {
	tests.forEach((it, idx) => {
		if (idx === 2) {
			console.log(parse(it.selector).selectors[0].selectors[1].argument);
		}
		t.deepEqual(parse(it.selector), it.result, it.description || it.selector);
	});
	t.end();
});
