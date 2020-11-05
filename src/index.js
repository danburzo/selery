/* AST Types */
const SELECTOR_LIST = 'SelectorList';

const COMPLEX_SELECTOR = 'ComplexSelector';
const COMPOUND_SELECTOR = 'CompundSelector';

const TYPE_SELECTOR = 'TypeSelector';
const ID_SELECTOR = 'IdSelector';
const CLASS_SELECTOR = 'ClassSelector';
const ATTRIBUTE_SELECTOR = 'AttributeSelector';
const PSEUDO_ELEMENT_SELECTOR = 'PseudoElementSelector';
const PSEUDO_CLASS_SELECTOR = 'PseudoClassSelector';

const IDENT_START = /[^\x00-\x7F]|[a-zA-Z_]/;
const HASH_IDENT = /[^\x00-\x7F]|[a-zA-Z_0-9\-]/;

const TOKENS = {
	IDENT: 'ident',
	FUNCTION: 'function',
	AT_KEYWORD: 'at-keyword',
	HASH: 'hash',
	STRING: 'string',
	BAD_STRING: 'bad-string',
	URL: 'url',
	BAD_URL: 'bad-url-token',
	DELIM: 'delim',
	NUMBER: 'number',
	PERCENTAGE: 'percentage',
	DIMENSION: 'dimension',
	WHITESPACE: 'whitespace',
	CDO: 'CDO',
	CDC: 'CDC',
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
	Back in the day, these pseudo-elements could be expressed
	with the pseudo-class syntax, e.g. `div:after` instead
	of `div::after`. Make sure we handle these correctly.
 */
const LEGACY_PSEUDO_ELEMENTS = new Set([
	'before',
	'after',
	'first-line',
	'first-letter'
]);

/*
	Out of all pseudo-classes, most of them have their own 
	microsyntax, such as the An+B syntax for nth-child().

	For logical combination pseudo-classes, 
	their argument must be parsed as a list of selectors.
 */
const LOGICAL_PSEUDO_CLASSES = new Set(['has', 'is', 'where', 'not']);

const node = (attrs, parent) => {
	Object.defineProperty(attrs, 'parent', {
		enumerable: false,
		value: parent
	});
	return attrs;
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
	const peek = n => chars[n || 0];
	const eof = () => !chars.length;

	let ch, ref_ch, token;

	/* 
		TODO: treat newlines and hex digits
	*/
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
			tokens.push({
				type: TOKENS.WHITESPACE
			});
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

		if (ch === '#') {
			// TODO
		}

		if (ch === '+') {
			// TODO
		}

		if (ch === ',') {
			tokens.push({
				type: TOKENS.COMMA
			});
			continue;
		}

		if (ch === '-') {
			// todo
			continue;
		}

		if (ch === '.') {
			// todo
			continue;
		}

		if (ch === ':') {
			tokens.push({
				type: TOKENS.COLON
			});
			continue;
		}

		if (ch === ';') {
			tokens.push({
				type: TOKENS.SEMICOLON
			});
			continue;
		}

		if (ch === '(') {
			tokens.push({
				type: TOKENS.PAREN_OPEN
			});
			continue;
		}

		if (ch === ')') {
			tokens.push({
				type: TOKENS.PAREN_CLOSE
			});
			continue;
		}

		if (ch === '[') {
			tokens.push({
				type: TOKENS.BRACKET_OPEN
			});
			continue;
		}

		if (ch === ']') {
			tokens.push({
				type: TOKENS.BRACKET_CLOSE
			});
			continue;
		}

		if (ch === '{') {
			tokens.push({
				type: TOKENS.BRACE_OPEN
			});
			continue;
		}

		if (ch === '}') {
			tokens.push({
				type: TOKENS.BRACE_CLOSE
			});
			continue;
		}

		tokens.push({
			type: TOKENS.DELIM,
			value: ch
		});
	}

	return tokens;
};
