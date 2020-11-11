import fg from 'fast-glob';
import tape from 'tape';
import { tokenize, parse, serialize } from '../src/index.js';

tape(
	'Testcases',
	t => {
		fg.sync('./testcases/**/*.case.js', { cwd: __dirname }).forEach(file => {
			let cases = require('./' + file).default;
			(Array.isArray(cases) ? cases : [cases]).forEach(c => {
				let sel = c.selector;
				let desc = c.description || sel;
				if (c.tokenize) {
					if (c.tokenize instanceof RegExp) {
						t.throws(() => tokenize(sel), c.tokenize, 'tokenize: ' + desc);
					} else {
						t.deepEqual(tokenize(sel), c.tokenize, 'tokenize: ' + desc);
					}
				}
				if (c.parse) {
					if (c.parse instanceof RegExp) {
						t.throws(() => parse(sel), c.parse, 'parse: ' + desc);
					} else {
						t.deepEqual(parse(sel), c.parse, 'parse: ' + desc);
					}
				}
				if (c.serialize !== undefined) {
					if (c.serialize instanceof RegExp) {
						t.throws(serialize(parse(sel)), c.serialize, 'serialize: ' + desc);
					} else if (c.serialize === true) {
						t.equals(serialize(parse(sel)), sel, 'serialize: ' + desc);
					} else {
						t.equals(serialize(parse(sel)), c.serialize, 'serialize: ' + desc);
					}
				}
			});
		});
		t.end();
	},
	{
		objectPrintDepth: 10
	}
);
