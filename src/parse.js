import { tokenize, Tokens } from './tokenize';
import { walk } from './walk';

export const RecursiveFunctions = [
	':is',
	':matches',
	':-moz-any',
	':-webkit-any',
	':where',
	':not',
	':has',
	'::slotted'
];

export const AnBFunctions = [
	':nth-child',
	':nth-last-child',
	':nth-of-type',
	':nth-last-of-type',
	':nth-col',
	':nth-last-col'
];

export const NodeTypes = {
	SelectorList: 'SelectorList',
	ComplexSelector: 'ComplexSelector',
	CompoundSelector: 'CompoundSelector',
	TypeSelector: 'TypeSelector',
	IdSelector: 'IdSelector',
	ClassSelector: 'ClassSelector',
	AttributeSelector: 'AttributeSelector',
	PseudoClassSelector: 'PseudoClassSelector',
	PseudoElementSelector: 'PseudoElementSelector'
};

export const parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;

	const wants_recursive =
		options.recursive === undefined ? true : options.recursive;
	let has_potentially_recursive = false;
	const recursive_fns = new Set(
		Array.isArray(options.recursive)
			? [...RecursiveFunctions, ...options.recursive]
			: RecursiveFunctions
	);

	let tok;

	const delim = (t, ch) => t && t.type === Tokens.Delim && t.value === ch;

	const eoi = () => !tokens.length;
	const next = () => {
		tok = tokens.shift();
	};
	const peek = ch => tokens[ch || 0];

	const WS = () => {
		let ws = false;
		while (tok && tok.type === Tokens.Whitespace) {
			ws = true;
			next();
		}
		return ws;
	};

	const TypeSelector = () => {
		let ns = NsPrefix();
		if (tok && (tok.type === Tokens.Ident || delim(tok, '*'))) {
			let node = {
				type: NodeTypes.TypeSelector,
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
			(tok.type === Tokens.Ident || delim(tok, '*')) &&
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
		if (tok && tok.type === Tokens.Hash) {
			let ret = {
				type: NodeTypes.IdSelector,
				identifier: tok.value
			};
			next();
			return ret;
		}
		return undefined;
	};

	const ClassSelector = () => {
		if (!eoi() && delim(tok, '.') && peek().type === Tokens.Ident) {
			next();
			let ret = {
				type: NodeTypes.ClassSelector,
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
		if (tok && tok.type === Tokens.BracketOpen) {
			next(); // consume '['
			WS();

			let ns = NsPrefix();
			if (tok.type !== Tokens.Ident) {
				throw new Error('Invalid attribute name');
			}
			let node = {
				type: NodeTypes.AttributeSelector,
				identifier: tok.value
			};
			next(); // consume attribute name
			WS();
			let matcher = AttrMatcher();
			if (matcher) {
				node.matcher = matcher;
				WS();
				if (tok.type === Tokens.String || tok.type === Tokens.Ident) {
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
			if (tok.type === Tokens.BracketClose) {
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
		if (!eoi() && tok && tok.type === Tokens.Delim && delim(peek(), '=')) {
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
			tok.type === Tokens.Colon &&
			!eoi() &&
			peek().type === Tokens.Colon
		) {
			next(); // consume first colon
			let node = PseudoClassSelector();
			node.type = NodeTypes.PseudoElementSelector;
			has_potentially_recursive = true;
			return node;
		}
		return undefined;
	};

	const PseudoClassSelector = () => {
		if (!eoi() && tok && tok.type === Tokens.Colon) {
			if (peek().type === Tokens.Ident || peek().type === Tokens.Function) {
				next();
				let node = {
					type: NodeTypes.PseudoClassSelector,
					identifier: tok.value
				};
				if (tok.type === Tokens.Function) {
					node.argument = [];
					let fn_depth = 1;
					while (!eoi() && fn_depth) {
						next();
						if (tok.type === Tokens.ParenClose) {
							fn_depth -= 1;
						} else if (
							tok.type === Tokens.Function ||
							tok.type === Tokens.ParenOpen
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
				}
				next();
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
				type: NodeTypes.CompoundSelector,
				selectors
			};
		}
		return selectors[0];
	};

	const Combinator = () => {
		if (!tok) {
			return undefined;
		}
		let combinator = WS() ? ' ' : '';
		if (tok && tok.type === Tokens.Delim) {
			combinator = tok.value;
			next();
			WS(); // consume trailing whitespace
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
						type: NodeTypes.ComplexSelector,
						left: sel
					};
				} else if (!node.right) {
					node.right = sel;
					node = {
						type: NodeTypes.ComplexSelector,
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
		type: NodeTypes.SelectorList,
		selectors: []
	};

	while (!eoi()) {
		next();
		let sel = ComplexSelector();
		if (sel) {
			ast.selectors.push(sel);
		}
		if (tok && tok.type !== Tokens.Comma) {
			throw new Error(`Unexpected token ${token.type}`);
		}
	}

	if (wants_recursive && has_potentially_recursive) {
		walk(ast, {
			PseudoClassSelector(node) {
				if (
					recursive_fns.has(':' + node.identifier) &&
					Array.isArray(node.argument)
				) {
					node.argument = parse(node.argument, options);
				}
			},
			PseudoElementSelector(node) {
				if (
					recursive_fns.has('::' + node.identifier) &&
					Array.isArray(node.argument)
				) {
					node.argument = parse(node.argument, options);
				}
			}
		});
	}

	return ast;
};
