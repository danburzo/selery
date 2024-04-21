export default [
	{
		selector: 'A B',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: ' ',
					left: {
						type: 'TypeSelector',
						identifier: 'A'
					},
					right: {
						type: 'TypeSelector',
						identifier: 'B'
					}
				}
			]
		}
	},
	{
		selector: 'A >B',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: '>',
					left: {
						type: 'TypeSelector',
						identifier: 'A'
					},
					right: {
						type: 'TypeSelector',
						identifier: 'B'
					}
				}
			]
		}
	},
	{
		selector: 'A+B',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: '+',
					left: {
						type: 'TypeSelector',
						identifier: 'A'
					},
					right: {
						type: 'TypeSelector',
						identifier: 'B'
					}
				}
			]
		}
	},
	{
		selector: 'A~ B',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: '~',
					left: {
						type: 'TypeSelector',
						identifier: 'A'
					},
					right: {
						type: 'TypeSelector',
						identifier: 'B'
					}
				}
			]
		}
	},
	{
		selector: 'A || B',
		tokenize: [
			{ type: 'ident', value: 'A' },
			{ type: 'whitespace' },
			{ type: 'delim', value: '|' },
			{ type: 'delim', value: '|' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'B' }
		],
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: '||',
					left: {
						type: 'TypeSelector',
						identifier: 'A'
					},
					right: {
						type: 'TypeSelector',
						identifier: 'B'
					}
				}
			]
		}
	},
	{
		selector: 'A | | B',
		tokenize: [
			{ type: 'ident', value: 'A' },
			{ type: 'whitespace' },
			{ type: 'delim', value: '|' },
			{ type: 'whitespace' },
			{ type: 'delim', value: '|' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'B' }
		],
		parse: /Unsupported combinator/
	},
	{
		selector: '/*relative*/ > B',
		tokenize: [
			{ type: 'whitespace' },
			{ type: 'delim', value: '>' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'B' }
		],
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: '>',
					left: null,
					right: {
						type: 'TypeSelector',
						identifier: 'B'
					}
				}
			]
		}
	},
	{
		selector: 'a => b',
		parse: /Unexpected token/
	},
	// issue #22
	{
		selector: 'body>.a',
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'ComplexSelector',
					combinator: '>',
					left: {
						type: 'TypeSelector',
						identifier: 'body'
					},
					right: {
						type: 'ClassSelector',
						identifier: 'a'
					}
				}
			]
		}
	}
];
