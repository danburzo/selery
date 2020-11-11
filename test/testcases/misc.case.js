/*
	Miscellaneous cases migrated from older test files
 */
export default [
	{
		selector: 'div.primary > span',
		tokenize: [
			{ type: 'ident', value: 'div' },
			{ type: 'delim', value: '.' },
			{ type: 'ident', value: 'primary' },
			{ type: 'whitespace' },
			{ type: 'delim', value: '>' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'span' }
		]
	},
	{
		selector: '#hello',
		tokenize: [{ type: 'hash', id: true, value: 'hello' }]
	},
	{
		selector: '#he\\#llo',
		tokenize: [{ type: 'hash', id: true, value: 'he#llo' }]
	},
	{
		selector: '# hello',
		tokenize: [
			{ type: 'delim', value: '#' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'hello' }
		]
	},
	{
		selector: 'a span > article',
		serialize: true
	},
	{
		selector: 'div',
		parse: {
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
		parse: {
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
		parse: {
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
		parse: {
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
		parse: {
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
	},
	{
		selector: '[id^=featured]',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'AttributeSelector',
					identifier: 'id',
					matcher: '^=',
					value: 'featured'
				}
			]
		}
	}
];
