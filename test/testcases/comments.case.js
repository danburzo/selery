export default [
	{
		selector: '/* A comment */',
		tokenize: [],
		parse: { type: 'SelectorList', selectors: [] },
		serialize: ''
	},
	{
		selector: '/* A comment \\',
		tokenize: /unterminated escape/
	},
	{
		selector: '/* A comment \\*/',
		tokenize: /unterminated comment/
	}
];
