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
					argument: [{ type: 'ident', value: 'odd' }]
				},
				{
					type: 'PseudoClassSelector',
					identifier: 'nth-child',
					argument: [{ type: 'ident', value: 'even' }]
				}
			]
		}
	},
	{
		selector: ':nth-last-of-type(2n+3)',
		serialize: true,
		skip: true,
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'PseudoClassSelector',
					identifier: 'nth-last-of-type',
					argument: [
						{ type: 'dimension', value: 2, unit: 'n' },
						{ type: 'number', value: 3 }
					]
				}
			]
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
						{ type: 'number', value: 2 },
						{ type: 'whitespace' },
						{ type: 'ident', value: 'of' },
						{ type: 'whitespace' },
						{ type: 'colon' },
						{ type: 'function', value: 'is' },
						{ type: 'ident', value: 'wow' },
						{ type: ')' }
					]
				}
			]
		}
	}
];
