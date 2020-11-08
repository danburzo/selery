import { tokenize, TOKENS } from './tokenize';
import { walk } from './walk';

const RECURSIVE_FNS = [':is', ':where', ':not', '::slotted'];

export const parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;

	const wants_recursive =
		options.recursive === undefined ? true : options.recursive;
	let has_potentially_recursive = false;
	const recursive_fns = new Set(
		Array.isArray(options.recursive)
			? [...RECURSIVE_FNS, ...options.recursive]
			: RECURSIVE_FNS
	);

	let tok;

	const delim = (t, ch) => t && t.type === TOKENS.DELIM && t.value === ch;

	const eoi = () => !tokens.length;
	const next = () => {
		tok = tokens.shift();
	};
	const peek = ch => tokens[ch || 0];

	const WS = () => {
		let ws = false;
		while (tok && tok.type === TOKENS.WHITESPACE) {
			ws = true;
			next();
		}
		return ws;
	};

	const TypeSelector = () => {
		let ns = NsPrefix();
		if (tok && (tok.type === TOKENS.IDENT || delim(tok, '*'))) {
			let node = {
				type: 'TypeSelector',
				identifier: tok.value
			};
			if (ns !== undefined) {
				node.namespace = ns;
			}
			next();
			return node;
		}
		return undefined;
	};

	const NsPrefix = () => {
		if (
			!eoi() &&
			tok &&
			(tok.type === TOKENS.IDENT || delim(tok, '*')) &&
			delim(peek(), '|')
		) {
			let ns = tok.value;
			next();
			next();
			return ns;
		}
		return undefined;
	};

	const SubclassSelector = () => {
		return (
			IdSelector() ||
			ClassSelector() ||
			AttributeSelector() ||
			PseudoClassSelector()
		);
	};

	const IdSelector = () => {
		if (tok && tok.type === TOKENS.HASH) {
			let ret = {
				type: 'IdSelector',
				identifier: tok.value
			};
			next();
			return ret;
		}
		return undefined;
	};

	const ClassSelector = () => {
		if (!eoi() && delim(tok, '.') && peek().type === TOKENS.IDENT) {
			next();
			let ret = {
				type: 'ClassSelector',
				identifier: tok.value
			};
			next();
			return ret;
		}
		return undefined;
	};

	/*
		'[' <wq-name> ']' |
		'[' <wq-name> <attr-matcher> [<string>|<ident>] <attr-modifier>? ']'
	 */
	const AttributeSelector = () => {
		if (tok && tok.type === TOKENS.BRACKET_OPEN) {
			next(); // consume '['
			WS();

			let ns = NsPrefix();
			if (tok.type !== TOKENS.IDENT) {
				throw new Error('Invalid attribute name');
			}
			let node = {
				type: 'AttributeSelector',
				identifier: tok.value
			};
			next(); // consume attribute name
			WS();
			let matcher = AttrMatcher();
			if (matcher) {
				node.matcher = matcher;
				WS();
				if (tok.type === TOKENS.STRING || tok.type === TOKENS.IDENT) {
					node.value = tok.value;
					next();
				} else {
					throw new Error('Expected attribute value');
				}
				WS();
				let mod = AttrModifier();
				if (mod) {
					node.modifier = mod;
				}
			}
			if (tok.type === TOKENS.BRACKET_CLOSE) {
				next();
				return node;
			}
			throw new Error('Unclosed attribute selector');
		}
		return undefined;
	};

	const AttrMatcher = () => {
		if (delim(tok, '=')) {
			let ret = tok.value;
			next();
			return ret;
		}
		if (!eoi() && tok && tok.type === TOKENS.DELIM && delim(peek(), '=')) {
			let ret = tok.value;
			next();
			return ret + tok.value;
		}
		return undefined;
	};

	const AttrModifier = () => {
		if (delim(tok, 'i') || delim(tok, 's')) {
			let ret = tok.value;
			next();
			return ret;
		}
		return undefined;
	};

	const PseudoElementSelector = () => {
		if (
			tok &&
			tok.type === TOKENS.COLON &&
			!eoi() &&
			peek().type === TOKENS.COLON
		) {
			next(); // consume first colon
			let node = PseudoClassSelector();
			node.type = 'PseudoElementSelector';
			has_potentially_recursive = true;
			return node;
		}
		return undefined;
	};

	const PseudoClassSelector = () => {
		if (!eoi() && tok && tok.type === TOKENS.COLON) {
			if (peek().type === TOKENS.IDENT || peek().type === TOKENS.FUNCTION) {
				next();
				let node = {
					type: 'PseudoClassSelector',
					identifier: tok.value
				};
				if (tok.type === TOKENS.FUNCTION) {
					node.argument = [];
					let fn_depth = 1;
					while (!eoi() && fn_depth) {
						next();
						if (tok.type === TOKENS.PAREN_CLOSE) {
							fn_depth -= 1;
						} else if (
							tok.type === TOKENS.FUNCTION ||
							tok.type === TOKENS.PAREN_OPEN
						) {
							fn_depth += 1;
						}
						if (fn_depth > 0) {
							node.argument.push(tok);
						}
					}
					if (!tok && fn_depth) {
						throw new Error('Parentheses mismatch');
					}
					next(); // consume ')'
				}
				has_potentially_recursive = true;
				return node;
			}
		}
	};

	/*
		<compound> = [<type>? <subclass>* [<pseudo-el> <pseudo-class>*]*]!
	 */
	const CompoundSelector = () => {
		WS();
		let selectors = [];
		let selector;
		let has_pseudo = false;
		do {
			// TODO enforce order & other restrictions
			selector =
				TypeSelector() ||
				SubclassSelector() ||
				PseudoElementSelector() ||
				PseudoClassSelector();
			if (selector) {
				selectors.push(selector);
			}
		} while (selector);

		if (!selectors.length) {
			return undefined;
		}
		if (selectors.length > 1) {
			return {
				type: 'CompoundSelector',
				selectors
			};
		}
		return selectors[0];
	};

	const Combinator = () => {
		if (!tok) {
			return undefined;
		}
		let combinator = '';
		while (tok.type === TOKENS.DELIM || tok.type === TOKENS.WHITESPACE) {
			if (tok.type === TOKENS.DELIM && combinator !== ' ') {
				combinator += tok.value;
			} else if (tok.type === TOKENS.WHITESPACE && !combinator) {
				combinator = ' ';
			}
			next();
		}
		return combinator;
	};

	const ComplexSelector = () => {
		let node, sel, cmb;
		while (tok) {
			sel = CompoundSelector();
			if (sel) {
				if (!node) {
					node = {
						type: 'ComplexSelector',
						left: sel
					};
				} else if (!node.right) {
					node.right = sel;
					node = {
						type: 'ComplexSelector',
						left: node
					};
				}
			}
			cmb = Combinator();
			if (cmb) {
				node.combinator = cmb;
			}

			// TODO: refactor into something less weird
			if (!cmb && !sel) {
				break;
			}
		}
		if (node && !node.right) {
			if (!node.combinator || node.combinator === ' ') {
				return node.left;
			} else {
				throw new Error(
					`Expected selector after combinator ${node.combinator}`
				);
			}
		}
		return node;
	};

	let ast = {
		type: 'SelectorList',
		selectors: []
	};

	while (!eoi()) {
		next();
		let sel = ComplexSelector();
		if (sel) {
			ast.selectors.push(sel);
		}
		if (tok && tok.type !== TOKENS.COMMA) {
			throw new Error(`Unexpected token ${token.type}`);
		}
	}

	if (wants_recursive && has_potentially_recursive) {
		walk(ast, {
			PseudoClassSelector(node) {
				if (recursive_fns.has(':' + node.identifier)) {
					node.argument = parse(node.argument, options);
				}
			},
			PseudoElementSelector(node) {
				if (recursive_fns.has('::' + node.identifier)) {
					node.argument = parse(node.argument, options);
				}
			}
		});
	}

	return ast;
};
