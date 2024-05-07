/*
	Tests for the An+B microsyntax.
 */

export default [
	{
		selector: ':nth-child(odd), :nth-child(even)',
		serialize: true,
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'PseudoClassSelector',
					identifier: 'nth-child',
					argument: [{ type: 'ident', value: 'odd', start: 11, end: 13 }],
					start: 0,
					end: 14
				},
				{
					type: 'PseudoClassSelector',
					identifier: 'nth-child',
					argument: [{ type: 'ident', value: 'even', start: 28, end: 31 }],
					start: 17,
					end: 32
				}
			],
			start: 0,
			end: 32
		}
	},
	{
		selector: ':nth-last-of-type(2n+3)',
		serialize: true,
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'PseudoClassSelector',
					identifier: 'nth-last-of-type',
					argument: [
						{ type: 'dimension', value: 2, unit: 'n', start: 18, end: 19 },
						{ type: 'number', value: 3, sign: '+', start: 20, end: 21 }
					],
					start: 0,
					end: 22
				}
			],
			start: 0,
			end: 22
		}
	},
	{
		selector: ':nth-child(2 of :is(wow))',
		serialize: true,
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'PseudoClassSelector',
					identifier: 'nth-child',
					argument: [
						{ type: 'number', value: 2, start: 11, end: 11 },
						{ type: 'whitespace', start: 12, end: 12 },
						{ type: 'ident', value: 'of', start: 13, end: 14 },
						{ type: 'whitespace', start: 15, end: 15 },
						{ type: 'colon', start: 16, end: 16 },
						{ type: 'function', value: 'is', start: 17, end: 19 },
						{ type: 'ident', value: 'wow', start: 20, end: 22 },
						{ type: ')', start: 23, end: 23 }
					],
					start: 0,
					end: 24
				}
			],
			start: 0,
			end: 24
		}
	}
];
