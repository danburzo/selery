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
		return querySelector(this, sel);
	};

	win.Element.prototype.querySelector = qs;
	win.Document.prototype.querySelector = qs;
	win.DocumentFragment.prototype.querySelector = qs;

	let qsa = function (sel) {
		return querySelectorAll(this, sel);
	};

	win.Element.prototype.querySelectorAll = qsa;
	win.Document.prototype.querySelectorAll = qsa;
	win.DocumentFragment.prototype.querySelectorAll = qsa;
};

tape('basic', t => {
	let dom = new JSDOM('<div>Some thing</div>');
	mount(dom.window);
	dom.window.document.querySelector('div');
	t.end();
});
