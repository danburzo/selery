import { JSDOM } from 'jsdom';
import tape from 'tape';
import {
	closest,
	matches,
	querySelectorAll,
	querySelector
} from '../src/index';

const doc = function (str) {
	let dom = new JSDOM(str);
	dom.window.Element.prototype.closest = function (sel) {
		return closest(this, sel);
	};
	dom.window.Element.prototype.matches = function (sel) {
		return matches(this, sel);
	};

	let qs = function (sel) {
		return querySelector(this, sel);
	};

	dom.window.Element.prototype.querySelector = qs;
	dom.window.Document.prototype.querySelector = qs;
	dom.window.DocumentFragment.prototype.querySelector = qs;

	let qsa = function (sel) {
		return querySelectorAll(this, sel);
	};

	dom.window.Element.prototype.querySelectorAll = qsa;
	dom.window.Document.prototype.querySelectorAll = qsa;
	dom.window.DocumentFragment.prototype.querySelectorAll = qsa;

	return dom.window.document;
};

tape('Basic dom queries', t => {
	let document = doc`
		<div>Some thing</div> 
		<article>
			<div class="box secondary">Another</div>
		</article>
	`;
	t.end();
});
