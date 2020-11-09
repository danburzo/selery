import tape from 'tape';
import { parse } from '../src/index.js';

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
		selector: 'article > p span',
		result: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					left: {
						type: 'ComplexSelector',
						left: {
							type: 'TypeSelector',
							identifier: 'article'
						},
						right: {
							type: 'TypeSelector',
							identifier: 'p'
						},
						combinator: '>'
					},
					right: {
						type: 'TypeSelector',
						identifier: 'span'
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
	},
	{
		selector: ':not(:where(#main))',
		result: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'PseudoClassSelector',
					identifier: 'not',
					argument: {
						type: 'SelectorList',
						selectors: [
							{
								type: 'PseudoClassSelector',
								identifier: 'where',
								argument: {
									type: 'SelectorList',
									selectors: [
										{
											type: 'IdSelector',
											identifier: 'main'
										}
									]
								}
							}
						]
					}
				}
			]
		}
	}
];

tape(
	'Parsing',
	t => {
		tests.forEach(it => {
			t.deepEqual(parse(it.selector), it.result, it.description || it.selector);
		});
		t.end();
	},
	{ objectPrintDepth: 10 }
);
