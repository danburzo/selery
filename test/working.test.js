import test from 'node:test';
import assert from 'node:assert';
import { tokenize, parse, serialize } from '../src/index.js';

/*
	A short setup to work on a specific test while developing.
*/
test('Working test', t => {
	// assert.deepStrictEqual(
	// 	tokenize('uRl(white space),'),
	// 	[{ type: 'bad-url' }, { type: 'comma' }]
	// );
});
