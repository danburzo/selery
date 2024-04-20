import { NodeTypes } from './parse.js';
import { Tokens } from './tokenize.js';

/*
	Serialize an AST tree or array of tokens.

	https://drafts.csswg.org/css-syntax/#serialization
 */

export const serialize = (node, extra) => {
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
				(node.namespace === undefined ? '' : node.namespace + '|') +
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
					// Serialize as string
					out += `"${node.value.replace(/"/g, '\\"')}"`;
				} else {
					// Serialize as identifier
					out += node.value;
				}
				if (node.modifier) {
					out += ' ' + node.modifier;
				}
			}
			return out + ']';
		case NodeTypes.PseudoClassSelector:
			out = ':' + node.identifier;
			if (node.argument !== undefined) {
				out += '(' + serialize(node.argument, extra) + ')';
			}
			return out;
		case NodeTypes.PseudoElementSelector:
			out = '::' + node.identifier;
			if (node.argument !== undefined) {
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

export const serializeToken = tok => {
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
			// Escape unit if it conflicts with the scientific number notation
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
