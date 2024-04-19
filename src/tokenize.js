/*
	Tokenize a string according to the rules of CSS Syntax:

		https://drafts.csswg.org/css-syntax/

	The `tokenize()` function implements it almost completely,
	but skimps on a couple of areas unrelated to CSS selectors.
	(See the TODOs throughout the code.)

	It also doesn’t currently track the concrete position of tokens.
*/

// https://drafts.csswg.org/css-syntax/#ident-start-code-point
const IdentStartCodePoint =
	/[a-zA-Z_]|[\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{10FFFF}]/u;
const IdentCodePoint =
	/[-\w]|[\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{10FFFF}]/u;
// https://drafts.csswg.org/css-syntax/#non-printable-code-point
const NonPrintableCodePoint = /[\x00-\x08\x0B\x0E-\x1F\x7F]/;
const HexDigit = /[0-9a-zA-Z]/;

/* 
	§ 4. Tokenization
	https://drafts.csswg.org/css-syntax/#tokenizer-definitions

	Note: This structure defines all CSS tokens. 
	Not all of them are currently emitted by `tokenize()`.
*/
export const Tokens = {
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

export function tokenize(str) {
	/*
		§ 3.3. Preprocessing the input stream
		https://drafts.csswg.org/css-syntax/#input-preprocessing
	 */
	let chars = str
		.replace(/\f|\r\n?/g, '\n')
		.replace(/[\u0000\uD800-\uDFFF]/g, '\uFFFD');
	let _i = 0;
	let tokens = [],
		token;
	let ch, matching_ch;

	/* 
		§ 4.3.7. Consume an escaped code point
	*/
	const esc = () => {
		if (_i >= chars.length) {
			throw new Error('Unexpected end of input, unterminated escape sequence');
		} else if (HexDigit.test(chars[_i] || '')) {
			let hex = chars[_i++];
			while (hex.length < 6 && HexDigit.test(chars[_i] || '')) {
				hex += chars[_i];
			}
			// consume following whitespace
			if (is_ws()) {
				i++;
			}
			let v = parseInt(hex, 16);
			if (v === 0 || (v >= 0xd800 && v <= 0xdfff) || v > 0x10ffff) {
				return '\uFFFD';
			}
			return String.fromCodePoint(v);
		}
		return chars[_i++]; // Consume escaped character
	};

	// § 4.3.8. Check if two code points are a valid escape
	const is_esc = (offset = 0) =>
		chars[_i + offset] === '\\' && chars[_i + offset + 1] !== '\n';

	/*
		§ 4.3.10. Check if three code points would start a number
		https://drafts.csswg.org/css-syntax/#starts-with-a-number
	 */
	const is_num = () => {
		if (chars[_i] === '-' || chars[_i] === '+') {
			return (
				/\d/.test(chars[_i + 1] || '') ||
				(chars[_i + 1] === '.' && /\d/.test(chars[_i + 2] || ''))
			);
		}
		if (chars[_i] === '.') {
			return /\d/.test(chars[_i + 1] || '');
		}
		return /\d/.test(chars[_i] || '');
	};

	/*
		§ 4.3.3. Consume a numeric token
		https://drafts.csswg.org/css-syntax/#consume-numeric-token
	 */
	const num = () => {
		let value = '';
		if (chars[_i] === '+' || chars[_i] === '-') {
			value += chars[_i++];
		}
		value += digits();
		if (chars[_i] === '.' && /\d/.test(chars[_i + 1] || '')) {
			value += chars[_i++] + digits();
		}
		if (chars[_i] === 'e' || chars[_i] === 'E') {
			if (
				(chars[_i + 1] === '+' || chars[_i + 1] === '-') &&
				/\d/.test(chars[_i + 2] || '')
			) {
				value += chars[_i++] + chars[_i++] + digits();
			} else if (/\d/.test(chars[_i + 1] || '')) {
				value += chars[_i++] + digits();
			}
		}
		if (is_ident()) {
			return {
				type: Tokens.Dimension,
				value,
				unit: ident()
			};
		}

		if (chars[_i] === '%') {
			_i++;
			return {
				type: Tokens.Percentage,
				value
			};
		}
		return {
			type: Tokens.Number,
			value
		};
	};

	/*
		Consume digits
	 */
	const digits = () => {
		let v = '';
		while (/\d/.test(chars[_i] || '')) {
			v += chars[_i++];
		}
		return v;
	};

	/*
		§ 4.3.9. Check if three code points would start an ident sequence
	 */

	const is_ident = () => {
		if (chars[_i] === '-') {
			if (IdentCodePoint.test(chars[_i + 1] || '') || chars[_i + 1] === '-') {
				return true;
			}
			if (chars[_i + 1] === '\\') {
				return is_esc(1);
			}
			return false;
		}
		if (IdentStartCodePoint.test(chars[_i] || '')) {
			return true;
		}
		if (chars[_i] === '\\') {
			return is_esc();
		}
		return false;
	};

	/*
		§ 4.3.12. Consume an ident sequence
	 */
	const ident = () => {
		let v = '';
		while (_i < chars.length) {
			if (IdentCodePoint.test(chars[_i] || '')) {
				v += chars[_i++];
			} else if (is_esc()) {
				_i++; // consume solidus
				v += esc();
			} else {
				return v;
			}
		}
		return v;
	};

	/*
		§ 4.3.4. Consume an ident-like token
		https://drafts.csswg.org/css-syntax/#consume-an-ident-like-token
	 */
	const identlike = () => {
		let v = ident();
		if (v.toLowerCase() === 'url' && chars[_i] === '(') {
			_i++; // consume parenthesis
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
					value: v
				};
			} else {
				// § 4.3.6. Consume a url token
				// https://drafts.csswg.org/css-syntax/#consume-a-url-token
				let curr;
				while (is_ws()) {
					_i++;
				}
				let tok = { type: Tokens.Url, value: '' };
				while ((curr = chars[_i++])) {
					if (curr === ')') {
						return tok;
					}
					if (curr === ' ' || curr === '\n' || curr === '\t') {
						while (is_ws()) {
							_i++;
						}
						if (chars[_i] === ')') {
							_i++; // consume right parenthesis
							return tok;
						}
						if (_i === chars.length) {
							throw new Error('Unexpected end of input');
						}
						// TODO: consume remnants of bad URL
					}
					if (
						curr === '"' ||
						curr === "'" ||
						curr === '(' ||
						curr === '' ||
						NonPrintableCodePoint.test(curr || '')
					) {
						throw new Error('Invalid URL');
						// TODO: consume remnants of bad URL
					}
					if (curr === '\\') {
						if (is_esc()) {
							tok.value += esc();
							continue;
						} else {
							throw new Error('Invalid escape sequence');
							// TODO: consume remnants of bad URL
						}
					}
					tok.value += curr;
				}
				throw new Error('Unexpected end of input');
			}
		}

		if (chars[_i] === '(') {
			chars[_i++]; // consume parenthesis
			return {
				type: Tokens.Function,
				value: v
			};
		}
		return {
			type: Tokens.Ident,
			value: v
		};
	};

	const is_ws = (offset = 0) =>
		chars[_i + offset] === ' ' ||
		chars[_i + offset] === '\n' ||
		chars[_i + offset] === '\t';

	while (_i < chars.length) {
		// § 4.3.2. Consume comments
		if (chars[_i] === '/' && chars[_i + 1] === '*') {
			_i += 2; // consume start of comment
			while (
				_i < chars.length &&
				!(chars[_i] === '*' || chars[_i + 1] === '/')
			) {
				_i++;
			}
			if (_i === chars.length) {
				throw new Error('Unexpected end of input, unterminated comment');
			}
			_i += 2; // consume end of comment
			continue;
		}

		// Consume the next input code point.
		ch = chars[_i++];

		// Consume whitespace
		if (ch === ' ' || ch === '\n' || ch === '\t') {
			while (is_ws()) {
				_i++;
			}
			tokens.push({ type: Tokens.Whitespace });
			continue;
		}

		// § 4.3.5. Consume a string token
		if (ch === '"' || ch === "'") {
			matching_ch = ch;
			token = {
				type: Tokens.String,
				value: ''
			};
			while (
				_i < chars.length &&
				(ch = chars[_i++]) !== matching_ch &&
				ch !== '\n'
			) {
				if (ch === '\\') {
					if (_i === chars.length) {
						// do nothing
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
				tokens.push(token);
				continue;
			}
			if (ch === '\n') {
				// TODO: spec says to return bad-string token here, relevant?
				throw new Error('Unexpected newline character inside string');
			}
			if (_i >= chars.length) {
				throw new Error(
					`Unexpected end of input, unterminated string ${token.value}`
				);
			}
		}

		/* 
			Consume a hash token
		*/
		if (ch === '#') {
			if (
				_i < chars.length &&
				(IdentCodePoint.test(chars[_i] || '') || is_esc())
			) {
				token = {
					type: Tokens.Hash
				};
				if (is_ident()) {
					token.id = true;
				}
				token.value = ident();
				tokens.push(token);
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === '(') {
			tokens.push({ type: Tokens.ParenOpen });
			continue;
		}

		if (ch === ')') {
			tokens.push({ type: Tokens.ParenClose });
			continue;
		}

		if (ch === '+') {
			if (is_num()) {
				_i--;
				tokens.push(num());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === ',') {
			tokens.push({ type: Tokens.Comma });
			continue;
		}

		if (ch === '-') {
			if (chars[_i] === '-' && chars[_i + 1] === '>') {
				_i += 2;
				tokens.push({
					type: Tokens.CDC
				});
			} else if (is_num()) {
				_i--;
				tokens.push(num());
			} else if (is_ident()) {
				_i--;
				tokens.push(identlike());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === '.') {
			if (is_num()) {
				_i--;
				tokens.push(num());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === ':') {
			tokens.push({ type: Tokens.Colon });
			continue;
		}

		if (ch === ';') {
			tokens.push({ type: Tokens.Semicolon });
			continue;
		}

		if (ch === '<') {
			if (chars[_i] === '!' && chars[_i + 1] === '-' && chars[_i + 2] === '-') {
				tokens.push({ type: Tokens.CDO });
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === '@') {
			if (is_ident()) {
				tokens.push({
					type: Tokens.AtKeyword,
					value: ident()
				});
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === '[') {
			tokens.push({ type: Tokens.BracketOpen });
			continue;
		}

		if (ch === '\\') {
			if (is_esc()) {
				_i--;
				tokens.push(identlike());
				continue;
			}
			throw new Error('Invalid escape');
		}

		if (ch === ']') {
			tokens.push({ type: Tokens.BracketClose });
			continue;
		}

		if (ch === '{') {
			tokens.push({ type: Tokens.BraceOpen });
			continue;
		}

		if (ch === '}') {
			tokens.push({ type: Tokens.BraceClose });
			continue;
		}

		if (/\d/.test(ch || '')) {
			_i--;
			tokens.push(num());
			continue;
		}

		// TODO: handle unicode ranges (u)

		if (ch.match(IdentStartCodePoint)) {
			_i--;
			tokens.push(identlike());
			continue;
		}

		/*
			Treat everything not already handled
			as a delimiter.
		 */
		tokens.push({ type: Tokens.Delim, value: ch });
	}

	return tokens;
}
