export default [
	{
		selector: '"a string"',
		description: 'double quotes',
		tokenize: [{ type: 'string', value: 'a string' }]
	},
	{
		selector: "'another string'",
		description: 'single quotes',
		tokenize: [{ type: 'string', value: 'another string' }]
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
