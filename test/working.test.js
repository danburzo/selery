import test from 'node:test';
import assert from 'node:assert';
import { tokenize, parse, serialize } from '../src/index.js';

/*
	A short setup to work on a specific test while developing.
*/
test('Working test', t => {
	assert.deepStrictEqual(tokenize('@-1'), [
		{ type: 'delim', value: '@' },
		{ type: 'number', value: -1 }
	]);
});
