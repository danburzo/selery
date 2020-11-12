/*
	Constructs left unclosed are valid.
 */
export default [
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
	}
];
