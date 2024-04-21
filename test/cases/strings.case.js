export default [
	{
		selector: '"a string"',
		description: 'double quotes',
		tokenize: [{ type: 'string', value: 'a string', start: 0, end: 9 }]
	},
	{
		selector: "'another string'",
		description: 'single quotes',
		tokenize: [{ type: 'string', value: 'another string', start: 0, end: 15 }]
	},
	{
		selector: '"broken string',
		tokenize: /unterminated string/
	},
	{
		selector: '"broken\nstring"',
		tokenize: /Unexpected newline/
	}
];
