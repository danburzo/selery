import { parse, NodeTypes } from './parse';
import { serializeToken } from './serialize';

export const closest = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let curr = el;
	while (curr && !matches(curr, node)) {
		curr = curr.parentElement;
	}
	return curr;
};

export const matches = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	if (node.type === NodeTypes.SelectorList) {
		return node.selectors.some(s => matches(el, s));
	}
	if (node.type === NodeTypes.ComplexSelector) {
		let is_match = matches(el, node.right);
		if (!is_match) {
			return false;
		}
		let ancestor = closest(el, node.left);
		return ancestor && ancestor !== el;
	}
	if (node.type === NodeTypes.CompoundSelector) {
		return node.selectors.every(s => matches(el, s));
	}
	if (node.type === NodeTypes.TypeSelector) {
		if (node.identifier !== '*' && el.localName !== node.identifier) {
			return false;
		}
		if (node.namespace === undefined || node.namespace === '*') {
			return true;
		}
		if (node.namespace === '' && el.prefix === null) {
			return true;
		}
		return el.prefix === node.namespace;
	}

	if (node.type === NodeTypes.IdSelector) {
		return el.id === node.identifier;
	}

	if (node.type === NodeTypes.ClassSelector) {
		return el.classList.has(node.identifier);
	}

	if (node.type === NodeTypes.AttributeSelector) {
		// TODO namespaces
		let haystack = el.getAttribute(node.identifier);
		if (!node.matcher) {
			// TODO: should this be !!haystack instead?
			return haystack !== undefined;
		}
		let needle = node.value;
		if (node.modifier !== 's') {
			// TODO: are there cases where 'i' is *not* the default?
			haystack = haystack.toLowerCase();
			needle = needle.toLowerCase();
		}
		switch (node.matcher) {
			case '=':
				return haystack === needle;
			case '^=':
				return (
					haystack.length >= needle.length && haystack.indexOf(needle) === 0
				);
			case '$=':
				return (
					haystack.length >= needle.length &&
					haystack.indexOf(needle) === haystack.length - needle.length
				);
			case '*=':
				return (
					haystack.length >= needle.length && haystack.indexOf(needle) > -1
				);
			case '~=':
				return haystack.split(/\s+/).some(part => part === needle);
			case '|=':
				return haystack === needle || haystack.indexOf(needle + '-') === 0;
			default:
				throw new Error(`Unsupported attribute matcher ${node.matcher}`);
		}
	}

	if (node.type === NodeTypes.PseudoClassSelector) {
		let ref;
		switch (node.identifier) {
			/*
				Logical Combinations
			 */
			case 'is':
			case 'where':
			case 'matches':
			case '-moz-any':
			case '-webkit-any':
				break;
			case 'not':
				break;
			case 'has':
				break;

			/*
				Tree-Structural pseudo-classes
			 */

			case 'first-child':
				return el.previousElementSibling === null;
			case 'first-of-type':
				return firstOfType(el);
			case 'last-child':
				return el.nextElementSibling === null;
			case 'last-of-type':
				return lastOfType(el);
			case 'nth-child':
				break;
			case 'nth-of-type':
				break;
			case 'nth-last-child':
				break;
			case 'nth-of-type':
				break;
			case 'only-child':
				return !el.previousElementSibling && !el.nextElementSibling;
			case 'only-of-type':
				return firstOfType(el) && lastOfType(el);
				break;
			case 'nth-col':
				break;
			case 'nth-last-col':
				break;
			case ':root':
				break;
			case ':host':
				break;
			case ':scope':
				break;
			case ':empty':
				break;
			default:
				throw new Error(`Unsupported pseudo-class ${node.identifier}`);
		}
	}

	if (node.type === NodeTypes.PseudoElementSelector) {
		throw new Error('Pseudo-elements are not supported in matches()');
	}

	throw new Error(`Unsupported node type ${node.type}`);
};

export const querySelector = (el, sel, doc) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let it = (doc || el.ownerDocument).createNodeIterator(el, 1, node =>
		matches(node, sel)
	);
	return it.nextNode();
};

export const querySelectorAll = (el, sel, doc) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let it = (doc || el.ownerDocument).createNodeIterator(el, 1, node =>
		matches(node, sel)
	);
	let res = [],
		n;
	while ((n = it.nextNode())) res.push(n);
	return res;
};

/*
	Helpers
	-------
 */

const firstOfType = el => {
	while ((ref = el.previousElementSibling)) {
		if (ref.localName === el.localName && ref.prefix === el.prefix) {
			return false;
		}
	}
	return true;
};

const lastOfType = el => {
	while ((ref = el.nextElementSibling)) {
		if (ref.localName === el.localName && ref.prefix === el.prefix) {
			return false;
		}
	}
	return true;
};
