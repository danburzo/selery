const IdentStartCodePoint = /[^\x00-\x7F]|[a-zA-Z_]/;
const IdentCodePoint = /[^\x00-\x7F]|[-\w]/;

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
 */
const preprocess = str =>
	str
		// We won't be needing trailing whitespace
		.replace(/^\s+|\s+$/, '')
		// Normalize newline characters
		.replace(/\f|\r\n?/g, '\n')
		// Some Unicode characters are not supported
		.replace(/[\u0000\uD800-\uDFFF]/g, '\uFFFD');

export const tokenize = str => {
	let chars = preprocess(str).split('');
	let tokens = [];

	const next = () => chars.shift();
	const reconsume = ch => chars.unshift(ch);
	const peek = n => chars[n || 0];
	const eof = () => !chars.length;
	const size = () => chars.length;

	let ch, ref_ch, token;

	/* 
		Consume an escape sequence.

		TODO: handle newlines and hex digits
	*/
	const is_esc = () => size() > 1 && peek() === '\\' && peek(1) !== '\n';
	const esc = () => {
		let v = '';
		if (eof()) {
			throw new Error('Unexpected end of input, unterminated escape sequence');
		} else {
			// Consume escaped character
			v += next();
		}
		return v;
	};

	/*
		4.3.10. Check if three code points would start a number
		https://drafts.csswg.org/css-syntax/#starts-with-a-number
	 */
	const is_num = () => {
		let ch = peek(),
			ch1 = peek(1);
		if (ch === '-' || ch === '+') {
			return /\d/.test(ch1) || (ch1 === '.' && /\d/.test(peek(2)));
		}
		if (ch === '.') {
			return /\d/.test(ch1);
		}
		return /\d/.test(ch);
	};

	/*
		4.3.3. Consume a numeric token
		https://drafts.csswg.org/css-syntax/#consume-numeric-token
	 */
	const num = () => {
		let value = '';
		if (/[+-]/.test(peek())) {
			value += next();
		}
		value += digits();
		if (peek() === '.' && /\d/.test(peek(1))) {
			value += next() + digits();
		}
		if (/e/i.test(peek())) {
			if (/[+-]/.test(peek(1)) && /\d/.test(peek(2))) {
				value += next() + next() + digits();
			} else if (/\d/.test(peek(1))) {
				value += next() + digits();
			}
		}
		if (is_ident()) {
			return {
				type: Tokens.Dimension,
				value,
				unit: ident()
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
		while (/\d/.test(peek())) {
			v += next();
		}
		return v;
	};

	/*
		Check if the stream starts with an identifier.
	 */

	const is_ident = () => {
		if (!size()) {
			return false;
		}
		let ch = peek();
		if (ch.match(IdentStartCodePoint)) {
			return true;
		}
		if (ch === '-') {
			if (size() < 2) {
				return false;
			}
			let ch1 = peek(1);
			if (ch1.match(IdentCodePoint) || ch1 === '-') {
				return true;
			}
			if (ch1 === '\\') {
				return !!esc();
			}
			return false;
		}
		if (ch === '\\') {
			return !!esc();
		}
		return false;
	};

	/*
		Consume an identifier.
	 */
	const ident = () => {
		let v = '',
			ch;
		while (!eof() && (peek().match(IdentCodePoint) || peek() === '\\')) {
			v += (ch = next()) === '\\' ? esc() : ch;
		}
		return v;
	};

	/*
		Consume an ident-like token.
	 */
	const identlike = () => {
		let v = ident();
		// TODO: handle URLs
		if (peek() === '(') {
			next();
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

	while (!eof()) {
		ch = next();

		/* 
			Consume comments
		*/
		if (ch === '/' && peek() === '*') {
			next(); // consume *
			while (!eof() && ((ch = next()) !== '*' || peek() !== '/')) {
				if (ch === '\\') {
					esc();
				}
			}
			if (eof()) {
				throw new Error('Unexpected end of input, unterminated comment');
			}
			next(); // consume /
			continue;
		}

		/*
			Consume whitespace
		 */
		if (ch.match(/[\n\t ]/)) {
			while (!eof() && peek().match(/[\n\t ]/)) {
				next();
			}
			tokens.push({ type: Tokens.Whitespace });
			continue;
		}

		/* 
			Consume strings
		*/
		if (ch === '"' || ch === "'") {
			ref_ch = ch;
			token = {
				type: Tokens.String,
				value: ''
			};
			while (!eof() && (ch = next()) !== ref_ch && ch !== '\n') {
				token.value += ch === '\\' ? esc() : ch;
			}
			if (ch === ref_ch) {
				tokens.push(token);
				continue;
			}
			if (ch === '\n') {
				// TODO: spec says to return bad-string token here, relevant?
				throw new Error('Unexpected newline character inside string');
			}
			if (eof()) {
				throw new Error(
					`Unexpected end of input, unterminated string ${token.value}`
				);
			}
		}

		/* 
			Consume IDs 
		*/
		if (ch === '#') {
			if (!eof() && (peek().match(IdentCodePoint) || is_esc())) {
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
				reconsume(ch);
				tokens.push(num());
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
		}

		if (ch === ',') {
			tokens.push({ type: Tokens.Comma });
			continue;
		}

		if (ch === '-') {
			if (is_num()) {
				reconsume(ch);
				tokens.push(num());
			} else if (is_ident()) {
				reconsume(ch);
				tokens.push({
					type: Tokens.Ident,
					value: ident()
				});
			} else {
				tokens.push({ type: Tokens.Delim, value: ch });
			}
			continue;
		}

		if (ch === '.') {
			if (is_num()) {
				reconsume(ch);
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
			if (!eof() && peek() !== '\n') {
				reconsume(ch);
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

		if (ch.match(/\d/)) {
			reconsume(ch);
			tokens.push(num());
			continue;
		}

		if (ch.match(IdentStartCodePoint)) {
			reconsume(ch);
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
