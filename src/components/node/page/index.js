import nodeLayout from "./layout";

export default {
	name: "YNodePage",
	inheritAttrs: false,
	props: {
		layout: {
			type: Object,
			default: () => ({})
		}
	},
	provide() {
		return {
			scope: this.getScopes
		};
	},
	inject: {
		parentScope: {
			from: "scope",
			default: () => ({})
		}
	},
	methods: {
		generateScope(scope) {
			let result = {};
			return scope;
			
		}
	},
	render(h) {
		let self = this;
		return h(nodeLayout, {props: {layout: this.layout}});
	}
};
