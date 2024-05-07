export default [
	{
		selector: '/* A comment */ a',
		tokenize: [
			{
				type: 'whitespace',
				start: 15,
				end: 15
			},
			{
				type: 'ident',
				value: 'a',
				start: 16,
				end: 16
			}
		],
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'TypeSelector',
					identifier: 'a',
					start: 16,
					end: 16
				}
			],
			start: 16,
			end: 16
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
				type: 'whitespace',
				start: 16,
				end: 16
			},
			{
				type: 'ident',
				value: 'a',
				start: 17,
				end: 17
			}
		],
		serialize: 'a'
	}
];
