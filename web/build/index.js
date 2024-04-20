var X = Object.defineProperty;
var F = Object.getOwnPropertySymbols;
var Y = Object.prototype.hasOwnProperty,
	ee = Object.prototype.propertyIsEnumerable;
var z = (n, e, t) =>
		e in n
			? X(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
			: (n[e] = t),
	U = (n, e) => {
		for (var t in e || (e = {})) Y.call(e, t) && z(n, t, e[t]);
		if (F) for (var t of F(e)) ee.call(e, t) && z(n, t, e[t]);
		return n;
	};
var te = /[\x00-\x08\x0B\x0E-\x1F\x7F]/,
	_ = /[0-9a-fA-F]/;
function M(n) {
	return (
		n == 183 ||
		(n >= 192 && n <= 214) ||
		(n >= 216 && n <= 246) ||
		(n >= 248 && n <= 893) ||
		(n >= 895 && n <= 8191) ||
		n == 8204 ||
		n == 8205 ||
		n == 8255 ||
		n == 8256 ||
		(n >= 895 && n <= 8191) ||
		(n >= 8304 && n <= 8591) ||
		(n >= 11264 && n <= 12271) ||
		(n >= 12289 && n <= 55295) ||
		(n >= 63744 && n <= 64975) ||
		(n >= 65008 && n <= 65533) ||
		n > 65536
	);
}
function O(n) {
	return n && (/[a-zA-Z_]/.test(n) || M(n.codePointAt(0)));
}
function q(n) {
	return n && (/[-\w]/.test(n) || M(n.codePointAt(0)));
}
var o = {
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
function B(n) {
	let e = Array.from(
			n.replace(
				/\f|\r\n?/g,
				`
`
			)
		).map(s => {
			let f = s.codePointAt(0);
			return !f || (f >= 55296 && f <= 57343) ? '\uFFFD' : s;
		}),
		t = 0,
		r = [],
		d,
		l,
		A;
	function y() {
		if (t >= e.length)
			throw new Error('Unexpected end of input, unterminated escape sequence');
		if (_.test(e[t] || '')) {
			let s = e[t++];
			for (; s.length < 6 && _.test(e[t] || ''); ) s += e[t++];
			m() && t++;
			let f = parseInt(s, 16);
			return f === 0 || (f >= 55296 && f <= 57343) || f > 1114111
				? '\uFFFD'
				: String.fromCodePoint(f);
		}
		return e[t++];
	}
	let g = (s = 0) =>
			e[t + s] === '\\' &&
			e[t + s + 1] !==
				`
`,
		c = () =>
			l === '-' || l === '+'
				? /\d/.test(e[t] || '') || (e[t] === '.' && /\d/.test(e[t + 1] || ''))
				: l === '.'
					? /\d/.test(e[t] || '')
					: /\d/.test(l || ''),
		w = () => {
			let s = '';
			return (
				(e[t] === '+' || e[t] === '-') && (s += e[t++]),
				(s += b()),
				e[t] === '.' && /\d/.test(e[t + 1] || '') && (s += e[t++] + b()),
				(e[t] === 'e' || e[t] === 'E') &&
					((e[t + 1] === '+' || e[t + 1] === '-') && /\d/.test(e[t + 2] || '')
						? (s += e[t++] + e[t++] + b())
						: /\d/.test(e[t + 1] || '') && (s += e[t++] + b())),
				E()
					? { type: o.Dimension, value: +s, unit: P() }
					: e[t] === '%'
						? (t++, { type: o.Percentage, value: +s })
						: { type: o.Number, value: +s }
			);
		},
		b = () => {
			let s = '';
			for (; /\d/.test(e[t] || ''); ) s += e[t++];
			return s;
		};
	function E(s = 0) {
		return e[t + s] === '-'
			? O(e[t + s + 1]) || e[t + s + 1] === '-'
				? !0
				: e[t + s + 1] === '\\'
					? g(s + 1)
					: !1
			: O(e[t + s])
				? !0
				: e[t + s] === '\\'
					? g(s)
					: !1;
	}
	function P() {
		let s = '';
		for (; t < e.length; )
			if (q(e[t])) s += e[t++];
			else if (g()) t++, (s += y());
			else return s;
		return s;
	}
	function N() {
		let s = P();
		if (s.toLowerCase() === 'url' && e[t] === '(') {
			for (t++; m() && m(1); ) t++;
			if (
				e[t] === '"' ||
				e[t] === "'" ||
				(m() && (e[t + 1] === '"' || e[t + 1] === "'"))
			)
				return { type: o.Function, value: s };
			{
				let f;
				for (; m(); ) t++;
				let v = { type: o.Url, value: '' };
				for (; (f = e[t++]); ) {
					if (f === ')') return v;
					if (
						f === ' ' ||
						f ===
							`
` ||
						f === '	'
					) {
						for (; m(); ) t++;
						if (e[t] === ')') return t++, v;
						throw t === e.length
							? new Error('Unexpected end of input')
							: new Error('Bad URL');
					}
					if (
						f === '"' ||
						f === "'" ||
						f === '(' ||
						f === '' ||
						te.test(f || '')
					)
						throw new Error('Invalid URL');
					if (f === '\\')
						if (g()) {
							v.value += y();
							continue;
						} else throw new Error('Invalid escape sequence');
					v.value += f;
				}
				throw new Error('Unexpected end of input');
			}
		}
		return e[t] === '('
			? (e[t++], { type: o.Function, value: s })
			: { type: o.Ident, value: s };
	}
	function m(s = 0) {
		return (
			e[t + s] === ' ' ||
			e[t + s] ===
				`
` ||
			e[t + s] === '	'
		);
	}
	for (; t < e.length; ) {
		if (e[t] === '/' && e[t + 1] === '*') {
			for (t += 2; t < e.length && !(e[t] === '*' && e[t + 1] === '/'); ) t++;
			if (t === e.length)
				throw new Error('Unexpected end of input, unterminated comment');
			t += 2;
			continue;
		}
		if (
			((l = e[t++]),
			l === ' ' ||
				l ===
					`
` ||
				l === '	')
		) {
			for (; m(); ) t++;
			r.push({ type: o.Whitespace });
			continue;
		}
		if (l === '"' || l === "'") {
			for (
				A = l, d = { type: o.String, value: '' };
				t < e.length &&
				(l = e[t++]) !== A &&
				l !==
					`
`;

			)
				l === '\\'
					? t === e.length ||
						(e[t] ===
						`
`
							? t++
							: (d.value += y()))
					: (d.value += l);
			if (l === A) {
				r.push(d);
				continue;
			}
			if (
				l ===
				`
`
			)
				throw new Error('Unexpected newline character inside string');
			if (t >= e.length)
				throw new Error(
					`Unexpected end of input, unterminated string ${d.value}`
				);
		}
		if (l === '#') {
			t < e.length && (q(e[t]) || g())
				? ((d = { type: o.Hash }),
					E() && (d.id = !0),
					(d.value = P()),
					r.push(d))
				: r.push({ type: o.Delim, value: l });
			continue;
		}
		if (l === '(') {
			r.push({ type: o.ParenOpen });
			continue;
		}
		if (l === ')') {
			r.push({ type: o.ParenClose });
			continue;
		}
		if (l === '+') {
			c() ? (t--, r.push(w())) : r.push({ type: o.Delim, value: l });
			continue;
		}
		if (l === ',') {
			r.push({ type: o.Comma });
			continue;
		}
		if (l === '-') {
			c()
				? (t--, r.push(w()))
				: e[t] === '-' && e[t + 1] === '>'
					? ((t += 2), r.push({ type: o.CDC }))
					: E(-1)
						? (t--, r.push(N()))
						: r.push({ type: o.Delim, value: l });
			continue;
		}
		if (l === '.') {
			c() ? (t--, r.push(w())) : r.push({ type: o.Delim, value: l });
			continue;
		}
		if (l === ':') {
			r.push({ type: o.Colon });
			continue;
		}
		if (l === ';') {
			r.push({ type: o.Semicolon });
			continue;
		}
		if (l === '<') {
			e[t] === '!' && e[t + 1] === '-' && e[t + 2] === '-'
				? ((t += 3), r.push({ type: o.CDO }))
				: r.push({ type: o.Delim, value: l });
			continue;
		}
		if (l === '@') {
			E()
				? r.push({ type: o.AtKeyword, value: P() })
				: r.push({ type: o.Delim, value: l });
			continue;
		}
		if (l === '[') {
			r.push({ type: o.BracketOpen });
			continue;
		}
		if (l === '\\') {
			if (g(-1)) {
				t--, r.push(N());
				continue;
			}
			throw new Error('Invalid escape');
		}
		if (l === ']') {
			r.push({ type: o.BracketClose });
			continue;
		}
		if (l === '{') {
			r.push({ type: o.BraceOpen });
			continue;
		}
		if (l === '}') {
			r.push({ type: o.BraceClose });
			continue;
		}
		if (/\d/.test(l || '')) {
			t--, r.push(w());
			continue;
		}
		if (O(l)) {
			t--, r.push(N());
			continue;
		}
		r.push({ type: o.Delim, value: l });
	}
	return r;
}
var a = {
		TypeSelector: 'TypeSelector',
		IdSelector: 'IdSelector',
		ClassSelector: 'ClassSelector',
		AttributeSelector: 'AttributeSelector',
		PseudoClassSelector: 'PseudoClassSelector',
		PseudoElementSelector: 'PseudoElementSelector',
		CompoundSelector: 'CompoundSelector',
		ComplexSelector: 'ComplexSelector',
		SelectorList: 'SelectorList'
	},
	h = { None: 'None', SelectorList: 'SelectorList', AnPlusB: 'AnPlusB' },
	re = {
		':is': h.SelectorList,
		':matches': h.SelectorList,
		':-moz-any': h.SelectorList,
		':-webkit-any': h.SelectorList,
		':where': h.SelectorList,
		':not': h.SelectorList,
		':has': h.SelectorList,
		':nth-child': h.AnPlusB,
		':nth-last-child': h.AnPlusB,
		':nth-of-type': h.AnPlusB,
		':nth-last-of-type': h.AnPlusB,
		':nth-col': h.AnPlusB,
		':nth-last-col': h.AnPlusB
	},
	ne = [' ', '>', '+', '~', '||'],
	ie = ['=', '|=', '~=', '^=', '*=', '$='],
	C = (n, e = {}) => {
		let t = typeof n == 'string' ? B(n) : n,
			r,
			d = U(U({}, re), e.syntaxes || {}),
			l = e.combinators || ne,
			A = e.attrMatchers || ie;
		function y(i, u) {
			return (i == null ? void 0 : i.type) === o.Delim && i.value === u;
		}
		let g = () => !t.length,
			c = () => t.shift(),
			w = i => t[i || 0];
		function b() {
			let i = [],
				u,
				p = !0;
			for (; (r = c()); ) {
				if ((m(), p && ((u = E()), u))) {
					if ((i.push(u), (p = !1), m(), !r)) continue;
					if (r.type === o.Comma) {
						p = !0;
						continue;
					}
				}
				throw new Error(`Unexpected token ${r.type}`);
			}
			if (p) throw new Error('Unexpected end of input');
			return { type: a.SelectorList, selectors: i };
		}
		function E() {
			let i, u, p;
			for (; r; ) {
				if (((u = P()), u))
					if (!i) i = { type: a.ComplexSelector, left: u };
					else if (i.combinator && !i.right)
						(i.right = u), (i = { type: a.ComplexSelector, left: i });
					else throw new Error(`Unexpected selector: ${u.type}`);
				if (((p = N()), p)) {
					if (l.indexOf(p) < 0) throw new Error(`Unsupported combinator: ${p}`);
					if (
						(i || (i = { type: a.ComplexSelector, left: null }), i.combinator)
					)
						throw new Error(`Extraneous combinator: ${p}`);
					i.combinator = p;
				}
				if (!u && !p) break;
			}
			if (i) {
				if (!i.right) {
					if ((!i.combinator || i.combinator === ' ') && i.left !== null)
						return i.left;
					throw new Error(`Expected selector after combinator ${i.combinator}`);
				}
				return i;
			}
		}
		function P() {
			let i = [],
				u = s();
			for (u && i.push(u); (u = v() || T() || $() || D()); ) i.push(u);
			if (((u = J()), u)) {
				for (i.push(u); (u = D()); ) i.push(u);
				if (s() || T() || v() || $())
					throw new Error(
						'Selector not allowed after pseudo-element selector.'
					);
			}
			if (i.length)
				return i.length > 1 ? { type: a.CompoundSelector, selectors: i } : i[0];
		}
		function N() {
			if (!r) return;
			let i = m() ? ' ' : '';
			for (; (r == null ? void 0 : r.type) === o.Delim; )
				(i += r.value), (r = c());
			return m(), i.length > 1 ? i.trim() : i;
		}
		function m() {
			let i = !1;
			for (; (r == null ? void 0 : r.type) === o.Whitespace; )
				(i = !0), (r = c());
			return i;
		}
		function s() {
			let i = f();
			if ((r == null ? void 0 : r.type) === o.Ident || y(r, '*')) {
				let u = { type: a.TypeSelector, identifier: r.value };
				return i !== void 0 && (u.namespace = i), (r = c()), u;
			}
		}
		function f() {
			if (r) {
				if (y(r, '|')) return (r = c()), '';
				if (
					((r == null ? void 0 : r.type) === o.Ident || y(r, '*')) &&
					y(w(), '|')
				) {
					let i = r.value;
					return (r = c()), (r = c()), i;
				}
			}
		}
		function v() {
			if ((r == null ? void 0 : r.type) === o.Hash) {
				let i = { type: a.IdSelector, identifier: r.value };
				return (r = c()), i;
			}
		}
		function T() {
			var i;
			if (y(r, '.') && ((i = w()) == null ? void 0 : i.type) === o.Ident) {
				r = c();
				let u = { type: a.ClassSelector, identifier: r.value };
				return (r = c()), u;
			}
		}
		function $() {
			if ((r == null ? void 0 : r.type) === o.BracketOpen) {
				(r = c()), m();
				let i = f();
				if ((r == null ? void 0 : r.type) !== o.Ident)
					throw new Error('Invalid attribute name');
				let u = { type: a.AttributeSelector, identifier: r.value };
				i !== void 0 && (u.namespace = i), (r = c()), m();
				let p = Z();
				if (p) {
					if (A.indexOf(p) < 0)
						throw new Error(`Unsupported attribute matcher: ${p}`);
					if (
						((u.matcher = p),
						m(),
						(r == null ? void 0 : r.type) === o.String ||
							(r == null ? void 0 : r.type) === o.Ident)
					)
						(u.value = r.value),
							r.type === o.String && (u.quotes = !0),
							(r = c());
					else throw new Error('Expected attribute value');
					m();
					let x = G();
					x && (u.modifier = x), m();
				}
				if (!r) return u;
				if (r.type === o.BracketClose) return (r = c()), u;
				throw new Error('Unclosed attribute selector');
			}
		}
		function Z() {
			if (y(r, '=')) {
				let i = r.value;
				return (r = c()), i;
			}
			if ((r == null ? void 0 : r.type) === o.Delim && y(w(), '=')) {
				let i = r.value;
				return (r = c()), (i += r.value), (r = c()), i;
			}
		}
		function G() {
			if (
				(r == null ? void 0 : r.type) === o.Ident &&
				/[iIsS]/.test(r.value || '')
			) {
				let i = r.value.toLowerCase();
				return (r = c()), i;
			}
		}
		function J() {
			var i;
			if (
				(r == null ? void 0 : r.type) === o.Colon &&
				((i = w()) == null ? void 0 : i.type) === o.Colon
			) {
				r = c();
				let u = D(!0);
				return (u.type = a.PseudoElementSelector), u;
			}
		}
		function D(i = !1) {
			var u, p;
			if (
				(r == null ? void 0 : r.type) === o.Colon &&
				(((u = w()) == null ? void 0 : u.type) === o.Ident ||
					((p = w()) == null ? void 0 : p.type) === o.Function)
			) {
				r = c();
				let x = { type: a.PseudoClassSelector, identifier: r.value };
				if (r.type === o.Function) {
					x.argument = [];
					let L = 1;
					for (; !g() && L; )
						(r = c()),
							r.type === o.ParenClose
								? (L -= 1)
								: (r.type === o.Function || r.type === o.ParenOpen) && (L += 1),
							L > 0 && x.argument.push(r);
					let I = d[(i ? '::' : ':') + x.identifier];
					if ((I && I !== h.None && (x.argument = Q(x.argument, I)), !r && L))
						throw new Error('Parentheses mismatch');
				}
				return (r = c()), x;
			}
		}
		function Q(i, u = h.None) {
			if (typeof u == 'function') return u(i);
			switch (u) {
				case h.SelectorList:
					return C(i, e);
				case h.AnPlusB:
					return i;
				case h.None:
					return i;
			}
			throw new Error(`Invalid argument syntax ${u}`);
		}
		return b();
	};
var k = (n, e) => {
		let t = typeof e == 'string' || Array.isArray(e) ? C(e) : e,
			r = n;
		for (; r && !S(r, t); ) r = r.parentElement;
		return r;
	},
	S = (n, e) => {
		let t = typeof e == 'string' || Array.isArray(e) ? C(e) : e;
		if (R[t.type]) return R[t.type](n, t);
		throw new Error(`Unsupported node type ${t.type}`);
	},
	V = (n, e) => {
		let t = typeof e == 'string' || Array.isArray(e) ? C(e) : e;
		return (n.ownerDocument || n)
			.createNodeIterator(n, 1, d => d !== n && S(d, t))
			.nextNode();
	};
var oe = (n, e) => e.selectors.some(t => S(n, t)),
	se = (n, e) => {
		if (!S(n, e.right)) return !1;
		switch (e.combinator) {
			case ' ':
				return n.parentNode && k(n.parentNode, e.left);
			case '>':
				return n.parentNode && S(n.parentNode, e.left);
			case '+':
				return n.previousElementSibling && S(n.previousElementSibling, e.left);
			case '~': {
				let t = n;
				for (; (t = t.previousElementSibling); ) if (S(t, e.left)) return !0;
				return !1;
			}
			default:
				throw new Error(`Unsupported combinator ${e.combinator}`);
		}
	},
	ue = (n, e) => e.selectors.every(t => S(n, t)),
	le = (n, e) => n.id === e.identifier,
	ce = (n, e) => n.classList.contains(e.identifier),
	ae = (n, e) => {
		if (!e.matcher) return n.hasAttribute(e.identifier);
		let t = n.getAttribute(e.identifier);
		if (!t) return !1;
		let r = e.value;
		switch (
			(e.modifier !== 's' && ((t = t.toLowerCase()), (r = r.toLowerCase())),
			e.matcher)
		) {
			case '=':
				return t === r;
			case '^=':
				return t.length >= r.length && t.indexOf(r) === 0;
			case '$=':
				return t.length >= r.length && t.indexOf(r) === t.length - r.length;
			case '*=':
				return t.length >= r.length && t.indexOf(r) > -1;
			case '~=':
				return t.split(/\s+/).some(d => d === r);
			case '|=':
				return t === r || t.indexOf(r + '-') === 0;
			default:
				throw new Error(`Unsupported attribute matcher ${e.matcher}`);
		}
	},
	fe = (n, e) => {
		switch (e.identifier) {
			case 'is':
			case 'where':
			case 'matches':
			case '-moz-any':
			case '-webkit-any':
				if (!e.argument) return !1;
				if (e.argument.type !== a.SelectorList)
					throw new Error('Expected a SelectionList argument');
				return e.argument.selectors.some(t => S(n, t));
			case 'not':
				if (!e.argument) return !0;
				if (e.argument.type !== a.SelectorList)
					throw new Error('Expected a SelectionList argument');
				return e.argument.selectors.every(t => !S(n, t));
			case 'has':
				if (!e.argument) return !1;
				if (e.argument.type !== a.SelectorList)
					throw new Error('Expected a SelectionList argument');
				return !!V(n, e.argument);
			case 'first-child':
				return H(n) === 0;
			case 'first-of-type':
				return j(n);
			case 'last-child':
				return W(n) === 0;
			case 'last-of-type':
				return K(n);
			case 'only-child':
				return !W(n) && !H(n);
			case 'only-of-type':
				return j(n) && K(n);
			case 'root':
				return n === (n.ownerDocument || n).documentElement;
			case 'empty':
				return (
					!n.childNodes.length ||
					(n.childNodes.length === 1 &&
						n.childNodes[0].nodeType === 3 &&
						n.childNodes[0].nodeValue.match(/^\s*$/))
				);
			case 'enabled':
				return !n.disabled;
			case 'disabled':
				return n.disabled;
			case 'link':
				return (
					(n.localName === 'a' ||
						n.localName === 'area' ||
						n.localName === 'link') &&
					n.hasAttribute('href')
				);
			case 'visited':
				return !1;
			case 'checked':
				return n.checked || n.selected;
			case 'indeterminate':
				return n.indeterminate;
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
				throw new Error(`Pseudo-class ${e.identifier} not implemented yet`);
		}
	},
	pe = () => {
		throw new Error('Pseudo-elements are not supported.');
	},
	he = (n, e) =>
		e.identifier !== '*' && n.localName !== e.identifier
			? !1
			: e.namespace === void 0 ||
				  e.namespace === '*' ||
				  (e.namespace === '' && n.prefix === null)
				? !0
				: n.prefix === e.namespace,
	H = n => {
		let e = 0,
			t = n;
		for (; (t = t.previousElementSibling); ) e++;
		return e;
	},
	W = n => {
		let e = 0,
			t = n;
		for (; (t = t.nextElementSibling); ) e++;
		return e;
	},
	j = n => {
		let e = n;
		for (; (e = e.previousElementSibling); )
			if (e.localName === n.localName && e.prefix === n.prefix) return !1;
		return !0;
	},
	K = n => {
		let e = n;
		for (; (e = e.nextElementSibling); )
			if (e.localName === n.localName && e.prefix === n.prefix) return !1;
		return !0;
	},
	R = {
		[a.SelectorList]: oe,
		[a.ComplexSelector]: se,
		[a.CompoundSelector]: ue,
		[a.TypeSelector]: he,
		[a.IdSelector]: le,
		[a.ClassSelector]: ce,
		[a.AttributeSelector]: ae,
		[a.PseudoClassSelector]: fe,
		[a.PseudoElementSelector]: pe
	};
export { C as parse, B as tokenize };
