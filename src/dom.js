import { parse } from './parse';

export const closest = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let curr = el;
	while (curr && !matches(curr, ast)) {
		curr = curr.parentElement;
	}
	return curr;
};

export const matches = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
};

export const querySelector = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
};

export const querySelectorAll = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
};
