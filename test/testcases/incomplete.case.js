export default [
	/*
		Constructs left unclosed by end-of-input are valid.
	*/
	{
		selector: ':nth-child(3',
		serialize: ':nth-child(3)'
	},
	{
		selector: 'a:is(b:where(c',
		serialize: 'a:is(b:where(c))'
	},
	{
		selector: '[attr=val',
		serialize: '[attr="val"]'
	},

	/*
		...but not all closed constructs
		TODO: this currently passes (incorrectly)
	 */
	// {
	// 	selector: ':is([attr=val)',
	// 	tokenize: /TODO/
	// }

	/*
		Weird commas
	 */
	{
		selector: ',b',
		parse: /Unexpected token comma/
	},
	{
		selector: 'a,',
		parse: /Unexpected token comma/
	},
	{
		selector: 'a,    ,b',
		parse: /Unexpected token comma/
	}
];
