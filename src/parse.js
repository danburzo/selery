/*
	Parse a CSS selector list.
*/

import { tokenize, Tokens } from './tokenize.js';

export const NodeTypes = {
	/*
		Simple selectors.
	*/
	TypeSelector: 'TypeSelector',
	IdSelector: 'IdSelector',
	ClassSelector: 'ClassSelector',
	AttributeSelector: 'AttributeSelector',
	PseudoClassSelector: 'PseudoClassSelector',

	/* <pseudo-element-selector> */
	PseudoElementSelector: 'PseudoElementSelector',

	/*
		<compound-selector> is a concatenation of simple selectors,
		with the constraint that the TypeSelector, if any, must come
		first. At most one TypeSelector is allowed.

		When involving pseudo-element, the construct is called a 
		pseudo-compound selector <pseudo-compound-selector>.

		E.g.: main#content.wide
	*/
	CompoundSelector: 'CompoundSelector',

	/*
		<complex-selector> is a sequence of <compound-selector>s
		and <pseudo-compound-selector>s separated by combinators. 
	*/
	ComplexSelector: 'ComplexSelector',

	/*
		SelectorList is a list of comma-separated complex selectors.
		<complex-selector-list> = <complex-selector>#
	*/
	SelectorList: 'SelectorList'
};

export const Syntax = {
	None: 'None',
	SelectorList: 'SelectorList',
	AnPlusB: 'AnPlusB'
};

/* 
	Syntaxes according to which to parse the content of pseudo-classes
*/
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

const IS_VALID = 0b01;
const IS_PREFIX = 0b10;

export const DefaultCombinators = [' ', '>', '+', '~', '||'];
export const DefaultAttrMatchers = ['=', '|=', '~=', '^=', '*=', '$='];

