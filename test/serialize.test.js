import tape from 'tape';
import { parse, serialize } from '../src/index.js';

const tests = ['a span > article'];

tape('parse & serialize', t => {
	tests.forEach(item => {
		if (Array.isArray(item)) {
			t.equal(serialize(parse(item[0])), item[1], item[0]);
		} else {
			t.equal(serialize(parse(item)), item, item);
		}
	});
	t.end();
});
