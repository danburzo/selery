export default [
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
		]
	}
];
