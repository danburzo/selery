/*
	Test the tokenization of various number and dimension formats
 */

export default [
	{
		selector: '1 -2 .3 0.4 -2.5e10 1e-5 1e+7',
		tokenize: [
			{ type: 'number', value: 1, start: 0, end: 0, valtype: 'integer' },
			{ type: 'whitespace', start: 1, end: 1 },
			{
				type: 'number',
				value: -2,
				sign: '-',
				start: 2,
				end: 3,
				valtype: 'integer'
			},
			{ type: 'whitespace', start: 4, end: 4 },
			{ type: 'number', value: 0.3, start: 5, end: 6, valtype: 'number' },
			{ type: 'whitespace', start: 7, end: 7 },
			{ type: 'number', value: 0.4, start: 8, end: 10, valtype: 'number' },
			{ type: 'whitespace', start: 11, end: 11 },
			{
				type: 'number',
				value: -2.5e10,
				sign: '-',
				start: 12,
				end: 18,
				valtype: 'number'
			},
			{ type: 'whitespace', start: 19, end: 19 },
			{ type: 'number', value: 1e-5, start: 20, end: 23, valtype: 'number' },
			{ type: 'whitespace', start: 24, end: 24 },
			{ type: 'number', value: 1e7, start: 25, end: 28, valtype: 'number' }
		]
	},
	{
		selector: '1em 2n-3 3n+2',
		tokenize: [
			{
				type: 'dimension',
				value: 1,
				unit: 'em',
				start: 0,
				end: 2,
				valtype: 'integer'
			},
			{ type: 'whitespace', start: 3, end: 3 },
			{
				type: 'dimension',
				value: 2,
				unit: 'n-3',
				start: 4,
				end: 7,
				valtype: 'integer'
			},
			{ type: 'whitespace', start: 8, end: 8 },
			{
				type: 'dimension',
				value: 3,
				unit: 'n',
				start: 9,
				end: 10,
				valtype: 'integer'
			},
			{
				type: 'number',
				value: 2,
				sign: '+',
				start: 11,
				end: 12,
				valtype: 'integer'
			}
		]
	}
];
