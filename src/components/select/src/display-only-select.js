import Utils from "@/components/utils";
import {ApiOptions} from "@/service/apiOptions";
import commonMixins from "@/components/utils/mixins-common";
import {cacheData as cacheDataC} from "./choice-select";
import {cacheData as cacheDataO} from "./object-select";

export default {
	name: "YDisplayOnlySelect",
	mixins: [commonMixins],
	props: {
		"objectCode": {},
		"listId": {},
		"value": {default: ""},
		"optionsPath": {},
		"valueKey": {},
		"labelKey": {},
		"filter": {default: () => ({})},
		optionValueKey: {default: ""}
	},
	data() {
		return {
			selectedObject: "",
			mOptions: [],
			total: 0,
			isLoading: false,
			pageSize: 10
		};
	},
	async created() {
		await this.init();
	},
	computed: {
		vModel() {
			return this.model || (this.elForm ? this.elForm.model : {});
		},
		mOptionValueKey() {
			return this.optionValueKey || (this.listId ? "code" : "instanceId");
		},
		optionLabelKey() {
			return this.labelKey || "name";
		},
		mValueKey() {
			if (typeJudge.isObject(this.value)) {
				return this.valueKey || this.mOptionValueKey;
			} else {
				return this.valueKey;
				
			}
		}
	},
	watch: {
		filter: {
			handler: function(n, o) {
				if (!deepEquals(n, o)) {
					this.init();
				}
			},
			deep: true
		},
		value: {
			handler: function(n, o) {
				if (!deepEquals(n, o)) {
					this.init();
				}
			},
			deep: true
		}
	},
	methods: {
		async init() {
			this.mOptions = [];
			if (this.objectCode) {
				
				let d = {
					headers: {...(this.filter.headers || {})},
					data: {
						...(this.filter.data || {}),
						[this.mOptionValueKey]: (this.mValueKey ? Utils.getEvalResult(this.value, this.mOptionValueKey) : this.value)
					},
					params: {
						depth: 3,
						page: 1,
						pageSize: this.pageSize,
						asOfDate: new Date().mFormat("yyyyMMdd"),
						...(this.filter.params || {})
					}
				};
				let p = [
					this.objectCode,
					JSON.parse(JSON.stringify(d))
				];
				let data = cacheDataO.get(p) || {};
				if (deepEquals(data, {})) {
					try {
						data = (await ApiOptions.post.biz_search(this.objectCode, d)).data;
						cacheDataO.set(p, data);
					} catch (e) {
					} finally {
					}
				}
				this.mOptions = data.instances;
			} else if (this.listId) {
				let d = {
					headers: this.filter.headers,
					params: {asOfDate: (this.filter.params || {}).asOfDate || new Date().mFormat("yyyyMMdd")}
				};
				let p = [
					this.listId,
					JSON.parse(JSON.stringify(d))
				];
				let data = cacheDataC.get(p) || {};
				if (deepEquals(data, {})) {
					data = (await ApiOptions.get.biz_choiceList(this.listId, d)).data;
					cacheDataC.set(p, data);
				}
				
				this.mOptions.push(...(data.choiceItems || []));
			}
		},
		async getSelectedObject() {
			let result;
			if (!this.value) {
				this.selectedObject = "";
				return;
			}
			if (typeJudge.isObject(this.value)) {
				//yt: 当value为object时,默认直接从value中读取显示值,省略了筛选mOption的步骤
				this.selectedObject = this.value;
				return;
			}
			if (this.mValueKey && !Utils.getEvalResult(this.value, this.mOptionValueKey)) {return;}
			result = (this.mOptions || []).find((item) => {
				return Utils.getEvalResult(item, this.mOptionValueKey) === (this.mValueKey ? Utils.getEvalResult(this.value, this.mOptionValueKey) : this.value);
			});
			this.selectedObject = result;
			return result;
		}
	},
	render(h) {
		this.getSelectedObject();
		return <span
				class={this.$attrs.class}
				style={this.$attrs.style}>
			{Utils.getEvalResult(this.selectedObject || {}, this.optionLabelKey) || ""}
		</span>;
	}
};
