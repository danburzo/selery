import {
	SELECTOR_LIST,
	ATTRIBUTE_SELECTOR,
	ID_SELECTOR,
	CLASS_SELECTOR,
	TYPE_SELECTOR,
	PSEUDO_ELEMENT_SELECTOR,
	PSEUDO_CLASS_SELECTOR,
	COMPLEX_SELECTOR
} from './types';

const IDENT = /[^\x00-\x7F]|[a-zA-Z_]/;
const HASH_IDENT = /[^\x00-\x7F]|[a-zA-Z_0-9\-]/;

const node = (attrs, parent) => {
	Object.defineProperty(attrs, 'parent', {
		enumerable: false,
		value: parent
	});
	return attrs;
};

export const parse = selector => {
	let chars = selector.split('');
	let res = '';

	let $root = node({
		type: SELECTOR_LIST,
		selectors: []
	});

	let $curr = $root;
	let $node;

	const next = () => chars.shift();
	const peek = () => chars[0];
	const eof = () => !chars.length;

	let ch, cur, value;

	while (chars.length) {
		ch = next();

		// Whitespace
		if (ch.match(/\s/)) {
			while (!eof() && peek().match(/\s/)) {
				next();
			}
			/*
				Mark whitespace as descendant combinator,
				unless we've already found a non-whitespace one.
			 */
			if ($curr.type === COMPLEX_SELECTOR && !$curr.combinator) {
				$curr.combinator = ' ';
			}
			continue;
		}

		// Strings: 'single quoted' and "double quoted"
		if (ch === '"' || ch === "'") {
			if ($curr.type !== ATTRIBUTE_SELECTOR) {
				throw new Error('Unexpected string');
			}
			value = '';
			while (!eof() && (cur = next()) !== ch && cur !== '\n') {
				value += cur;
			}
			if (eof()) {
				throw new Error('Unexpected end of input, unterminated string');
			}
			if (cur === '\n') {
				throw new Error('Unexpected newline inside string');
			}
			$curr.value = value;
			continue;
		}

		// Comments: /* */
		if (ch === '/' && peek() === '*') {
			// Consume the '*' char:
			ch = next();
			// Consume everything until '*/'
			while (!eof() && ((ch = next()) !== '*' || peek() !== '/')) {
				// no-op
			}
			if (eof()) {
				throw new Error('Unexpected end of input, unterminated comment');
			}
			// Consume the '/' char:
			ch = next();
			continue;
		}

		if (ch === '[') {
			$node = node(
				{
					type: ATTRIBUTE_SELECTOR
				},
				$curr
			);
			$curr.selectors.push($node);
			$curr = $node;
			continue;
		}

		if (ch === ']') {
			$curr = $curr.parent;
			continue;
		}

		if (
			ch === '=' ||
			((ch === '~' || ch === '|' || ch === '^' || ch === '$' || ch === '*') &&
				peek() === '=')
		) {
			if ($curr.type !== ATTRIBUTE_SELECTOR) {
				throw new Error('Unexpected attribute matcher');
			}
			if (!$curr.identifier) {
				throw new Error('Encountered attribute matcher with empty attribute');
			}
			$curr.matcher = ch === '=' ? ch : ch + next();
			continue;
		}

		if (ch === '|' && peek() === '|') {
			if ($curr.type !== COMPLEX_SELECTOR) {
				throw new Error('Unexpected combinator ||');
			}
			$curr.combinator === '||';
			continue;
		}

		if (ch === '>' || ch === '+' || ch === '~') {
			if ($curr.type !== COMPLEX_SELECTOR) {
				throw new Error(`Unexpected combinator ${ch}`);
			}
			$curr.combinator === ch;
			continue;
		}

		if (ch === '#') {
			$node = node(
				{
					type: ID_SELECTOR
				},
				$curr
			);
			$curr.selectors.push($node);
			$curr = $node;
			continue;
		}

		if (ch === '.') {
			$node = node(
				{
					type: CLASS_SELECTOR
				},
				$curr
			);
			$curr.selectors.push($node);
			$curr = $node;
			continue;
		}

		if (ch === '(') {
			continue;
		}

		if (ch === ')') {
			continue;
		}

		if (ch === ',') {
			$curr = $root;
			continue;
		}

		if (ch === ':') {
			if (peek() === ':') {
				next();
				$node = node(
					{
						type: PSEUDO_ELEMENT_SELECTOR
					},
					$curr
				);
				$curr.selectors.push($node);
				$curr = $node;
			} else {
				$node = node(
					{
						type: PSEUDO_CLASS_SELECTOR,
						selectors: []
					},
					$curr
				);
				$curr.selectors.push($node);
				$curr = $node;
			}
			continue;
		}

		if (ch === '*') {
			if (
				$curr.type === SELECTOR_LIST ||
				$curr.type === PSEUDO_CLASS_SELECTOR ||
				$curr.type === COMPLEX_SELECTOR
			) {
				continue;
			}
			throw new Error('Unexpected universal selector');
		}

		if (ch === '|') {
			continue;
		}

		/* 
			TODO: not sure this captures the entire 
			railroad diagram for <ident-token> 
			in the [css-syntax-3] spec.
		*/
		if (ch.match(HASH_IDENT)) {
			if ($curr.type === ID_SELECTOR || ch === '-' || ch.match(IDENT)) {
				value = ch;
				while (!eof() && peek().match(HASH_IDENT)) {
					value += next();
				}
				if (
					$curr.type === SELECTOR_LIST ||
					$curr.type === PSEUDO_CLASS_SELECTOR
				) {
					$node = node(
						{
							type: TYPE_SELECTOR,
							identifier: value
						},
						$curr
					);
					$curr.selectors.push($node);
					$curr = $node;
					continue;
				}
				$curr.identifier = value;
				continue;
			}
			throw new Error(`Unexpected character ${ch}`);
		}
	}
	return $root;
};
