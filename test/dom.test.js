import { JSDOM } from 'jsdom';
import tape from 'tape';
import {
	closest,
	matches,
	querySelectorAll,
	querySelector
} from '../src/index';

const mount = win => {
	win.Element.prototype.closest = function (sel) {
		return closest(this, sel);
	};
	win.Element.prototype.matches = function (sel) {
		return matches(this, sel);
	};

	let qs = function (sel) {
		return querySelector(this, sel, win.document);
	};

	win.Element.prototype.querySelector = qs;
	win.Document.prototype.querySelector = qs;
	win.DocumentFragment.prototype.querySelector = qs;

	let qsa = function (sel) {
		return querySelectorAll(this, sel, win.document);
	};

	win.Element.prototype.querySelectorAll = qsa;
	win.Document.prototype.querySelectorAll = qsa;
	win.DocumentFragment.prototype.querySelectorAll = qsa;
};

tape('Basic dom queries', t => {
	let dom = new JSDOM(
		'<div>Some thing</div> <article><div class="box secondary">Another</div></article>'
	);
	mount(dom.window);
	console.log(dom.window.document.querySelectorAll('div.secondary'));
	t.end();
});
