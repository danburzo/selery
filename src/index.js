export const parse = selector => {
	let chars = selector.split('');
	let res = '';
	let tokens = [];

	const next = () => chars.shift();
	const peek = () => chars[0];
	const eof = () => !chars.length;

	let ch, cur, value;

	while (chars.length) {
		ch = next();

		// Whitespace
		if (ch.match(/\s/)) {
			tokens.push({
				type: 'whitespace'
			});
			while (!eof() && peek().match(/\s/)) {
				next();
			}
			continue;
		}

		// Strings: 'single quoted' and "double quoted"
		if (ch === '"' || ch === "'") {
			value = '';
			while (!eof() && (cur = next()) !== ch) {
				value += cur;
			}
			if (eof()) {
				throw new Error('Unexpected end of input, unterminated string');
			}
			tokens.push({
				type: 'string',
				value
			});
			continue;
		}

		// Comments: /* */
		if (ch === '/' && peek() === '*') {
			// Consume the '*' char:
			ch = next();
			value = '';
			// Consume everything until '*/'
			while (!eof() && ((ch = next()) !== '*' || peek() !== '/')) {
				// no-op
				if (peek() !== '/') {
					value += ch;
				}
			}
			if (eof()) {
				throw new Error('Unexpected end of input, unterminated comment');
			}
			// Consume the '/' char:
			ch = next();
			tokens.push({
				type: 'comment',
				value
			});
			continue;
		}

		// TODO: escaping

		if (ch === '[') {
			tokens.push({
				type: 'attr-start'
			});
			continue;
		}

		if (ch === ']') {
			tokens.push({
				type: 'attr-end'
			});
			continue;
		}

		if (
			(ch === '~' || ch === '|' || ch === '^' || ch === '$' || ch === '*') &&
			peek() === '='
		) {
			tokens.push({
				type: 'attr-matcher',
				value: ch + next()
			});
			continue;
		}

		if (ch === '=') {
			tokens.push({
				type: 'attr-matcher',
				value: ch
			});
			continue;
		}
	}
	return tokens;
};
