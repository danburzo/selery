export default [
	{
		selector: ':is(a:where(.primary), :not(.secondary)):has(> img):first-child',
		tokenize: [
			{ type: 'colon' },
			{ type: 'function', value: 'is' },
			{ type: 'ident', value: 'a' },
			{ type: 'colon' },
			{ type: 'function', value: 'where' },
			{ type: 'delim', value: '.' },
			{ type: 'ident', value: 'primary' },
			{ type: ')' },
			{ type: 'comma' },
			{ type: 'whitespace' },
			{ type: 'colon' },
			{ type: 'function', value: 'not' },
			{ type: 'delim', value: '.' },
			{ type: 'ident', value: 'secondary' },
			{ type: ')' },
			{ type: ')' },
			{ type: 'colon' },
			{ type: 'function', value: 'has' },
			{ type: 'delim', value: '>' },
			{ type: 'whitespace' },
			{ type: 'ident', value: 'img' },
			{ type: ')' },
			{ type: 'colon' },
			{ type: 'ident', value: 'first-child' }
		],
		parse: {
			type: 'SelectorList',
			selectors: [
				{
					type: 'CompoundSelector',
					selectors: [
						{
							type: 'PseudoClassSelector',
							identifier: 'is',
							argument: {
								type: 'SelectorList',
								selectors: [
									{
										type: 'CompoundSelector',
										selectors: [
											{ type: 'TypeSelector', identifier: 'a' },
											{
												type: 'PseudoClassSelector',
												identifier: 'where',
												argument: {
													type: 'SelectorList',
													selectors: [
														{ type: 'ClassSelector', identifier: 'primary' }
													]
												}
											}
										]
									},
									{
										type: 'PseudoClassSelector',
										identifier: 'not',
										argument: {
											type: 'SelectorList',
											selectors: [
												{ type: 'ClassSelector', identifier: 'secondary' }
											]
										}
									}
								]
							}
						},
						{
							type: 'PseudoClassSelector',
							identifier: 'has',
							argument: {
								type: 'SelectorList',
								selectors: [
									{
										type: 'ComplexSelector',
										relative: true,
										combinator: '>',
										right: { type: 'TypeSelector', identifier: 'img' }
									}
								]
							}
						},
						{ type: 'PseudoClassSelector', identifier: 'first-child' }
					]
				}
			]
		},
		serialize: true
	}
];
