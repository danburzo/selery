/*
	Miscellaneous cases migrated from older test files
 */
export default [
	{
		selector: 'div.primary > span',
		tokenize: [
			{ type: 'ident', value: 'div', start: 0, end: 2 },
			{ type: 'delim', value: '.', start: 3, end: 3 },
			{ type: 'ident', value: 'primary', start: 4, end: 10 },
			{ type: 'whitespace', start: 11, end: 11 },
			{ type: 'delim', value: '>', start: 12, end: 12 },
			{ type: 'whitespace', start: 13, end: 13 },
			{ type: 'ident', value: 'span', start: 14, end: 17 }
		]
	},
	{
		selector: '#hello',
		tokenize: [{ type: 'hash', id: true, value: 'hello', start: 0, end: 5 }]
	},
	{
		selector: '#he\\#llo',
		tokenize: [{ type: 'hash', id: true, value: 'he#llo', start: 0, end: 7 }]
	},
	{
		selector: '# hello',
		tokenize: [
			{ type: 'delim', value: '#', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 },
			{ type: 'ident', value: 'hello', start: 2, end: 6 }
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
								quotes: true,
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
	},
	// Extraneous combinator, throw
	{
		selector: 'a > > b',
		parse: /Extraneous combinator/
	},

	{
		selector: 'dialog::overlay#id',
		parse: /Selector not allowed/
	},

	{
		selector: 'dialog::overlay[attr=val]',
		parse: /Selector not allowed/
	},

	{
		selector: 'dialog::overlay.className',
		parse: /Selector not allowed/
	},

	{
		selector: 'dialog::overlay|path',
		parse: /Selector not allowed/
	},

	{
		selector: 'svg|path',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					namespace: 'svg'
				}
			]
		}
	},

	{
		selector: '*|path',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					namespace: '*'
				}
			]
		}
	},

	{
		selector: '|path',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					namespace: ''
				}
			]
		}
	},

	{
		selector: 'path',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path'
				}
			]
		}
	},

	{
		selector: '[name=val I]',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'AttributeSelector',
					identifier: 'name',
					matcher: '=',
					value: 'val',
					modifier: 'i'
				}
			]
		}
	},

	{
		selector: '[name="val"I]',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'AttributeSelector',
					identifier: 'name',
					matcher: '=',
					value: 'val',
					quotes: true,
					modifier: 'i'
				}
			]
		}
	}
];
