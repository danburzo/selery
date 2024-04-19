export default [
	{
		selector: '/* A comment */ a',
		tokenize: [
			{
				type: 'whitespace'
			},
			{
				type: 'ident',
				value: 'a'
			}
		],
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'a'
				}
			]
		},
		serialize: 'a'
	},
	{
		selector: '/* A comment \\',
		tokenize: /unterminated comment/
	},
	{
		selector: '/* A comment \\*/ a',
		tokenize: [
			{
				type: 'whitespace'
			},
			{
				type: 'ident',
				value: 'a'
			}
		],
		serialize: 'a'
	}
];
