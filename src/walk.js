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
			case 'SelectorList':
			case 'CompoundSelector':
				if (node.selectors) {
					queue = queue.concat(node.selectors);
				}
				break;
			case 'ComplexSelector':
				if (node.left) {
					queue.push(node.left);
				}
				if (node.right) {
					queue.push(node.right);
				}
				break;
		}
	}
};