/*
	Parse a CSS selector list.
	Additional syntaxes for pseudo-classes can be passed
	with an `options.syntaxes` object.
*/
export const parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;
	let tok;

	/* Extensions */
	const syntaxes = {
		...Syntaxes,
		...(options.syntaxes || {})
	};
	const combinators = mapCombinators(options.combinators);
	const attrMatchers = options.attrMatchers || DefaultAttrMatchers;

	function isDelim(t, ch) {
		return t?.type === Tokens.Delim && t.value === ch;
	}

	const eoi = () => !tokens.length;
	const next = () => tokens.shift();
	const peek = ch => tokens[ch || 0];

	/*
		Consume a selector list as a comma-separated
		sequence of complex selectors, ingesting any whitespace
		it finds around selectors and commas.
	 */

	function SelectorList() {
		let selectors = [];
		let sel;
		// toggle whether we expect a selector or a comma
		let expect_sel = true;
		while ((tok = next())) {
			WhiteSpace();
			if (expect_sel) {
				sel = ComplexSelector();
				if (sel) {
					selectors.push(sel);
					expect_sel = false;
					WhiteSpace();
					if (!tok) {
						// reached EOF after consuming selector
						continue;
					}
					if (tok.type === Tokens.Comma) {
						expect_sel = true;
						continue;
					}
				}
			}
			if (tok) {
				throw new Error(`Unexpected token: ${tok.type}`);
			}
		}
		// handle trailing comma
		if (expect_sel) {
			throw new Error(`Unexpected end of input`);
		}
		return {
			type: NodeTypes.SelectorList,
			selectors,
			start: selectors[0].start,
			end: selectors[selectors.length - 1].end
		};
	}

	/*
		Consume a complex selector, assuming whitespace 
		before the selector has already been consumed.


	*/
	function ComplexSelector() {
		let node, sel, comb;
		while (tok) {
			sel = CompoundSelector();
			if (sel) {
				if (!node) {
					// first compound selector
					node = {
						type: NodeTypes.ComplexSelector,
						left: sel,
						start: sel.start,
						end: sel.end
					};
				} else if (node.combinator && !node.right) {
					node.right = sel;
					node.end = sel.end;
					node = {
						type: NodeTypes.ComplexSelector,
						left: node,
						start: node.start,
						end: node.end
					};
				} else {
					throw new Error(`Unexpected selector: ${sel.type}`);
				}
			}
			let comb_start = tok?.start;
			comb = Combinator();
			if (comb) {
				if (!node) {
					// Relative selector, eg `> a`.
					node = {
						type: NodeTypes.ComplexSelector,
						left: null,
						start: comb_start
					};
				}
				if (node.combinator) {
					throw new Error(`Extraneous combinator: ${comb}`);
				}
				node.combinator = comb;
			}

			// No more useful matches
			if (!sel && !comb) {
				break;
			}
		}

		if (!node) {
			return undefined;
		}
		if (!node.right) {
			if ((!node.combinator || node.combinator === ' ') && node.left !== null) {
				return node.left;
			}
			throw new Error(`Expected selector after combinator ${node.combinator}`);
		}
		return node;
	}

	/*
		Ingest a compound selector, assuming whitespace 
		before the selector has already been consumed.
		
		It matches, more precisely, a ComplexSelectorUnit,
		but the complex CSS grammar is needed to enforce
		some constraints:

		* at most one type selector is allowed and, if present, must be first.
		* pseudo-element selectors must come after type, ID, class, attr selectors.
		* only pseudo-class selectors are allowed after a single pseudo-element selector.

		<complex-selector-unit> = [ <compound-selector>? <pseudo-compound-selector>* ]!
			<compound-selector> = [ <type-selector>? <subclass-selector>* ]!
				<subclass-selector> = 
					<id-selector> | 
					<class-selector> | 
					<attribute-selector> | 
					<pseudo-class-selector>
			<pseudo-compound-selector> =  <pseudo-element-selector> <pseudo-class-selector>*
	 */
	function CompoundSelector() {
		let selectors = [];
		// Match an optional single type selector, at the beginning.
		let sel = TypeSelector();
		if (sel) {
			selectors.push(sel);
		}

		while (
			(sel =
				IdSelector() ||
				ClassSelector() ||
				AttributeSelector() ||
				PseudoClassSelector())
		) {
			selectors.push(sel);
		}

		// After matching a single pseudo-element, only pseudo-classes are allowed.
		sel = PseudoElementSelector();
		if (sel) {
			selectors.push(sel);
			while ((sel = PseudoClassSelector())) {
				selectors.push(sel);
			}
			if (
				TypeSelector() ||
				ClassSelector() ||
				IdSelector() ||
				AttributeSelector()
			) {
				throw new Error('Selector not allowed after pseudo-element selector.');
			}
		}

		if (!selectors.length) {
			return undefined;
		}
		if (selectors.length > 1) {
			return {
				type: NodeTypes.CompoundSelector,
				selectors,
				start: selectors[0].start,
				end: selectors[selectors.length - 1].end
			};
		}
		return selectors[0];
	}

	/*
		Consume a combinator, ingesting any surrounding whitespace.
		Here we diverge from the <combinator> CSS production 
		by consuming a run of consecutive delimiters into 
		a single combinator to allow extending CSS syntax 
		with multi-character combinators, seg. `=>`. 
	*/
	function Combinator() {
		if (!tok) {
			return undefined;
		}
		let had_preceding_ws = WhiteSpace();
		let comb = '';
		while (
			tok?.type === Tokens.Delim &&
			combinators[comb + tok.value] & (IS_VALID | IS_PREFIX)
		) {
			comb += tok.value;
			tok = next();
		}
		WhiteSpace(); // consume trailing whitespace
		if (!comb) {
			if (!had_preceding_ws) {
				return undefined;
			}
			comb = ' ';
		}
		if (combinators[comb] & IS_VALID) {
			return comb;
		}
		throw new Error(`Unsupported combinator: ${comb}`);
	}

	/*
		Consume all available whitespace
	 */
	function WhiteSpace() {
		let had_ws = false;
		while (tok?.type === Tokens.Whitespace) {
			had_ws = true;
			tok = next();
		}
		return had_ws;
	}

	/*
		Consume a type selector, assuming any 
		preceding whitespace has already been consumed.
	*/
	function TypeSelector() {
		let start = tok?.start;
		let ns = NsPrefix();
		if (tok?.type === Tokens.Ident || isDelim(tok, '*')) {
			let node = {
				type: NodeTypes.TypeSelector,
				identifier: tok.value,
				start,
				end: tok.end
			};
			if (ns !== undefined) {
				node.namespace = ns;
			}
			tok = next();
			return node;
		}
		if (ns) {
			throw new Error('Namespace prefix requires element name');
		}
		return undefined;
	}

	/*
		Consume a namespace prefix, assuming any
		preceding whitespace has already been consumed.
	*/
	function NsPrefix() {
		if (!tok) {
			return undefined;
		}
		if (isDelim(tok, '|')) {
			tok = next();
			return '';
		}
		if (
			(tok?.type === Tokens.Ident || isDelim(tok, '*')) &&
			isDelim(peek(), '|')
		) {
			let ns = tok.value;
			tok = next();
			tok = next();
			return ns;
		}
		return undefined;
	}

	/*
		Consume an ID selector, assuming preceding
		whitespace has already been consumed.
	*/
	function IdSelector() {
		if (tok?.type === Tokens.Hash) {
			let ret = {
				type: NodeTypes.IdSelector,
				identifier: tok.value,
				start: tok.start,
				end: tok.end
			};
			tok = next();
			return ret;
		}
		return undefined;
	}

	/*
		Consume a class selector, assuming preceding
		whitespace has already been consumed.
	*/
	function ClassSelector() {
		if (isDelim(tok, '.') && peek()?.type === Tokens.Ident) {
			let ret = {
				type: NodeTypes.ClassSelector,
				start: tok.start
			};
			tok = next(); // skip dot
			ret.identifier = tok.value;
			ret.end = tok.end;
			tok = next(); // skip class name
			return ret;
		}
		return undefined;
	}

	/*
		Consume an attribute selector, assuming preceding
		whitespace has already been consumed.
		
		'[' <wq-name> ']' |
    	'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'
	 */
	function AttributeSelector() {
		if (tok?.type === Tokens.BracketOpen) {
			let start = tok.start;
			tok = next(); // consume '['
			WhiteSpace();

			let ns = NsPrefix();
			if (tok?.type !== Tokens.Ident) {
				throw new Error('Invalid attribute name');
			}
			let node = {
				type: NodeTypes.AttributeSelector,
				identifier: tok.value,
				start,
				end: tok.end
			};
			if (ns !== undefined) {
				node.namespace = ns;
			}
			tok = next(); // consume attribute name
			WhiteSpace();
			let matcher = AttrMatcher();
			if (matcher) {
				if (attrMatchers.indexOf(matcher) < 0) {
					throw new Error(`Unsupported attribute matcher: ${matcher}`);
				}
				node.matcher = matcher;
				WhiteSpace();
				if (tok?.type === Tokens.String || tok?.type === Tokens.Ident) {
					node.value = tok.value;
					if (tok.type === Tokens.String) {
						node.quotes = true;
					}
					node.end = tok.end;
					tok = next();
				} else {
					throw new Error('Expected attribute value');
				}
				WhiteSpace();
				let modifier_end = tok?.end;
				let mod = AttrModifier();
				if (mod) {
					node.end = modifier_end;
					node.modifier = mod;
				}
				WhiteSpace();
			}
			/*
				Allow unclosed attribute selector
				if we've reached the end of input
			 */
			if (!tok) {
				return node;
			}
			if (tok.type === Tokens.BracketClose) {
				node.end = tok.end;
				tok = next();
				return node;
			}
			throw new Error('Unclosed attribute selector');
		}
		return undefined;
	}

	/*
		Consumes an attribute matcher, assuming preceding 
		whitespace has already been consumed.
	*/
	function AttrMatcher() {
		if (isDelim(tok, '=')) {
			let ret = tok.value;
			tok = next();
			return ret;
		}
		if (tok?.type === Tokens.Delim && isDelim(peek(), '=')) {
			let ret = tok.value;
			tok = next();
			ret += tok.value;
			tok = next();
			return ret;
		}
		return undefined;
	}

	/*
		Consume an attribute modifier, assuming preceding
		whitespace has already been consumed.
	*/
	function AttrModifier() {
		if (tok?.type === Tokens.Ident && /[iIsS]/.test(tok.value || '')) {
			let ret = tok.value.toLowerCase();
			tok = next();
			return ret;
		}
		return undefined;
	}

	/*
		Consume a pseudo-element selector, assuming
		preceding whitespace has already been consumed.
	*/
	function PseudoElementSelector() {
		if (tok?.type === Tokens.Colon && peek()?.type === Tokens.Colon) {
			let pseudo_element_start = tok.start;
			tok = next(); // consume first colon
			let node = PseudoClassSelector(true);
			if (node) {
				node.start = pseudo_element_start;
				node.type = NodeTypes.PseudoElementSelector;
				return node;
			}
		}
		return undefined;
	}

	function PseudoClassSelector(is_actually_pseudo_elem = false) {
		if (tok?.type === Tokens.Colon) {
			if (peek()?.type === Tokens.Ident || peek()?.type === Tokens.Function) {
				let node = {
					type: NodeTypes.PseudoClassSelector,
					start: tok.start
				};
				tok = next();
				node.identifier = tok.value;
				if (tok.type === Tokens.Function) {
					node.argument = [];
					let fn_depth = 1;
					while (!eoi() && fn_depth) {
						tok = next();
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
						syntaxes[(is_actually_pseudo_elem ? '::' : ':') + node.identifier];
					if (syntax && syntax !== Syntax.None) {
						node.argument = Argument(node.argument, syntax);
					}

					if (!tok && fn_depth) {
						throw new Error('Parentheses mismatch');
					}
				}
				node.end = tok.end;
				tok = next();
				return node;
			}
		}
	}

	/*
		Consume a pseudo-class argument according to
		the provided syntax.
	*/
	function Argument(tokens, syntax = Syntax.None) {
		if (typeof syntax === 'function') {
			return syntax(tokens);
		}
		switch (syntax) {
			case Syntax.SelectorList:
				// TODO: can we get away with
				// just consuming a SelectorList()
				// on the current token stream?
				return parse(tokens, options);
			case Syntax.AnPlusB:
				// TODO: same as Syntax.SelectorList above
				return AnPlusB(tokens);
			case Syntax.None:
				return tokens;
		}
		throw new Error(`Invalid argument syntax ${syntax}`);
	}

	return SelectorList();
};

// TODO
function AnPlusB(tokens) {
	return tokens;
}

function mapCombinators(combinators) {
	return (combinators || DefaultCombinators).reduce((dict, comb) => {
		dict[comb] = (dict[comb] || 0) | IS_VALID;
		if (comb.length > 1) {
			let comb_chars = Array.from(comb),
				prefix;
			while (comb_chars.pop()) {
				prefix = comb_chars.join('');
				dict[prefix] = (dict[prefix] || 0) | IS_PREFIX;
			}
		}
		return dict;
	}, {});
}
