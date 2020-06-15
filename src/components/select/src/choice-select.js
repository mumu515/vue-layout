import Utils from "@/components/utils";
import {ApiOptions} from "@/service/apiOptions";
// import commonMixins from "@/components/utils/mixins-common";
export const cacheData = {
	cache: [],
	get(key) {
		let item = this.cache.reduce((r, c, i) => {
			if (deepEquals(c.key, key)) {
				return c;
			}
			return r;
		}, null);
		return item ? item.value : undefined;
	},
	set(key, value) {
		let item = this.cache.reduce((r, c, i) => {
			if (deepEquals(c.key, key)) {
				return c;
			}
			return r;
		}, null);
		if (item) {
			item.value = value;
		} else {
			this.cache.push({
				key,
				value
			});
		}
	}
};
export default {
	name: "YChoiceSelect",
	// mixins: [commonMixins],
	props: {
		"listId": {},
		"value": {},
		"optionsPath": {},
		"valueKey": {},
		"filter": {default: () => ({})},
		"labelKey": {},
		"disabled": {}, //	是否禁用	boolean	—	false
	},
	data() {
		return {
			mOptions: [],
			isLoading: false,
			localFilter: JSON.stringify(this.filter)
		};
	},
	async created() {
		await this.init();
	},
	computed: {
		optionValueKey() {return "code";},
		optionLabelKey() {return this.labelKey || "name";}
	},
	watch: {
		filter: {
			handler: function(n, o) {
				if (!deepEquals(n, o)) {
					this.init();
				}
			},
			deep: true
		}
	},
	methods: {
		/**
		 * 在传入了options时,试用options作为下拉列表,否则根据listId获取choiceList选值列表
		 * @returns {Promise<void>}
		 */
		async init() {
			let d = {
				headers: this.filter.headers,
				params: {asOfDate: (this.filter.params || {}).asOfDate || new Date().mFormat("yyyyMMdd")}
			};
			let p = [
				this.listId,
				JSON.parse(JSON.stringify(d))
			];
			let data = cacheData.get(p) || {};
			if (deepEquals(data, {})) {
				data = (await ApiOptions.get.biz_choiceList(this.listId, d)).data;
				cacheData.set(p, data);
			}
			
			this.mOptions = data.choiceItems;
		},
		handleChange(v) {
			this.$emit("change", v);
		}
	},
	render(h) {
		// 若该组件model绑定至对象上 则 optionValueKey应为 undefined,托绑定到对象某一属性上,则optionValueKey应为属性名
		// optionLabelKey为要显示的label属性名,若没有设置,则直接显示model值
		let [optionValueKey, optionLabelKey] = [this.optionValueKey, this.optionLabelKey];
		let options = this.mOptions.map((option, index) => {
			let value = this.valueKey ? option : Utils.getEvalResult(option, optionValueKey);
			let label = Utils.getEvalResult(option, optionLabelKey);
			return <el-option
					key={index}
					label={label}
					value={value}></el-option>;
		});
		if (options.length === 0 && this.value) {
			options = [
				<el-option
						style={{display: "none"}}
						key="-1"
						label=" "
						value={this.value}></el-option>];
		}
		
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
};
