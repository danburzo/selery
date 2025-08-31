import test from 'node:test';
import assert from 'node:assert';

import { testCorpus } from '@rmenke/css-tokenizer-tests';
import { tokenize } from '../src/index.js';

const TOKEN_TYPE_MAP = {
	'at-keyword': 'at-keyword-token',
	'bad-string': 'bad-string-token',
	'bad-url': 'bad-url-token',
	'}': '}-token',
	'{': '{-token',
	']': ']-token',
	'[': '[-token',
	cdc: 'cdc-token',
	cdo: 'cdo-token',
	colon: 'colon-token',
	comma: 'comma-token',
	delim: 'delim-token',
	dimension: 'dimension-token',
	function: 'function-token',
	hash: 'hash-token',
	ident: 'ident-token',
	number: 'number-token',
	')': ')-token',
	'(': '(-token',
	percentage: 'percentage-token',
	semicolon: 'semicolon-token',
	string: 'string-token',
	unicode: 'unicode-token',
	url: 'url-token',
	whitespace: 'whitespace-token'
};

/*
{
	"type": "at-keyword-token",
	"raw": "@foo",
	"startIndex": 0,
	"endIndex": 4,
	"structured": {
		"value": "foo"
	}
}
*/
function adaptActual(tokens, css) {
	return tokens.map(tok => {
		const ret = {
			type: TOKEN_TYPE_MAP[tok.type],
			raw: css.substring(tok.start, tok.end + 1),
			startIndex: tok.start,
			endIndex: tok.end + 1,
			structured: null
		};
		if (tok.value !== null && tok.value !== undefined) {
			ret.structured = {
				value: tok.value
			};
			if (tok.sign) {
				ret.structured.signCharacter = tok.sign;
			}
			if (tok.unit) {
				ret.structured.unit = tok.unit;
			}
		}
		return ret;
	});
}

function adaptExpected(tokens) {
	return tokens.map(tok => {
		delete tok.structured?.type;
		return tok;
	});
}

Object.entries(testCorpus).forEach(entry => {
	const [name, def] = entry;
	test(name, t => {
		assert.deepStrictEqual(
			adaptActual(tokenize(def.css), def.css),
			adaptExpected(def.tokens)
		);
	});
});
