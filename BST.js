class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
	}
}

class Tree {
	constructor(arr) {
		const properArr = [...new Set(arr)].sort((a, b) => a - b);
		this.root = buildTree(properArr, 0, properArr.length - 1);
	}

	insert = (newNode, node = this.root) => {
		if (!node) return new Node(newNode);

		if (newNode > node.data) {
			node.right = this.insert(newNode, node.right);
		} else if (newNode < node.data) {
			node.left = this.insert(newNode, node.left);
		}

		return node;
	};

	delete = (data, node = this.root) => {
		if (!node) return null;

		if (data > node.data) {
			node.right = this.delete(data, node.right);
		} else if (data < node.data) {
			node.left = this.delete(data, node.left);
		} else {
			if (!node.left && !node.right) {
				return null;
			}

			// IF IT HAS A LEFT CHILD
			if (!node.right) {
				return node.left;
			}

			// IF IT HAS A RIGHT CHILD
			if (!node.left) {
				return node.right;
			}

			// IF BOTH HAS CHILD
			const nextBiggest = this.getNextBiggest(node);
			node.data = nextBiggest.data;
			node.right = this.delete(nextBiggest.data, node.right);
		}
		return node;
	};

	getNextBiggest = (node) => {
		let current = node.right;

		while (current.left) {
			current = current.left;
		}

		return current;
	};

	find = (value, node = this.root) => {
		if (value === null) {
			return null;
		}

		if (value === node.data) {
			return node;
		}

		if (value > node.data) {
			return this.find(value, node.right);
		} else {
			return this.find(value, node.left);
		}
	};

	levelOrder = (callback) => {
		if (!callback || typeof callback !== "function") {
			throw Error("A callback function is required");
		}

		if (!this.root) {
			return;
		}

		const queue = [this.root];

		while (queue.length) {
			const node = queue.shift();
			callback(node);

			if (node.left) {
				queue.push(node.left);
			}

			if (node.right) {
				queue.push(node.right);
			}
		}
	};

	preOrder = (callback, node = this.root) => {
		if (!callback || typeof callback !== "function") {
			throw Error("A callback function is required");
		}

		if (!node) {
			return;
		}

		callback(node);
		this.preOrder(callback, node.left);
		this.preOrder(callback, node.right);
	};

	inOrder = (callback, node = this.root) => {
		if (!callback || typeof callback !== "function") {
			throw Error("A callback function is required");
		}

		if (!node) {
			return;
		}

		this.inOrder(callback, node.left);
		callback(node);
		this.inOrder(callback, node.right);
	};

	postOrder = (callback, node = this.root) => {
		if (!callback || typeof callback !== "function") {
			throw Error("A callback function is required");
		}

		if (!node) {
			return;
		}

		this.postOrder(callback, node.left);
		this.postOrder(callback, node.right);
		callback(node);
	};

	height = (node) => {
		if (!node) {
			return -1;
		}

		const leftH = this.height(node.left);
		const rightH = this.height(node.right);

		return Math.max(leftH, rightH) + 1;
	};

	depth = (node, root = this.root) => {
		if (node.data == root.data) {
			return 0;
		} else if (node.data < root.data) {
			return this.depth(node, root.left) + 1;
		} else if (node.data > root.data) {
			return this.depth(node, root.right) + 1;
		}
	};
	isBalanced = (node = this.root) => {
		if (!node) {
			return true;
		}

		const left = this.height(node.left);
		const right = this.height(node.right);

		if (Math.abs(left - right) > 1) {
			return false;
		}

		return this.isBalanced(node.left) && this.isBalanced(node.right);
	};

	rebalance = () => {
		const arr = [];

		this.inOrder((node) => {
			arr.push(node.data);
		});

		this.root = buildTree(arr, 0, arr.length - 1);
	};

	prettyPrint = (node, prefix = "", isLeft = true) => {
		if (node === null) {
			return;
		}
		if (node.right !== null) {
			this.prettyPrint(
				node.right,
				`${prefix}${isLeft ? "│   " : "    "}`,
				false
			);
		}
		console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
		if (node.left !== null) {
			this.prettyPrint(
				node.left,
				`${prefix}${isLeft ? "    " : "│   "}`,
				true
			);
		}
	};
}

function buildTree(arr, start, end) {
	if (start > end) {
		return null;
	}

	let mid = start + Math.floor((end - start) / 2);
	let node = new Node(arr[mid]);
	node.left = buildTree(arr, start, mid - 1);
	node.right = buildTree(arr, mid + 1, end);

	return node;
}
