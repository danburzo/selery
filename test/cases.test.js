/*
	Runs the tokenize/parse/serialize test cases
	described in the `cases` folder.
*/

import test from 'node:test';
import assert from 'node:assert';
import { readdirSync } from 'node:fs';
import { tokenize, parse, serialize } from '../src/index.js';

const files = await Promise.all(
	readdirSync(new URL('./cases', import.meta.url))
		.filter(f => f.match(/\.case\.js$/))
		.map(async filepath => {
			return {
				filepath,
				cases: (await import(`./cases/${filepath}`)).default
			};
		})
);

files.forEach(entry => {
	test(entry.filepath, async t => {
		await Promise.all(entry.cases.map(testcase));
	});
});

async function testcase(c) {
	let sel = c.selector;
	let desc = c.description || sel;
	if (c.tokenize) {
		await test(`tokenize: ${desc}`, t => {
			if (c.skip) {
				t.skip();
			}
			if (c.tokenize instanceof RegExp) {
				assert.throws(() => tokenize(sel), c.tokenize);
			} else {
				assert.doesNotThrow(() => tokenize(sel));
				assert.deepStrictEqual(tokenize(sel), c.tokenize);
			}
		});
	}
	if (c.parse) {
		await test(`parse: ${desc}`, t => {
			if (c.skip) {
				t.skip();
			}
			if (c.parse instanceof RegExp) {
				assert.throws(() => parse(sel), c.parse);
			} else {
				assert.doesNotThrow(() => parse(sel));
				assert.deepStrictEqual(parse(sel), c.parse);
			}
		});
	}
	if (c.serialize !== undefined) {
		await test(`serialize: ${desc}`, t => {
			if (c.skip) {
				t.skip();
			}
			if (c.serialize instanceof RegExp) {
				assert.throws(() => serialize(parse(sel)), c.serialize);
			} else if (c.serialize === true) {
				assert.doesNotThrow(() => serialize(parse(sel)));
				assert.equal(serialize(parse(sel)), sel);
			} else {
				assert.doesNotThrow(() => serialize(parse(sel)));
				assert.equal(serialize(parse(sel)), c.serialize);
			}
		});
	}
}
