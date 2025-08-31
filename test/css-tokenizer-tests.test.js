import test from 'node:test';
import assert from 'node:assert';

import { testCorpus } from '@rmenke/css-tokenizer-tests';
import { tokenize } from '../src/index.js';

function adaptActual(tokens) {
	return tokens.map(tok => {
		delete tok.start;
		delete tok.end;
		return tok;
	});
}

function adaptExpected(tokens) {
	return tokens
		.map(tok => {
			const res = {
				type: tok.type.replace(/\-token$/, '').toLowerCase()
				// start: tok.startIndex,
				// end: tok.endIndex - 1
			};
			if (tok.structured) {
				res.value = tok.structured.value ?? undefined;
				if (tok.structured.unit) {
					res.unit = tok.structured.unit;
				}
				if (tok.structured.type) {
					res.valtype = tok.structured.type;
				}
				if (tok.structured.signCharacter) {
					res.sign = tok.structured.signCharacter;
				}
			}
			return res;
		})
		.filter(tok => {
			// Selery does not emit comments
			return tok.type !== 'comment';
		});
}

Object.entries(testCorpus).forEach(entry => {
	const [name, def] = entry;
	test(name, t => {
		assert.deepStrictEqual(
			adaptActual(tokenize(def.css)),
			adaptExpected(def.tokens)
		);
	});
});
