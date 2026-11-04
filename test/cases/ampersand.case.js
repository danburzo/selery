export default [
	{
		selector: 'foo &.bar',
		parse: {
			end: 8,
			selectors: [
				{
					combinator: ' ',
					end: 8,
					left: {
						end: 2,
						identifier: 'foo',
						start: 0,
						type: 'TypeSelector'
					},
					right: {
						end: 8,
						selectors: [
							{
								end: 4,
								start: 4,
								type: 'NestingSelector'
							},
							{
								end: 8,
								identifier: 'bar',
								start: 5,
								type: 'ClassSelector'
							}
						],
						start: 4,
						type: 'CompoundSelector'
					},
					start: 0,
					type: 'ComplexSelector'
				}
			],
			start: 0,
			type: 'SelectorList'
		}
	},

	{
		selector: 'foo .bar&',
		parse: {
			end: 8,
			selectors: [
				{
					combinator: ' ',
					end: 8,
					left: {
						end: 2,
						identifier: 'foo',
						start: 0,
						type: 'TypeSelector'
					},
					right: {
						end: 8,
						selectors: [
							{
								end: 7,
								identifier: 'bar',
								start: 4,
								type: 'ClassSelector'
							},
							{
								end: 8,
								start: 8,
								type: 'NestingSelector'
							}
						],
						start: 4,
						type: 'CompoundSelector'
					},
					start: 0,
					type: 'ComplexSelector'
				}
			],
			start: 0,
			type: 'SelectorList'
		}
	}
];
