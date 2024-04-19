export default [
	{
		selector: 'a b',
		serialize: true,
		tokenize: [
			{ type: 'ident', value: 'a' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'b' }
		]
	},
	{
		selector: 'a b	c\nd',
		tokenize: [
			{ type: 'ident', value: 'a' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'b' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'c' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'd' }
		],
		serialize: 'a b c d'
	}
];
