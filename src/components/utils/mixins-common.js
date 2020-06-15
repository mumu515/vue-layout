import Utils from "@/components/utils";

export default {
	inject: {
		elForm: {default: ""},
		elFormItem: {default: ""},
		scope: {}
	},
	inheritAttrs: false,
	computed: {
		attr() {
			return Object.keys(this.$attrs).reduce((result, key) => {
				if (key !== "style" && key !== "class") {
					result[key] = this.$attrs[key];
				}
				return result;
			}, {});
		},
		vModel() {return this.model || (this.elForm || {}).model || {};},
		mSize() {
			return this.size || (this.elFormItem ? this.elFormItem.size : "") || (this.elForm ? this.elForm.size : "");
		}
	},
	methods: {
		getValue(defaultValue) {
			// console.log(this.scope.data, this.vModel, this.prop);
			let result = Utils.getEvalResultFor$(this.scope.data, this.vModel, this.prop);
			// console.log(`result:${result}`);
			
			if (result === undefined) {
				return defaultValue;
			}
			return result;
		}
	}
};
