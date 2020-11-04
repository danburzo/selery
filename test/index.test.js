import tape from 'tape';
import { parse } from '../src/index';

tape('parse', t => {
	t.deepEqual(parse('a[href=#]'), {}, 'basic selector');
	t.end();
});
