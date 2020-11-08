import { tokenize } from './tokenize';
import { parse } from './parse';
import { walk } from './walk';

const closest = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let curr = el;
	while (curr && !matches(curr, ast)) {
		curr = curr.parentElement;
	}
	return curr;
};

const matches = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
};

const querySelector = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
};

const querySelectorAll = (el, sel) => {
	const ast = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
};

export {
	tokenize,
	parse,
	walk,
	closest,
	matches,
	querySelector,
	querySelectorAll
};
