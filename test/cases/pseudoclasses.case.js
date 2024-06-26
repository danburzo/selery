export default [
	{
		selector: ':is(a:where(.primary), :not(.secondary)):has(> img):first-child',
		tokenize: [
			{ start: 0, end: 0, type: 'colon' },
			{ start: 1, end: 3, type: 'function', value: 'is' },
			{ start: 4, end: 4, type: 'ident', value: 'a' },
			{ start: 5, end: 5, type: 'colon' },
			{ start: 6, end: 11, type: 'function', value: 'where' },
			{ start: 12, end: 12, type: 'delim', value: '.' },
			{ start: 13, end: 19, type: 'ident', value: 'primary' },
			{ start: 20, end: 20, type: ')' },
			{ start: 21, end: 21, type: 'comma' },
			{ start: 22, end: 22, type: 'whitespace' },
			{ start: 23, end: 23, type: 'colon' },
			{ start: 24, end: 27, type: 'function', value: 'not' },
			{ start: 28, end: 28, type: 'delim', value: '.' },
			{ start: 29, end: 37, type: 'ident', value: 'secondary' },
			{ start: 38, end: 38, type: ')' },
			{ start: 39, end: 39, type: ')' },
			{ start: 40, end: 40, type: 'colon' },
			{ start: 41, end: 44, type: 'function', value: 'has' },
			{ start: 45, end: 45, type: 'delim', value: '>' },
			{ start: 46, end: 46, type: 'whitespace' },
			{ start: 47, end: 49, type: 'ident', value: 'img' },
			{ start: 50, end: 50, type: ')' },
			{ start: 51, end: 51, type: 'colon' },
			{ start: 52, end: 62, type: 'ident', value: 'first-child' }
		],
		parse: {
			type: 'SelectorList',
			start: 0,
			end: 62,
			selectors: [
				{
					type: 'CompoundSelector',
					start: 0,
					end: 62,
					selectors: [
						{
							type: 'PseudoClassSelector',
							start: 0,
							end: 39,
							identifier: 'is',
							argument: {
								type: 'SelectorList',
								start: 4,
								end: 38,
								selectors: [
									{
										type: 'CompoundSelector',
										start: 4,
										end: 20,
										selectors: [
											{
												type: 'TypeSelector',
												identifier: 'a',
												start: 4,
												end: 4
											},
											{
												type: 'PseudoClassSelector',
												start: 5,
												end: 20,
												identifier: 'where',
												argument: {
													type: 'SelectorList',
													start: 12,
													end: 19,
													selectors: [
														{
															type: 'ClassSelector',
															identifier: 'primary',
															start: 12,
															end: 19
														}
													]
												}
											}
										]
									},
									{
										type: 'PseudoClassSelector',
										identifier: 'not',
										start: 23,
										end: 38,
										argument: {
											type: 'SelectorList',
											start: 28,
											end: 37,
											selectors: [
												{
													type: 'ClassSelector',
													identifier: 'secondary',
													start: 28,
													end: 37
												}
											]
										}
									}
								]
							}
						},
						{
							type: 'PseudoClassSelector',
							start: 40,
							end: 50,
							identifier: 'has',
							argument: {
								type: 'SelectorList',
								start: 45,
								end: 49,
								selectors: [
									{
										type: 'ComplexSelector',
										start: 45,
										end: 49,
										left: null,
										combinator: '>',
										right: {
											type: 'TypeSelector',
											identifier: 'img',
											start: 47,
											end: 49
										}
									}
								]
							}
						},
						{
							type: 'PseudoClassSelector',
							identifier: 'first-child',
							start: 51,
							end: 62
						}
					]
				}
			]
		},
		serialize: true
	}
];
