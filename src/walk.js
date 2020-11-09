import { NodeTypes } from './parse';

export const walk = (ast, arg) => {
	let queue = [ast];
	let node;
	while (queue.length) {
		node = queue.shift();
		if (typeof arg === 'function') {
			arg(node);
		} else if (arg[node.type]) {
			arg[node.type](node);
		}
		switch (node.type) {
			case NodeTypes.SelectorList:
			case NodeTypes.CompoundSelector:
				if (node.selectors) {
					queue = queue.concat(node.selectors);
				}
				break;
			case NodeTypes.ComplexSelector:
				if (node.left) {
					queue.push(node.left);
				}
				if (node.right) {
					queue.push(node.right);
				}
				break;
			case NodeTypes.PseudoClassSelector:
			case NodeTypes.PseudoElementSelector:
				if (
					typeof node.argument === 'object' &&
					!Array.isArray(node.argument)
				) {
					queue.push(node.argument);
				}
		}
	}
};
