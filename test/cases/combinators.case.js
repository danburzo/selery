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
			{ type: 'ident', value: 'A', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 },
			{ type: 'delim', value: '|', start: 2, end: 2 },
			{ type: 'delim', value: '|', start: 3, end: 3 },
			{ type: 'whitespace', start: 4, end: 4 },
			{ type: 'ident', value: 'B', start: 5, end: 5 }
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
			{ type: 'ident', value: 'A', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 },
			{ type: 'delim', value: '|', start: 2, end: 2 },
			{ type: 'whitespace', start: 3, end: 3 },
			{ type: 'delim', value: '|', start: 4, end: 4 },
			{ type: 'whitespace', start: 5, end: 5 },
			{ type: 'ident', value: 'B', start: 6, end: 6 }
		],
		parse: /Unsupported combinator/
	},
	{
		selector: '/*relative*/ > B',
		tokenize: [
			{ type: 'whitespace', start: 12, end: 12 },
			{ type: 'delim', value: '>', start: 13, end: 13 },
			{ type: 'whitespace', start: 14, end: 14 },
			{ type: 'ident', value: 'B', start: 15, end: 15 }
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
