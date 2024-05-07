var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
	key in obj
		? __defProp(obj, key, {
				enumerable: true,
				configurable: true,
				writable: true,
				value
			})
		: (obj[key] = value);
var __spreadValues = (a, b) => {
	for (var prop in b || (b = {}))
		if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	if (__getOwnPropSymbols)
		for (var prop of __getOwnPropSymbols(b)) {
			if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
		}
	return a;
};

// src/tokenize.js
var NonPrintableCodePoint = /[\x00-\x08\x0B\x0E-\x1F\x7F]/;
var HexDigit = /[0-9a-fA-F]/;
function nonascii(c) {
	return (
		c == 183 ||
		(c >= 192 && c <= 214) ||
		(c >= 216 && c <= 246) ||
		(c >= 248 && c <= 893) ||
		(c >= 895 && c <= 8191) ||
		c == 8204 ||
		c == 8205 ||
		c == 8255 ||
		c == 8256 ||
		(c >= 895 && c <= 8191) ||
		(c >= 8304 && c <= 8591) ||
		(c >= 11264 && c <= 12271) ||
		(c >= 12289 && c <= 55295) ||
		(c >= 63744 && c <= 64975) ||
		(c >= 65008 && c <= 65533) ||
		c > 65536
	);
}
function isIdentStartCodePoint(ch) {
	return ch && (/[a-zA-Z_]/.test(ch) || nonascii(ch.codePointAt(0)));
}
function isIdentCodePoint(ch) {
	return ch && (/[-\w]/.test(ch) || nonascii(ch.codePointAt(0)));
}
var Tokens = {
	AtKeyword: 'at-keyword',
	BadString: 'bad-string',
	BadUrl: 'bad-url',
	BraceClose: '}',
	BraceOpen: '{',
	BracketClose: ']',
	BracketOpen: '[',
	CDC: 'cdc',
	CDO: 'cdo',
	Colon: 'colon',
	Comma: 'comma',
	Delim: 'delim',
	Dimension: 'dimension',
	Function: 'function',
	Hash: 'hash',
	Ident: 'ident',
	Number: 'number',
	ParenClose: ')',
	ParenOpen: '(',
	Percentage: 'percentage',
	Semicolon: 'semicolon',
	String: 'string',
	UnicodeRange: 'unicode',
	Url: 'url',
	Whitespace: 'whitespace'
};
function tokenize(str) {
	let chars = Array.from(str.replace(/\f|\r\n?/g, '\n')).map(char => {
		const c = char.codePointAt(0);
		if (!c || (c >= 55296 && c <= 57343)) {
			return '\uFFFD';
		}
		return char;
	});
	let _i = 0,
		start;
	let tokens = [],
		token;
	let ch, matching_ch;
	function esc() {
		if (_i >= chars.length) {
			throw new Error('Unexpected end of input, unterminated escape sequence');
		} else if (HexDigit.test(chars[_i] || '')) {
			let hex = chars[_i++];
			while (hex.length < 6 && HexDigit.test(chars[_i] || '')) {
				hex += chars[_i++];
			}
			if (is_ws()) {
				_i++;
			}
			let v = parseInt(hex, 16);
			if (v === 0 || (v >= 55296 && v <= 57343) || v > 1114111) {
				return '\uFFFD';
			}
			return String.fromCodePoint(v);
		}
		return chars[_i++];
	}
	const is_esc = (offset = 0) =>
		chars[_i + offset] === '\\' && chars[_i + offset + 1] !== '\n';
	const is_num = () => {
		if (ch === '-' || ch === '+') {
			return (
				/\d/.test(chars[_i] || '') ||
				(chars[_i] === '.' && /\d/.test(chars[_i + 1] || ''))
			);
		}
		if (ch === '.') {
			return /\d/.test(chars[_i] || '');
		}
		return /\d/.test(ch || '');
	};
	function num() {
		let num_token = {
			value: '',
			start
		};
		if (chars[_i] === '+' || chars[_i] === '-') {
			num_token.sign = chars[_i];
			num_token.value += chars[_i++];
		}
		num_token.value += digits();
		if (chars[_i] === '.' && /\d/.test(chars[_i + 1] || '')) {
			num_token.value += chars[_i++] + digits();
		}
		if (chars[_i] === 'e' || chars[_i] === 'E') {
			if (
				(chars[_i + 1] === '+' || chars[_i + 1] === '-') &&
				/\d/.test(chars[_i + 2] || '')
			) {
				num_token.value += chars[_i++] + chars[_i++] + digits();
			} else if (/\d/.test(chars[_i + 1] || '')) {
				num_token.value += chars[_i++] + digits();
			}
		}
		num_token.value = +num_token.value;
		if (is_ident()) {
			num_token.type = Tokens.Dimension;
			num_token.unit = ident();
		} else if (chars[_i] === '%') {
			_i++;
			num_token.type = Tokens.Percentage;
		} else {
			num_token.type = Tokens.Number;
		}
		num_token.end = _i - 1;
		return num_token;
	}
	const digits = () => {
		let v = '';
		while (/\d/.test(chars[_i] || '')) {
			v += chars[_i++];
		}
		return v;
	};
	function is_ident(offset = 0) {
		if (chars[_i + offset] === '-') {
			if (
				isIdentStartCodePoint(chars[_i + offset + 1]) ||
				chars[_i + offset + 1] === '-'
			) {
				return true;
			}
			if (chars[_i + offset + 1] === '\\') {
				return is_esc(offset + 1);
			}
			return false;
		}
		if (isIdentStartCodePoint(chars[_i + offset])) {
			return true;
		}
		if (chars[_i + offset] === '\\') {
			return is_esc(offset);
		}
		return false;
	}
	function ident() {
		let v = '';
		while (_i < chars.length) {
			if (isIdentCodePoint(chars[_i])) {
				v += chars[_i++];
			} else if (is_esc()) {
				_i++;
				v += esc();
			} else {
				return v;
			}
		}
		return v;
	}
	function identlike() {
		let _start = start;
		let v = ident();
		if (v.toLowerCase() === 'url' && chars[_i] === '(') {
			_i++;
			while (is_ws() && is_ws(1)) {
				_i++;
			}
			if (
				chars[_i] === '"' ||
				chars[_i] === "'" ||
				(is_ws() && (chars[_i + 1] === '"' || chars[_i + 1] === "'"))
			) {
				return {
					type: Tokens.Function,
					value: v,
					start: _start,
					end: _i - 1
				};
			} else {
				let curr;
				while (is_ws()) {
					_i++;
				}
				let tok = { type: Tokens.Url, value: '', start: _start };
				while ((curr = chars[_i++])) {
					if (curr === ')') {
						tok.end = _i - 1;
						return tok;
					}
					if (curr === ' ' || curr === '\n' || curr === '	') {
						while (is_ws()) {
							_i++;
						}
						if (chars[_i] === ')') {
							_i++;
							tok.end = _i - 1;
							return tok;
						}
						if (_i === chars.length) {
							throw new Error('Unexpected end of input');
						}
						throw new Error('Bad URL');
					}
					if (
						curr === '"' ||
						curr === "'" ||
						curr === '(' ||
						curr === '' ||
						NonPrintableCodePoint.test(curr || '')
					) {
						throw new Error('Invalid URL');
					}
					if (curr === '\\') {
						if (is_esc()) {
							tok.value += esc();
							continue;
						} else {
							throw new Error('Invalid escape sequence');
						}
					}
					tok.value += curr;
				}
				throw new Error('Unexpected end of input');
			}
		}
		if (chars[_i] === '(') {
			chars[_i++];
			return {
				type: Tokens.Function,
				value: v,
				start: _start,
				end: _i - 1
			};
		}
		return {
			type: Tokens.Ident,
			value: v,
			start: _start,
			end: _i - 1
		};
	}
	function is_ws(offset = 0) {
		return (
			chars[_i + offset] === ' ' ||
			chars[_i + offset] === '\n' ||
			chars[_i + offset] === '	'
		);
	}
	while (_i < chars.length) {
		if (chars[_i] === '/' && chars[_i + 1] === '*') {
			_i += 2;
			while (
				_i < chars.length &&
				!(chars[_i] === '*' && chars[_i + 1] === '/')
			) {
				_i++;
			}
			if (_i === chars.length) {
				throw new Error('Unexpected end of input, unterminated comment');
			}
			_i += 2;
			continue;
		}
		start = _i;
		ch = chars[_i++];
		if (ch === ' ' || ch === '\n' || ch === '	') {
			while (is_ws()) {
				_i++;
			}
			tokens.push({
				type: Tokens.Whitespace,
				start,
				end: _i - 1
			});
			continue;
		}
		if (ch === '"' || ch === "'") {
			matching_ch = ch;
			token = {
				type: Tokens.String,
				start,
				value: ''
			};
			while (
				_i < chars.length &&
				(ch = chars[_i++]) !== matching_ch &&
				ch !== '\n'
			) {
				if (ch === '\\') {
					if (_i === chars.length) {
					} else if (chars[_i] === '\n') {
						_i++;
					} else {
						token.value += esc();
					}
				} else {
					token.value += ch;
				}
			}
			if (ch === matching_ch) {
				token.end = _i - 1;
				tokens.push(token);
				continue;
			}
			if (ch === '\n') {
				throw new Error('Unexpected newline character inside string');
			}
			if (_i >= chars.length) {
				throw new Error(
					`Unexpected end of input, unterminated string ${token.value}`
				);
			}
		}
		if (ch === '#') {
			if (_i < chars.length && (isIdentCodePoint(chars[_i]) || is_esc())) {
				token = {
					type: Tokens.Hash,
					start
				};
				if (is_ident()) {
					token.id = true;
				}
				token.value = ident();
				token.end = _i - 1;
				tokens.push(token);
			} else {
				tokens.push({
					type: Tokens.Delim,
					value: ch,
					start,
					end: start
				});
			}
			continue;
		}
		if (ch === '(') {
			tokens.push({ type: Tokens.ParenOpen, start, end: start });
			continue;
		}
		if (ch === ')') {
			tokens.push({ type: Tokens.ParenClose, start, end: start });
			continue;
		}
		if (ch === '+') {
			if (is_num()) {
				_i--;
				tokens.push(num());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch, start, end: start });
			}
			continue;
		}
		if (ch === ',') {
			tokens.push({ type: Tokens.Comma, start, end: start });
			continue;
		}
		if (ch === '-') {
			if (is_num()) {
				_i--;
				tokens.push(num());
			} else if (chars[_i] === '-' && chars[_i + 1] === '>') {
				_i += 2;
				tokens.push({
					type: Tokens.CDC,
					start,
					end: _i - 1
				});
			} else if (is_ident(-1)) {
				_i--;
				tokens.push(identlike());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch, start, end: start });
			}
			continue;
		}
		if (ch === '.') {
			if (is_num()) {
				_i--;
				tokens.push(num());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch, start, end: start });
			}
			continue;
		}
		if (ch === ':') {
			tokens.push({ type: Tokens.Colon, start, end: start });
			continue;
		}
		if (ch === ';') {
			tokens.push({ type: Tokens.Semicolon, start, end: start });
			continue;
		}
		if (ch === '<') {
			if (chars[_i] === '!' && chars[_i + 1] === '-' && chars[_i + 2] === '-') {
				_i += 3;
				tokens.push({ type: Tokens.CDO, start, end: _i - 1 });
			} else {
				tokens.push({ type: Tokens.Delim, value: ch, start, end: start });
			}
			continue;
		}
		if (ch === '@') {
			if (is_ident()) {
				tokens.push({
					type: Tokens.AtKeyword,
					value: ident(),
					start,
					end: _i - 1
				});
			} else {
				tokens.push({ type: Tokens.Delim, value: ch, start, end: start });
			}
			continue;
		}
		if (ch === '[') {
			tokens.push({ type: Tokens.BracketOpen, start, end: start });
			continue;
		}
		if (ch === '\\') {
			if (is_esc(-1)) {
				_i--;
				tokens.push(identlike());
				continue;
			}
			throw new Error('Invalid escape');
		}
		if (ch === ']') {
			tokens.push({ type: Tokens.BracketClose, start, end: start });
			continue;
		}
		if (ch === '{') {
			tokens.push({ type: Tokens.BraceOpen, start, end: start });
			continue;
		}
		if (ch === '}') {
			tokens.push({ type: Tokens.BraceClose, start, end: start });
			continue;
		}
		if (/\d/.test(ch || '')) {
			_i--;
			tokens.push(num());
			continue;
		}
		if (isIdentStartCodePoint(ch)) {
			_i--;
			tokens.push(identlike());
			continue;
		}
		tokens.push({ type: Tokens.Delim, value: ch, start, end: start });
	}
	return tokens;
}

