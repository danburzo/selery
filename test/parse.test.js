import tape from 'tape';
import { parse } from '../src/index';

tape('Basic parsing', t => {
	t.deepEqual(parse('article a[href="#"]'), {});

	t.end();
});
