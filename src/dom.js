import { parse, NodeTypes } from './parse';

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
	if (Matchers[node.type]) {
		return Matchers[node.type](el, node);
	}
	throw new Error(`Unsupported node type ${node.type}`);
};

export const querySelector = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let it = (el.ownerDocument || el).createNodeIterator(
		el,
		1,
		n => n !== el && matches(n, node)
	);
	return it.nextNode();
};

export const querySelectorAll = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let it = (el.ownerDocument || el).createNodeIterator(
		el,
		1,
		n => n !== el && matches(n, node)
	);
	let res = [],
		n;
	while ((n = it.nextNode())) res.push(n);
	return res;
};

/*
	Match functions
	---------------
 */

const matchSelectorList = (el, node) =>
	node.selectors.some(s => matches(el, s));

// TODO: handle node.relative = true (missing node.left)
const matchComplexSelector = (el, node) => {
	if (!matches(el, node.right)) {
		return false;
	}
	switch (node.combinator) {
		case ' ':
			return el.parentNode && closest(el.parentNode, node.left);
		case '>':
			return el.parentNode && matches(el.parentNode, node.left);
		case '+':
			return (
				el.previousElementSibling &&
				matches(el.previousElementSibling, node.left)
			);
		case '~': {
			let ref = el;
			while ((ref = ref.previousElementSibling)) {
				if (matches(ref, node.left)) {
					return true;
				}
			}
			return false;
		}
		default:
			throw new Error(`Unsupported combinator ${node.combinator}`);
	}
};

const matchCompoundSelector = (el, node) =>
	node.selectors.every(s => matches(el, s));

const matchIdSelector = (el, node) => el.id === node.identifier;
const matchClassSelector = (el, node) => el.classList.contains(node.identifier);

const matchAttributeSelector = (el, node) => {
	// TODO namespaces
	if (!node.matcher) {
		return el.hasAttribute(node.identifier);
	}
	let haystack = el.getAttribute(node.identifier);
	if (!haystack) {
		return false;
	}
	let needle = node.value;
	if (node.modifier !== 's') {
		haystack = haystack.toLowerCase();
		needle = needle.toLowerCase();
	}
	switch (node.matcher) {
		case '=':
			return haystack === needle;
		case '^=':
			return haystack.length >= needle.length && haystack.indexOf(needle) === 0;
		case '$=':
			return (
				haystack.length >= needle.length &&
				haystack.indexOf(needle) === haystack.length - needle.length
			);
		case '*=':
			return haystack.length >= needle.length && haystack.indexOf(needle) > -1;
		case '~=':
			return haystack.split(/\s+/).some(part => part === needle);
		case '|=':
			return haystack === needle || haystack.indexOf(needle + '-') === 0;
		default:
			throw new Error(`Unsupported attribute matcher ${node.matcher}`);
	}
};

/*
	Matches the element `el` against a `node`
	of type PseudoClassSelector.
 */
const matchPseudoClassSelector = (el, node) => {
	switch (node.identifier) {
		/*
			Logical Combinations

			TODO: make them permissive towards invalid selectors
		 */
		case 'is':
		case 'where':
		case 'matches':
		case '-moz-any':
		case '-webkit-any':
			// TODO is this correct?
			if (!node.argument) {
				return false;
			}
			if (node.argument.type !== NodeTypes.SelectorList) {
				throw new Error('Expected a SelectionList argument');
			}
			return node.argument.selectors.some(s => matches(el, s));
		case 'not':
			// TODO is this correct?
			if (!node.argument) {
				return true;
			}
			if (node.argument.type !== NodeTypes.SelectorList) {
				throw new Error('Expected a SelectionList argument');
			}
			return node.argument.selectors.every(s => !matches(el, s));
		case 'has':
			// TODO is this correct?
			if (!node.argument) {
				return false;
			}
			if (node.argument.type !== NodeTypes.SelectorList) {
				throw new Error('Expected a SelectionList argument');
			}
			// TODO handle :scope
			return !!querySelector(el, node.argument);

		/*
			Tree-Structural pseudo-classes
		 */

		case 'first-child':
			return previous(el) === 0;
		case 'first-of-type':
			return firstOfType(el);
		case 'last-child':
			return next(el) === 0;
		case 'last-of-type':
			return lastOfType(el);
		case 'only-child':
			return !next(el) && !previous(el);
		case 'only-of-type':
			return firstOfType(el) && lastOfType(el);

		case 'root':
			return el === (el.ownerDocument || el).documentElement;

		case 'empty':
			return (
				!el.childNodes.length ||
				(el.childNodes.length === 1 &&
					el.childNodes[0].nodeType === 3 &&
					el.childNodes[0].nodeValue.match(/^\s*$/))
			);

		/*
			Input Pseudo-classes
			See also: https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes
		 */
		case 'enabled':
			return !el.disabled;
		case 'disabled':
			return el.disabled;
		case 'link':
			return (
				(el.localName === 'a' ||
					el.localName === 'area' ||
					el.localName === 'link') &&
				el.hasAttribute('href')
			);
		case 'visited':
			return false;
		case 'checked':
			return el.checked || el.selected;
		case 'indeterminate':
			return el.indeterminate;

		// TODO
		case 'default':
		case 'defined':
		case 'active':
		case 'hover':
		case 'focus':
		case 'target':
		case 'nth-child':
		case 'nth-of-type':
		case 'nth-last-child':
		case 'nth-last-of-type':
		case 'scope':
		default:
			throw new Error(`Pseudo-class ${node.identifier} not implemented yet`);
	}
};

const matchPseudoElementSelector = () => {
	throw new Error('Pseudo-elements are not supported.');
};

const matchTypeSelector = (el, node) => {
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
};

const previous = el => {
	let count = 0,
		ref = el;
	while ((ref = ref.previousElementSibling)) count++;
	return count;
};

const next = el => {
	let count = 0,
		ref = el;
	while ((ref = ref.nextElementSibling)) count++;
	return count;
};

const firstOfType = el => {
	let ref = el;
	while ((ref = ref.previousElementSibling)) {
		if (ref.localName === el.localName && ref.prefix === el.prefix) {
			return false;
		}
	}
	return true;
};

const lastOfType = el => {
	let ref = el;
	while ((ref = ref.nextElementSibling)) {
		if (ref.localName === el.localName && ref.prefix === el.prefix) {
			return false;
		}
	}
	return true;
};

export const Matchers = {
	[NodeTypes.SelectorList]: matchSelectorList,
	[NodeTypes.ComplexSelector]: matchComplexSelector,
	[NodeTypes.CompoundSelector]: matchCompoundSelector,
	[NodeTypes.TypeSelector]: matchTypeSelector,
	[NodeTypes.IdSelector]: matchIdSelector,
	[NodeTypes.ClassSelector]: matchClassSelector,
	[NodeTypes.AttributeSelector]: matchAttributeSelector,
	[NodeTypes.PseudoClassSelector]: matchPseudoClassSelector,
	[NodeTypes.PseudoElementSelector]: matchPseudoElementSelector
};
