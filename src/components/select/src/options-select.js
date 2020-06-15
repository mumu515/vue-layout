export default {
	name: "YOptionsSelect",
	props: {
		"value": {},
		"displayOnly": {},
		"options": {},
		"valueKey": {default: "value"},
		"labelKey": {default: "label"}
	},
	data() {
		return {};
	},
	computed: {
		mOptions() {
			return (this.options || []).map((item, index) => {
				if (typeJudge.isString(item) || typeJudge.isNumber(item) || typeJudge.isBoolean(item)) {
					return {
						[this.labelKey]: item,
						[this.valueKey]: item
					};
				} else {
					return item;
				}
			});
		},
		selectedObject() {
			return (this.mOptions || []).find((item, index) => {
				return item[this.valueKey] === this.value;
			}) || {};
		}
	},
	methods: {
		handleChange(v) {
			this.$emit("change", v);
		}
	},
	render(h) {
		if (this.displayOnly) {
			return <span
					class={this.$attrs.class}
					style={this.$attrs.style}>
			{this.selectedObject[this.labelKey]}
		</span>;
		} else {
			let options = this.mOptions.map((option, index) => {
				return <el-option
						key={index}
						label={option[this.labelKey]}
						value={option[this.valueKey]}></el-option>;
			});
			return <el-select
					class={this.$attrs.class}
					style={this.$attrs.style}
					{...{
						props: {
							...this._props,
							filterable: true,
							"default-first-option": true,
							value: this.value,
							"value-key": this.valueKey,
							clearable: true
						}
					}}
					{...{attrs: this.attrs}}
					onChange={this.handleChange}>
				{options}
			</el-select>;
		}
	}
};
