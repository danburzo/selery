import { tokenize, Tokens } from './tokenize.js';

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

export const Syntax = {
	None: 'None',
	SelectorList: 'SelectorList',
	AnPlusB: 'AnPlusB'
};

export const Syntaxes = {
	':is': Syntax.SelectorList,
	':matches': Syntax.SelectorList,
	':-moz-any': Syntax.SelectorList,
	':-webkit-any': Syntax.SelectorList,
	':where': Syntax.SelectorList,
	':not': Syntax.SelectorList,
	':has': Syntax.SelectorList,
	':nth-child': Syntax.AnPlusB,
	':nth-last-child': Syntax.AnPlusB,
	':nth-of-type': Syntax.AnPlusB,
	':nth-last-of-type': Syntax.AnPlusB,
	':nth-col': Syntax.AnPlusB,
	':nth-last-col': Syntax.AnPlusB
};

export const parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;

	let tok;

	let microsyntax = {
		...Syntaxes,
		...(options.syntaxes || {})
	};

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
			if (ns !== undefined) {
				node.namespace = ns;
			}
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
				WS();
			}
			/*
				Allow unclosed attribute selector
				if we've reached the end of input
			 */
			if (!tok) {
				return node;
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
			ret += tok.value;
			next();
			return ret;
		}
		return undefined;
	};

	const AttrModifier = () => {
		if (
			tok &&
			tok.type === Tokens.Delim &&
			tok.value &&
			tok.value.match(/i|s/i)
		) {
			let ret = tok.value.toLowerCase();
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
			let node = PseudoClassSelector(true);
			node.type = NodeTypes.PseudoElementSelector;
			return node;
		}
		return undefined;
	};

	const PseudoClassSelector = (is_actually_pseudo_elem = false) => {
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

					let syntax =
						microsyntax[
							(is_actually_pseudo_elem ? '::' : ':') + node.identifier
						];
					if (syntax && syntax !== Syntax.None) {
						node.argument = Argument(node.argument, syntax);
					}

					if (!tok && fn_depth) {
						throw new Error('Parentheses mismatch');
					}
				}
				next();
				return node;
			}
		}
	};

	const Argument = (tokens, syntax = Syntax.None) => {
		if (typeof syntax === 'function') {
			return syntax(tokens);
		}
		switch (syntax) {
			case Syntax.SelectorList:
				return parse(tokens, options);
			case Syntax.AnPlusB:
				return AnPlusB(tokens);
			case Syntax.None:
				return tokens;
		}
		throw new Error(`Invalid argument syntax ${syntax}`);
	};

	// TODO
	const AnPlusB = tokens => tokens;

	/*
		<compound> = [<type>? <subclass>* [<pseudo-el> <pseudo-class>*]*]!
	 */
	const CompoundSelector = () => {
		WS();
		let selectors = [];
		let selector;
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
				if (!node) {
					// Relative selector
					node = {
						type: NodeTypes.ComplexSelector,
						left: null
					};
				}
				node.combinator = cmb;
			}

			// TODO: refactor into something less weird
			if (!cmb && !sel) {
				break;
			}
		}
		if (node && !node.right) {
			if ((!node.combinator || node.combinator === ' ') && node.left !== null) {
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
			throw new Error(`Unexpected token ${tok.type}`);
		}
	}

	return ast;
};
