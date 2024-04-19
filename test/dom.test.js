/*
	Tests for the DOM selection engine.
*/

import test from 'node:test';
import assert from 'node:assert';
import { doc } from './_util.js';
import { querySelector, querySelectorAll } from '../src/index.js';

test('Combinators', t => {
	let d = doc`
	<article>
		<div>
			<h1>Heading</h1>
			<p>1st para</p>
			<p>2nd para</p>
		</div>
	</article>`;
	assert.equal(querySelector(d, 'article h1 + p').textContent, '1st para');
	assert.equal(querySelectorAll(d, 'article h1 ~ p').length, 2);
	assert.equal(querySelector(d, 'div > p').textContent, '1st para');
	assert.equal(querySelector(d, 'article > p'), null);
});

test('Tree-positional pseudo-classes', t => {
	let d = doc`
		<dl>	
			<dt>1-term</dt>
			<dd>1-def</dd>
			<dt>2-term</dt>
			<dd>2-def</dd>
			<dt>3-term</dt>
			<dd>3-def</dd>
		</dl>
		<p>1st <em>para</em></p>
		<p>2nd para</p>
		<p class='not-empty'>	<strong></strong></p>
	`;

	assert.equal(querySelector(d, 'dl :first-child').textContent, '1-term');
	assert.equal(querySelector(d, 'dl :last-child').textContent, '3-def');
	assert.equal(querySelector(d, 'dd:first-of-type').textContent, '1-def');
	assert.equal(querySelector(d, 'dt:last-of-type').textContent, '3-term');
	assert.equal(querySelector(d, 'body :only-of-type').localName, 'dl');
	assert.equal(querySelector(d, 'body :only-child').textContent, 'para');
	assert.equal(querySelector(d, ':root'), d.documentElement);
	assert.equal(querySelector(d, 'body :empty').localName, 'strong');
});
