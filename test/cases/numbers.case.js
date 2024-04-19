/*
	Test the tokenization of various number and dimension formats
 */

export default [
	{
		selector: '1 -2 .3 0.4 -2.5e10 1e-5 1e+7',
		tokenize: [
			{ type: 'number', value: '1' },
			{ type: 'whitespace' },
			{ type: 'number', value: '-2' },
			{ type: 'whitespace' },
			{ type: 'number', value: '.3' },
			{ type: 'whitespace' },
			{ type: 'number', value: '0.4' },
			{ type: 'whitespace' },
			{ type: 'number', value: '-2.5e10' },
			{ type: 'whitespace' },
			{ type: 'number', value: '1e-5' },
			{ type: 'whitespace' },
			{ type: 'number', value: '1e+7' }
		]
	},
	{
		selector: '1em 2n-3 3n+2',
		tokenize: [
			{ type: 'dimension', value: '1', unit: 'em' },
			{ type: 'whitespace' },
			{ type: 'dimension', value: '2', unit: 'n-3' },
			{ type: 'whitespace' },
			{ type: 'dimension', value: '3', unit: 'n' },
			{ type: 'number', value: '+2' }
		]
	}
];
