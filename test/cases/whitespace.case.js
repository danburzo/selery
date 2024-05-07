export default [
	{
		selector: 'a b',
		serialize: true,
		tokenize: [
			{ type: 'ident', value: 'a', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 },
			{ type: 'ident', value: 'b', start: 2, end: 2 }
		]
	},
	{
		selector: 'a b	c\nd',
		tokenize: [
			{ type: 'ident', value: 'a', start: 0, end: 0 },
			{ type: 'whitespace', start: 1, end: 1 },
			{ type: 'ident', value: 'b', start: 2, end: 2 },
			{ type: 'whitespace', start: 3, end: 3 },
			{ type: 'ident', value: 'c', start: 4, end: 4 },
			{ type: 'whitespace', start: 5, end: 5 },
			{ type: 'ident', value: 'd', start: 6, end: 6 }
		],
		serialize: 'a b c d'
	}
];
