import {generateMethods, generateNode, vIf} from "./layoutUtils";
import baseMixin from "./layoutMethods";

export default {
	name: "YNodeLayout",
	inheritAttrs: false,
	props: ["layout"],
	mixins: [baseMixin],
	provide() {
		return {pageNode: this};
	},
	inject: {
		scrollToTop: {
			from: "scrollToTop",
			default: () => {}
		}
	},
	data() {
		//以 _ 或 $ 开头的属性不会被Vue实例代理，因为它们可能和Vue内置的属性、API 方法冲突。你可以使用例如 vm.$data._property 的方式访问这些属性。
		return this.layout.scope.data;
	},
	computed: {
		_isScopeLayout: function() {
			return true;
		},
		_parent: function() {
			let findParent = (n) => {
				if (n._isScopeLayout) {
					return n;
				} else if (n.$parent) {
					return findParent(n.$parent);
				}
			};
			return findParent(this.$parent);
		}
	},
	watch: {
		"layout": {
			handler: function(n, o) {
				try {
					if (!deepEquals(n.scope.data, o.scope.data)) {
						Object.keys(this.layout.scope.data).forEach((key) => {
							console.log(key);
							this[key] = this.layout.scope.data[key];
						});
					}
				} catch (e) { }
			},
			deep: true
		}
	},
	created() {
		this.isReloaded = true;
		let scopeMethods = generateMethods(this, this.layout.scope.methods);
		Object.keys(scopeMethods).forEach((key) => {
			this[key] = scopeMethods[key];
		});
		if (this.init) {
			try {
				let r = this.init();
			} catch (e) {
			}
		} else {
		}
	},
	methods: {
		getFromTree(a) {
			if (this[a] !== undefined) {
				return this[a];
			}
			if (this._parent) {
				return this._parent.getFromTree(a);
			}
		},
		method(name, ...args) {
			if (this[name]) {
				console.debug(`以method形式调用 ${name} 方法:`);
				return this[name](...args);
			} else {
				if (this._parent) {
					return this._parent.method(...arguments);
				} else {
					throw new Error(`没有找到名为${name}的方法`);
				}
			}
		}
	},
	render(h) {
		if (this.isReloaded) {
			let createNode = (node) => {
				if (vIf(this, node)) {
					return h(node.nodeType, generateNode(this, node), (node.children || []).map(child => createNode(child)));
				}
			};
			let layout = JSON.parse(JSON.stringify(this.layout, function(key, val) {
				if (key === "scope") {
					return;
				}
				return val;
			}));
			let scope = this.layout.scope;
			return createNode({
				...layout,
				scope
			});
		} else {
			return "";
		}
	}
};
