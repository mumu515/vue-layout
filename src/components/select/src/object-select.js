import Utils from "@/components/utils";
import {ApiOptions} from "@/service/apiOptions";

export const cacheData = {
	cache: [],
	get(key) {
		// console.log(this.cache);
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
	name: "YObjectSelect",
	props: {
		"objectCode": {},
		"value": {default: ""},
		"optionsPath": {},
		"valueKey": {},
		"remoteFilterKey": {},
		"filter": {default: () => ({})},
		"labelKey": {},
	},
	inject: {
		elForm: {default: ""}
	},
	data() {
		return {
			selectedObject: {},
			remoteList: [],
			loadList: [],
			isRemote: false,
			isLoading: false,
			isLoadingMore: false,
			optionValueKey: "instanceId",
			total: 0
		};
	},
	async created() {
		await this.init();
	},
	computed: {
		optionLabelKey() {return this.labelKey || "name";},
		mOptions() {return this.isRemote ? this.remoteList : this.loadList;},
		nextPage() {return Math.ceil(this.loadList.length / 10) === this.loadList.length / 10 ? this.loadList.length / 10 + 1 : 0;}
	},
	watch: {
		value: {
			handler: function(n, o) {
				console.log("select value changed");
				console.log("select value changed:n", n);
				console.log("select value changed:o", o);
				this.init();
				// if(n){
				// 	this.getListByValue();
				// }
			}
			// deep: true
		},
		filter: {
			handler: function(n, o) {
				if (!deepEquals(n, o)) {
					if (this.value) {
						this.getListByValue();
					}
					this.loadList = [];
					this.loadMore();
				}
			},
			deep: true
		}
	},
	methods: {
		async init() {
			if (this.value) {
				await this.getListByValue();
			} else {
				this.loadList = [];
				await this.loadMore();
			}
		},
		/**
		 * 根据当前选中值,获取选中option
		 * @returns {Promise<void>}
		 */
		async getListByValue() {
			try {
				this.isLoading = true;
				let data = await this.apiSearch({[this.optionValueKey]: this.getValueString()}, 1, 100);
				this.remoteList = data.instances || [];
				this.isRemote = true;
			} finally {
				this.isLoading = false;
			}
		},
		/**
		 * 懒加载模式下,加载下一页
		 */
		async loadMore() {
			if (this.nextPage) {
				try {
					this.isLoadingMore = true;
					let data = await this.apiSearch({}, this.nextPage);
					this.loadList.push(...(data.instances || []));
					this.total = data.total || 0;
					this.isRemote = false;
				} finally {
					this.isLoadingMore = false;
				}
			}
		},
		/**
		 * 根据objectCode 以及相关搜索项,获取下拉列表
		 * @param requestData
		 * @param page
		 * @param pageSize
		 * @returns {Promise<void>}
		 */
		async apiSearch(requestData, page, pageSize) {
			let d = {
				headers: {...(this.filter.headers || {})},
				data: {...(this.filter.data || {}), ...requestData},
				params: {
					depth: 3,
					page: page || 1,
					pageSize: pageSize || 10,
					asOfDate: new Date().mFormat("yyyyMMdd"),
					...(this.filter.params || {})
				}
			};
			let p = [
				this.objectCode,
				JSON.parse(JSON.stringify(d))
			];
			let data = cacheData.get(p) || {};
			if (deepEquals(data, {})) {
				try {
					data = (await ApiOptions.post.biz_search(this.objectCode, d)).data;
					cacheData.set(p, data);
				} catch (e) {
				} finally {
				}
			} else {
				return new Promise((resolve, reject) => {
					resolve(data);
				});
			}
			return data;
		},
		/**
		 * 清空select选中时,将下拉搜索结果删除,显示懒加载列表
		 */
		onClear() {
			this.isRemote = false;
		},
		/**
		 * 获取焦点时,检查是否上一次获取焦点搜索后没有选中任何值,导致下拉列表\与当前选中项不符
		 */
		async onFocus() {
			if (this.isRemote) {
				if (this.value) {
					if (!this.mOptions.find((option) => {
						return option && (this.valueKey ? option : Utils.getEvalResult(option, this.optionValueKey)) === this.value;
					})) {
						await this.getListByValue();
					}
				} else {
					this.isRemote = false;
				}
			} else {
			}
		},
		mRemoteMethod(query) {
			if (query) {
				this.isRemote = true;
				this.isLoading = true;
				this.apiSearch({[this.remoteFilterKey || this.optionLabelKey]: query}).then((data) => {
					this.isLoading = false;
					try {
						this.remoteList = data.instances || [];
					} catch (e) {
						this.remoteList = [];
					}
				}).catch(() => {
					this.isLoading = false;
				});
			} else {
				this.apiSearch({}).then((data) => {
					this.isLoading = false;
					try {
						this.remoteList = data.instances || [];
						this.total = data.total || 0;
					} catch (e) {
						this.remoteList = [];
					}
				}).catch(() => {
					this.isLoading = false;
				});
			}
		},
		/**
		 * select绑定的model值是string则直接返回,是object时则根据optionValueKey返回对应标识
		 * @returns {string}
		 */
		getValueString() { return this.valueKey ? this.value[this.optionValueKey] : this.value;},
		handleChange(v) {
			console.log("object-select:change")
			this.$emit("change", v);
		}
	},
	render(h) {
		let options = this.mOptions.filter(i => i).map((option, index) => {
			let value = this.valueKey ? option : Utils.getEvalResult(option, this.optionValueKey);
			// console.log("optionLabelKey");
			// console.log(this.optionLabelKey);
			// console.log("option");
			// console.log(option);
			// if(this.optionLabelKey.startsWith("$")){
			//   debugger;
			// }
			let label = Utils.getEvalResult(option, this.optionLabelKey);
			// console.log("label");
			// console.log(label);
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
						remote: true,
						"remote-method": this.mRemoteMethod,
						value: this.value,
						clearable: true,
						loading: this.isLoading
					}
				}} {...{attrs: this.attrs}}
				onClear={this.onClear}
				onChange={this.handleChange}
				onFocus={this.onFocus}>
			{options}
			{((!this.isRemote) && this.total > this.mOptions.length) ? <el-button
					type="text"
					loading={this.isLoadingMore}
					onClick={this.loadMore}>加载更多</el-button> : undefined}
		</el-select>;
	}
};