// src/parse.js
var NodeTypes = {
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
var Syntax = {
	None: 'None',
	SelectorList: 'SelectorList',
	AnPlusB: 'AnPlusB'
};
var Syntaxes = {
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
var IS_VALID = 1;
var IS_PREFIX = 2;
var DefaultCombinators = [' ', '>', '+', '~', '||'];
var DefaultAttrMatchers = ['=', '|=', '~=', '^=', '*=', '$='];
var parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;
	let tok;
	const syntaxes = __spreadValues(
		__spreadValues({}, Syntaxes),
		options.syntaxes || {}
	);
	const combinators = mapCombinators(options.combinators);
	const attrMatchers = options.attrMatchers || DefaultAttrMatchers;
	function isDelim(t, ch) {
		return (t == null ? void 0 : t.type) === Tokens.Delim && t.value === ch;
	}
	const eoi = () => !tokens.length;
	const next2 = () => tokens.shift();
	const peek = ch => tokens[ch || 0];
	function SelectorList() {
		let selectors = [];
		let sel;
		let expect_sel = true;
		while ((tok = next2())) {
			WhiteSpace();
			if (expect_sel) {
				sel = ComplexSelector();
				if (sel) {
					selectors.push(sel);
					expect_sel = false;
					WhiteSpace();
					if (!tok) {
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
	function ComplexSelector() {
		let node, sel, comb;
		while (tok) {
			sel = CompoundSelector();
			if (sel) {
				if (!node) {
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
			let comb_start = tok == null ? void 0 : tok.start;
			comb = Combinator();
			if (comb) {
				if (!node) {
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
			if (!sel && !comb) {
				break;
			}
		}
		if (!node) {
			return void 0;
		}
		if (!node.right) {
			if ((!node.combinator || node.combinator === ' ') && node.left !== null) {
				return node.left;
			}
			throw new Error(`Expected selector after combinator ${node.combinator}`);
		}
		return node;
	}
	function CompoundSelector() {
		let selectors = [];
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
			return void 0;
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
	function Combinator() {
		if (!tok) {
			return void 0;
		}
		let had_preceding_ws = WhiteSpace();
		let comb = '';
		while (
			(tok == null ? void 0 : tok.type) === Tokens.Delim &&
			combinators[comb + tok.value] & (IS_VALID | IS_PREFIX)
		) {
			comb += tok.value;
			tok = next2();
		}
		WhiteSpace();
		if (!comb) {
			if (!had_preceding_ws) {
				return void 0;
			}
			comb = ' ';
		}
		if (combinators[comb] & IS_VALID) {
			return comb;
		}
		throw new Error(`Unsupported combinator: ${comb}`);
	}
	function WhiteSpace() {
		let had_ws = false;
		while ((tok == null ? void 0 : tok.type) === Tokens.Whitespace) {
			had_ws = true;
			tok = next2();
		}
		return had_ws;
	}
	function TypeSelector() {
		let start = tok == null ? void 0 : tok.start;
		let ns = NsPrefix();
		if (
			(tok == null ? void 0 : tok.type) === Tokens.Ident ||
			isDelim(tok, '*')
		) {
			let node = {
				type: NodeTypes.TypeSelector,
				identifier: tok.value,
				start,
				end: tok.end
			};
			if (ns !== void 0) {
				node.namespace = ns;
			}
			tok = next2();
			return node;
		}
		if (ns) {
			throw new Error('Namespace prefix requires element name');
		}
		return void 0;
	}
	function NsPrefix() {
		if (!tok) {
			return void 0;
		}
		if (isDelim(tok, '|')) {
			tok = next2();
			return '';
		}
		if (
			((tok == null ? void 0 : tok.type) === Tokens.Ident ||
				isDelim(tok, '*')) &&
			isDelim(peek(), '|')
		) {
			let ns = tok.value;
			tok = next2();
			tok = next2();
			return ns;
		}
		return void 0;
	}
	function IdSelector() {
		if ((tok == null ? void 0 : tok.type) === Tokens.Hash) {
			let ret = {
				type: NodeTypes.IdSelector,
				identifier: tok.value,
				start: tok.start,
				end: tok.end
			};
			tok = next2();
			return ret;
		}
		return void 0;
	}
	function ClassSelector() {
		var _a;
		if (
			isDelim(tok, '.') &&
			((_a = peek()) == null ? void 0 : _a.type) === Tokens.Ident
		) {
			let ret = {
				type: NodeTypes.ClassSelector,
				start: tok.start
			};
			tok = next2();
			ret.identifier = tok.value;
			ret.end = tok.end;
			tok = next2();
			return ret;
		}
		return void 0;
	}
	function AttributeSelector() {
		if ((tok == null ? void 0 : tok.type) === Tokens.BracketOpen) {
			let start = tok.start;
			tok = next2();
			WhiteSpace();
			let ns = NsPrefix();
			if ((tok == null ? void 0 : tok.type) !== Tokens.Ident) {
				throw new Error('Invalid attribute name');
			}
			let node = {
				type: NodeTypes.AttributeSelector,
				identifier: tok.value,
				start,
				end: tok.end
			};
			if (ns !== void 0) {
				node.namespace = ns;
			}
			tok = next2();
			WhiteSpace();
			let matcher = AttrMatcher();
			if (matcher) {
				if (attrMatchers.indexOf(matcher) < 0) {
					throw new Error(`Unsupported attribute matcher: ${matcher}`);
				}
				node.matcher = matcher;
				WhiteSpace();
				if (
					(tok == null ? void 0 : tok.type) === Tokens.String ||
					(tok == null ? void 0 : tok.type) === Tokens.Ident
				) {
					node.value = tok.value;
					if (tok.type === Tokens.String) {
						node.quotes = true;
					}
					node.end = tok.end;
					tok = next2();
				} else {
					throw new Error('Expected attribute value');
				}
				WhiteSpace();
				let modifier_end = tok == null ? void 0 : tok.end;
				let mod = AttrModifier();
				if (mod) {
					node.end = modifier_end;
					node.modifier = mod;
				}
				WhiteSpace();
			}
			if (!tok) {
				return node;
			}
			if (tok.type === Tokens.BracketClose) {
				node.end = tok.end;
				tok = next2();
				return node;
			}
			throw new Error('Unclosed attribute selector');
		}
		return void 0;
	}
	function AttrMatcher() {
		if (isDelim(tok, '=')) {
			let ret = tok.value;
			tok = next2();
			return ret;
		}
		if (
			(tok == null ? void 0 : tok.type) === Tokens.Delim &&
			isDelim(peek(), '=')
		) {
			let ret = tok.value;
			tok = next2();
			ret += tok.value;
			tok = next2();
			return ret;
		}
		return void 0;
	}
	function AttrModifier() {
		if (
			(tok == null ? void 0 : tok.type) === Tokens.Ident &&
			/[iIsS]/.test(tok.value || '')
		) {
			let ret = tok.value.toLowerCase();
			tok = next2();
			return ret;
		}
		return void 0;
	}
	function PseudoElementSelector() {
		var _a;
		if (
			(tok == null ? void 0 : tok.type) === Tokens.Colon &&
			((_a = peek()) == null ? void 0 : _a.type) === Tokens.Colon
		) {
			let pseudo_element_start = tok.start;
			tok = next2();
			let node = PseudoClassSelector(true);
			if (node) {
				node.start = pseudo_element_start;
				node.type = NodeTypes.PseudoElementSelector;
				return node;
			}
		}
		return void 0;
	}
	function PseudoClassSelector(is_actually_pseudo_elem = false) {
		var _a, _b;
		if ((tok == null ? void 0 : tok.type) === Tokens.Colon) {
			if (
				((_a = peek()) == null ? void 0 : _a.type) === Tokens.Ident ||
				((_b = peek()) == null ? void 0 : _b.type) === Tokens.Function
			) {
				let node = {
					type: NodeTypes.PseudoClassSelector,
					start: tok.start
				};
				tok = next2();
				node.identifier = tok.value;
				if (tok.type === Tokens.Function) {
					node.argument = [];
					let fn_depth = 1;
					while (!eoi() && fn_depth) {
						tok = next2();
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
				tok = next2();
				return node;
			}
		}
	}
	function Argument(tokens2, syntax = Syntax.None) {
		if (typeof syntax === 'function') {
			return syntax(tokens2);
		}
		switch (syntax) {
			case Syntax.SelectorList:
				return parse(tokens2, options);
			case Syntax.AnPlusB:
				return AnPlusB(tokens2);
			case Syntax.None:
				return tokens2;
		}
		throw new Error(`Invalid argument syntax ${syntax}`);
	}
	return SelectorList();
};
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

// src/dom.js
var closest = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let curr = el;
	while (curr && !matches(curr, node)) {
		curr = curr.parentElement;
	}
	return curr;
};
var matches = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	if (Matchers[node.type]) {
		return Matchers[node.type](el, node);
	}
	throw new Error(`Unsupported node type ${node.type}`);
};
var querySelector = (el, sel) => {
	const node = typeof sel === 'string' || Array.isArray(sel) ? parse(sel) : sel;
	let it = (el.ownerDocument || el).createNodeIterator(
		el,
		1,
		n => n !== el && matches(n, node)
	);
	return it.nextNode();
};
var matchSelectorList = (el, node) => node.selectors.some(s => matches(el, s));
var matchComplexSelector = (el, node) => {
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
var matchCompoundSelector = (el, node) =>
	node.selectors.every(s => matches(el, s));
var matchIdSelector = (el, node) => el.id === node.identifier;
var matchClassSelector = (el, node) => el.classList.contains(node.identifier);
var matchAttributeSelector = (el, node) => {
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
var matchPseudoClassSelector = (el, node) => {
	switch (node.identifier) {
		case 'is':
		case 'where':
		case 'matches':
		case '-moz-any':
		case '-webkit-any':
			if (!node.argument) {
				return false;
			}
			if (node.argument.type !== NodeTypes.SelectorList) {
				throw new Error('Expected a SelectionList argument');
			}
			return node.argument.selectors.some(s => matches(el, s));
		case 'not':
			if (!node.argument) {
				return true;
			}
			if (node.argument.type !== NodeTypes.SelectorList) {
				throw new Error('Expected a SelectionList argument');
			}
			return node.argument.selectors.every(s => !matches(el, s));
		case 'has':
			if (!node.argument) {
				return false;
			}
			if (node.argument.type !== NodeTypes.SelectorList) {
				throw new Error('Expected a SelectionList argument');
			}
			return !!querySelector(el, node.argument);
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
var matchPseudoElementSelector = () => {
	throw new Error('Pseudo-elements are not supported.');
};
var matchTypeSelector = (el, node) => {
	if (node.identifier !== '*' && el.localName !== node.identifier) {
		return false;
	}
	if (node.namespace === void 0 || node.namespace === '*') {
		return true;
	}
	if (node.namespace === '' && el.prefix === null) {
		return true;
	}
	return el.prefix === node.namespace;
};
var previous = el => {
	let count = 0,
		ref = el;
	while ((ref = ref.previousElementSibling)) count++;
	return count;
};
var next = el => {
	let count = 0,
		ref = el;
	while ((ref = ref.nextElementSibling)) count++;
	return count;
};
var firstOfType = el => {
	let ref = el;
	while ((ref = ref.previousElementSibling)) {
		if (ref.localName === el.localName && ref.prefix === el.prefix) {
			return false;
		}
	}
	return true;
};
var lastOfType = el => {
	let ref = el;
	while ((ref = ref.nextElementSibling)) {
		if (ref.localName === el.localName && ref.prefix === el.prefix) {
			return false;
		}
	}
	return true;
};
var Matchers = {
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

// src/serialize.js
var serialize = (node, extra) => {
	if (Array.isArray(node)) {
		return node.map(serializeToken).join('');
	}
	let out;
	switch (node.type) {
		case NodeTypes.SelectorList:
			return node.selectors.map(s => serialize(s, extra)).join(', ');
		case NodeTypes.ComplexSelector:
			out = node.left === null ? '' : serialize(node.left, extra);
			if (node.combinator === ' ') {
				out += ' ';
			} else {
				out += (node.left === null ? '' : ' ') + node.combinator + ' ';
			}
			return out + serialize(node.right, extra);
		case NodeTypes.CompoundSelector:
			return node.selectors.map(s => serialize(s, extra)).join('');
		case NodeTypes.TypeSelector:
			return (
				(node.namespace === void 0 ? '' : node.namespace + '|') +
				node.identifier
			);
		case NodeTypes.IdSelector:
			return '#' + node.identifier;
		case NodeTypes.ClassSelector:
			return '.' + node.identifier;
		case NodeTypes.AttributeSelector:
			out = '[' + node.identifier;
			if (node.matcher) {
				out += node.matcher;
				if (node.quotes) {
					out += `"${node.value.replace(/"/g, '\\"')}"`;
				} else {
					out += node.value;
				}
				if (node.modifier) {
					out += ' ' + node.modifier;
				}
			}
			return out + ']';
		case NodeTypes.PseudoClassSelector:
			out = ':' + node.identifier;
			if (node.argument !== void 0) {
				out += '(' + serialize(node.argument, extra) + ')';
			}
			return out;
		case NodeTypes.PseudoElementSelector:
			out = '::' + node.identifier;
			if (node.argument !== void 0) {
				out += '(' + serialize(node.argument, extra) + ')';
			}
			return out;
	}
	if (typeof extra === 'function') {
		return extra(node, extra);
	}
	if (extra && typeof extra[node.type] === 'function') {
		return extra[node.type](node, extra);
	}
	throw new Error(`Unknown node type ${node.type}`);
};
var serializeToken = tok => {
	switch (tok.type) {
		case Tokens.Ident:
			return tok.value;
		case Tokens.Function:
			return tok.value + '(';
		case Tokens.AtKeyword:
			return '@' + tok.value;
		case Tokens.Hash:
			return '#' + tok.value;
		case Tokens.String:
			return `"${tok.value.replace(/"/g, '\\"')}"`;
		case Tokens.Dimension:
			return (
				(tok.sign || '') +
				tok.value +
				(/^e[+-]?\d/.test(tok.unit) ? '\\' : '') +
				tok.unit
			);
		case Tokens.Number:
			return (tok.sign || '') + tok.value;
		case Tokens.Percentage:
			return (tok.sign || '') + tok.value + '%';
		case Tokens.Delim:
			return tok.value + (tok.value === '\\' ? '\n' : '');
		case Tokens.Whitespace:
			return ' ';
		case Tokens.Colon:
			return ':';
		case Tokens.Semicolon:
			return ';';
		case Tokens.Comma:
			return ',';
		case Tokens.BracketOpen:
			return '[';
		case Tokens.BracketClose:
			return ']';
		case Tokens.ParenOpen:
			return '(';
		case Tokens.ParenClose:
			return ')';
		case Tokens.BraceOpen:
			return '{';
		case Tokens.BraceClose:
			return '}';
	}
	throw new Error(`Unknown token type ${tok.type}`);
};
export { parse, serialize, tokenize };
