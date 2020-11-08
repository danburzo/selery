import { tokenize, TOKENS } from './tokenize';
import { walk } from './walk';

const RECURSIVE_FNS = [':is', ':where', ':not', '::slotted'];

export const parse = (arg, options = {}) => {
	const tokens = typeof arg === 'string' ? tokenize(arg) : arg;

	const wants_recursive = options.recursive;
	const has_potentially_recursive = false;
	const recursive_fns = new Set(
		Array.isArray(options.recursive)
			? [...RECURSIVE_FNS, ...options.recursive]
			: RECURSIVE_FNS
	);

	let tok;

	const ComplexSelectorList = () => {};
	const ComplexSelector = () => {};
	const CompoundSelector = () => {};
	const RelativeSelector = () => {};

	const TypeSelector = () => {};
	const SubclassSelector = () => {};

	const PseudoElementSelector = () => {
		has_potentially_recursive = true;
	};
	const PseudoClassSelector = () => {
		has_potentially_recursive = true;
	};

	const Combinator = () => {};

	const IdSelector = () => {};
	const ClassSelector = () => {};
	const AttributeSelector = () => {};

	const WqName = () => {};
	const AttrMatcher = () => {};
	const AttrModifier = () => {};

	let ast = ComplexSelectorList();

	if (wants_recursive && has_potentially_recursive) {
		walk(ast, {
			PseudoClassSelector(node) {
				if (recursive_fns.has(':' + node.identifier)) {
					node.argument = parse(node.argument, options);
				}
			},
			PseudoElementSelector(node) {
				if (recursive_fns.has('::' + node.identifier)) {
					node.argument = parse(node.argument, options);
				}
			}
		});
	}

	return ast;
};
