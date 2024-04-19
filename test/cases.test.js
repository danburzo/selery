/*
	Runs the tokenize/parse/serialize test cases
	described in the `cases` folder.
*/

import test from 'node:test';
import assert from 'node:assert';
import { readdirSync } from 'node:fs';
import { tokenize, parse, serialize } from '../src/index.js';

readdirSync(new URL('./cases', import.meta.url)).forEach(filepath => {
	if (filepath.match(/\.case\.js$/)) {
		test(filepath, async t => {
			let cases = (await import(`./cases/${filepath}`)).default;
			if (!Array.isArray(cases)) {
				cases = [cases];
			}
			cases.forEach(c => {
				let sel = c.selector;
				let desc = c.description || sel;
				if (c.tokenize) {
					if (c.tokenize instanceof RegExp) {
						assert.throws(() => tokenize(sel), c.tokenize);
					} else {
						assert.deepStrictEqual(tokenize(sel), c.tokenize);
					}
				}
				if (c.parse) {
					if (c.parse instanceof RegExp) {
						assert.throws(() => parse(sel), c.parse);
					} else {
						assert.deepStrictEqual(parse(sel), c.parse);
					}
				}
				if (c.serialize !== undefined) {
					if (c.serialize instanceof RegExp) {
						assert.throws(serialize(parse(sel)), c.serialize);
					} else if (c.serialize === true) {
						assert.equal(serialize(parse(sel)), sel);
					} else {
						assert.equal(serialize(parse(sel)), c.serialize);
					}
				}
			});
		});
	}
});
