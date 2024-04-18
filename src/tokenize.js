// https://drafts.csswg.org/css-syntax/#ident-start-code-point
const IdentStartCodePoint =
	/[a-zA-Z_]|[\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
const IdentCodePoint =
	/[-\w]|[\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
const HexDigit = /[0-9a-zA-Z]/;

/*


    greater than or equal to U+10000
*/

export const Tokens = {
	AtKeyword: 'at-keyword',
	BraceClose: '}',
	BraceOpen: '{',
	BracketClose: ']',
	BracketOpen: '[',
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
	Semicolon: 'semicolon',
	String: 'string',
	Whitespace: 'whitespace'
};

/*
	Preprocess the selector according to:
	https://drafts.csswg.org/css-syntax/#input-preprocessing

	1. Remove trailing whitespace
	2. Normalize newline characters
	3. Handle U+0000 NULL and surrogate code points
 */
const preprocess = str =>
	str
		.trim()
		.replace(/\f|\r\n?/g, '\n')
		.replace(/[\u0000\uD800-\uDFFF]/g, '\uFFFD');

export const tokenize = str => {
	let chars = preprocess(str),
		_i = 0;
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
			if (chars[_i] === ' ' || chars[_i] === '\n' || chars[_i] === '\t') {
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
		// TODO: handle U+0025 PERCENTAGE SIGN
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
		// TODO: handle URLs?
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
			while (
				_i < chars.length &&
				(chars[_i] === ' ' || chars[_i] === '\n' || chars[_i] === '\t')
			) {
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
			// TODO: handle <CDC-token>
			if (is_num()) {
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

		// TODO: handle "<"

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

		// TODO: handle "U"

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
};
