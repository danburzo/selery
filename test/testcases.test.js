import fg from 'fast-glob';
import tape from 'tape';
import { tokenize, parse, serialize } from '../src/index.js';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

tape(
	'Testcases',
	async t => {
		const files = fg.sync('testcases/**/*.case.js', { cwd: __dirname });
		for await (const file of files) {
			let cases = (await import(`./${file}`)).default;
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
		}
	},
	{
		objectPrintDepth: 100
	}
);
