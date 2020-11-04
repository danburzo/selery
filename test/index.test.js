import tape from 'tape';
import { parse } from '../src/index';

tape('parse', t => {
	t.deepEqual(
		parse("a/* a comment */ b[href='val']"),
		[
			{
				type: 'comment',
				value: ' a comment '
			},
			{
				type: 'whitespace'
			},
			{
				type: 'attr-start'
			},
			{
				type: 'attr-matcher',
				value: '='
			},
			{
				type: 'string',
				value: 'val'
			},
			{
				type: 'attr-end'
			}
		],
		'basic'
	);
	t.end();
});
