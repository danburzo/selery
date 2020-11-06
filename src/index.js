const IDENT_START_CP = /[^\x00-\x7F]|[a-zA-Z_]/;
const IDENT_CP = /[^\x00-\x7F]|[a-zA-Z_0-9\-]/;

export const TOKENS = {
	IDENT: 'ident',
	FUNCTION: 'function',
	AT_KEYWORD: 'at-keyword',
	HASH: 'hash',
	STRING: 'string',
	DELIM: 'delim',
	WHITESPACE: 'whitespace',
	COLON: 'colon',
	SEMICOLON: 'semicolon',
	COMMA: 'comma',
	BRACKET_OPEN: '[',
	BRACKET_CLOSE: ']',
	PAREN_OPEN: '(',
	PAREN_CLOSE: ')',
	BRACE_OPEN: '{',
	BRACE_CLOSE: '}'
};

/*
	Preprocess the selector according to:
	https://drafts.csswg.org/css-syntax/#input-preprocessing
 */
const preprocess = str =>
	str.replace(/\f|\r\n?/g, '\n').replace(/[\u0000\uD800-\uDFFF]/g, '\uFFFD');

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
		Check if the stream starts with an identifier
	 */

	const is_ident = () => {
		if (size() < 2) {
			return false;
		}
		let ch = peek();
		if (ch.match(IDENT_START_CP)) {
			return true;
		}
		if (ch === '-') {
			let ch1 = peek(1);
			if (ch1.match(IDENT_CP) || ch1 === '-') {
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
		while (!eof() && (peek().match(IDENT_CP) || peek() === '\\')) {
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
		return {
			type: peek() === '(' ? TOKENS.FUNCTION : TOKENS.IDENT,
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
			tokens.push({ type: TOKENS.WHITESPACE });
			continue;
		}

		/* 
			Consume strings
		*/
		if (ch === '"' || ch === "'") {
			ref_ch = ch;
			token = {
				type: TOKENS.STRING,
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
			if (!eof() && (peek().match(IDENT_CP) || is_esc())) {
				token = {
					type: TOKENS.HASH
				};
				if (is_ident()) {
					token.id = true;
				}
				token.value = ident();
				tokens.push(token);
			} else {
				tokens.push({ type: TOKENS.DELIM, value: ch });
			}
			continue;
		}

		if (ch === '(') {
			tokens.push({ type: TOKENS.PAREN_OPEN });
			continue;
		}

		if (ch === ')') {
			tokens.push({ type: TOKENS.PAREN_CLOSE });
			continue;
		}

		if (ch === ',') {
			tokens.push({ type: TOKENS.COMMA });
			continue;
		}

		if (ch === '-') {
			if (is_ident()) {
				reconsume(ch);
				tokens.push({
					type: TOKENS.IDENT,
					value: ident()
				});
			} else {
				tokens.push({ type: TOKENS.DELIM, value: ch });
			}
			continue;
		}

		if (ch === ':') {
			tokens.push({ type: TOKENS.COLON });
			continue;
		}

		if (ch === ';') {
			tokens.push({ type: TOKENS.SEMICOLON });
			continue;
		}

		if (ch === '@') {
			if (is_ident()) {
				tokens.push({
					type: TOKENS.AT_KEYWORD,
					value: ident()
				});
			} else {
				tokens.push({ type: TOKENS.DELIM, value: ch });
			}
			continue;
		}

		if (ch === '[') {
			tokens.push({ type: TOKENS.BRACKET_OPEN });
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
			tokens.push({ type: TOKENS.BRACKET_CLOSE });
			continue;
		}

		if (ch === '{') {
			tokens.push({ type: TOKENS.BRACE_OPEN });
			continue;
		}

		if (ch === '}') {
			tokens.push({ type: TOKENS.BRACE_CLOSE });
			continue;
		}

		// TODO: digits

		if (ch.match(IDENT_START_CP)) {
			reconsume(ch);
			tokens.push(identlike());
			continue;
		}

		/*
			Treat everything not already handled
			as a delimiter.
		 */
		tokens.push({ type: TOKENS.DELIM, value: ch });
	}

	return tokens;
};

export const parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;

	const next = () => tokens.shift();
	const peek = () => tokens[0];
	const eoi = () => !tokens.length;

	let token;

	while ((token = next())) {}
};
