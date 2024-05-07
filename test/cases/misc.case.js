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
					identifier: 'div',
					start: 0,
					end: 2
				}
			],
			start: 0,
			end: 2
		}
	},
	{
		selector: 'article a[href="#"]',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 18,
			selectors: [
				{
					type: 'ComplexSelector',
					start: 0,
					end: 18,
					left: {
						type: 'TypeSelector',
						identifier: 'article',
						start: 0,
						end: 6
					},
					right: {
						type: 'CompoundSelector',
						start: 8,
						end: 18,
						selectors: [
							{
								type: 'TypeSelector',
								identifier: 'a',
								start: 8,
								end: 8
							},
							{
								type: 'AttributeSelector',
								identifier: 'href',
								value: '#',
								quotes: true,
								matcher: '=',
								start: 9,
								end: 18
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
			start: 0,
			end: 15,
			selectors: [
				{
					type: 'ComplexSelector',
					left: {
						type: 'ComplexSelector',
						left: {
							type: 'TypeSelector',
							identifier: 'article',
							start: 0,
							end: 6
						},
						right: {
							type: 'TypeSelector',
							identifier: 'p',
							start: 10,
							end: 10
						},
						combinator: '>',
						start: 0,
						end: 10
					},
					right: {
						type: 'TypeSelector',
						identifier: 'span',
						start: 12,
						end: 15
					},
					combinator: ' ',
					start: 0,
					end: 15
				}
			]
		}
	},
	{
		selector: 'div:is(.primary, #main)',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 22,
			selectors: [
				{
					type: 'CompoundSelector',
					start: 0,
					end: 22,
					selectors: [
						{
							type: 'TypeSelector',
							identifier: 'div',
							start: 0,
							end: 2
						},
						{
							type: 'PseudoClassSelector',
							start: 3,
							end: 22,
							identifier: 'is',
							argument: {
								type: 'SelectorList',
								selectors: [
									{
										type: 'ClassSelector',
										identifier: 'primary',
										start: 7,
										end: 14
									},
									{
										type: 'IdSelector',
										identifier: 'main',
										start: 17,
										end: 21
									}
								],
								start: 7,
								end: 21
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
			start: 0,
			end: 18,
			selectors: [
				{
					type: 'PseudoClassSelector',
					start: 0,
					end: 18,
					identifier: 'not',
					argument: {
						type: 'SelectorList',
						start: 5,
						end: 17,
						selectors: [
							{
								type: 'PseudoClassSelector',
								start: 5,
								end: 17,
								identifier: 'where',
								argument: {
									type: 'SelectorList',
									start: 12,
									end: 16,
									selectors: [
										{
											type: 'IdSelector',
											identifier: 'main',
											start: 12,
											end: 16
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
			start: 0,
			end: 13,
			selectors: [
				{
					type: 'AttributeSelector',
					identifier: 'id',
					matcher: '^=',
					value: 'featured',
					start: 0,
					end: 13
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
			start: 0,
			end: 7,
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					namespace: 'svg',
					start: 0,
					end: 7
				}
			]
		}
	},

	{
		selector: '*|path',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 5,
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					namespace: '*',
					start: 0,
					end: 5
				}
			]
		}
	},

	{
		selector: '|path',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 4,
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					namespace: '',
					start: 0,
					end: 4
				}
			]
		}
	},

	{
		selector: 'path',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 3,
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'path',
					start: 0,
					end: 3
				}
			]
		}
	},

	{
		selector: '[name=val I]',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 11,
			selectors: [
				{
					type: 'AttributeSelector',
					identifier: 'name',
					matcher: '=',
					value: 'val',
					modifier: 'i',
					start: 0,
					end: 11
				}
			]
		}
	},

	{
		selector: '[name="val"I]',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 12,
			selectors: [
				{
					type: 'AttributeSelector',
					identifier: 'name',
					matcher: '=',
					value: 'val',
					quotes: true,
					modifier: 'i',
					start: 0,
					end: 12
				}
			]
		}
	},
	{
		selector: '::selection',
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 10,
			selectors: [
				{
					type: 'PseudoElementSelector',
					start: 0,
					end: 10,
					identifier: 'selection'
				}
			]
		}
	}
];
