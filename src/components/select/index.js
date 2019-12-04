import {ApiOptions} from "@/service/apiOptions";
import YObjectSelect from "./src/object-select";
import YChoiceSelect from "./src/choice-select";
import YDisplayOnlySelect from "./src/display-only-select";
import commonMixins from "@/components/mixins-common";

export default {
	name: "YSelect",
	mixins: [commonMixins],
	props: [
		"model",
		"prop",
		"displayOnly",
		"options",
		"optionsPath",
		"valueKey",
		"remoteFilterKey",
		"filter",
		"defaultValue",
		
		// "optionValueKey",
		"labelKey",
		"multiple", //	是否多选	boolean	—	false
		"disabled", //	是否禁用	boolean	—	false
		"value-key", //	作为 value 唯一标识的键名，绑定值为对象类型时必填	string	—	value
		"size", //	输入框尺寸	string	large/small/mini	—
		"clearable", //	单选时是否可以清空选项	boolean	—	false
		"collapse-tags", //	多选时是否将选中值按文字的形式展示	boolean	—	false
		"multiple-limit", //	多选时用户最多可以选择的项目数，为 0 则不限制	number	—	0
		"name	select", // input 的 name 属性	string	—	—
		"placeholder", //	占位符	string	—	请选择
		"filterable", //	是否可搜索	boolean	—	false
		"allow-create", //	是否允许用户创建新条目，需配合 filterable 使用	boolean	—	false
		"filter-method", //	自定义搜索方法	function	—	—
		"remote", //	是否为远程搜索	boolean	—	false
		// "remote-method", //	远程搜索方法	function	—	—
		"loading", //	是否正在从远程获取数据	boolean	—	false
		"loading-text", //	远程加载时显示的文字	string	—	加载中
		"no-match-text", //	搜索条件无匹配时显示的文字	string	—	无匹配数据
		"no-data-text", //	选项为空时显示的文字	string	—	无数据
		"popper-class", //	Select 下拉框的类名	string	—	—
		"reserve-keyword", //	多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词	boolean	—	false
		"default-first-option" //	在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用	boolean	-	false
	],
	data() {
		return {
			objectCode: "",
			listId: ""
		};
	},
	methods: {},
	async created() {
		if (this.optionsPath) {
			let paths = this.optionsPath.split(".");
			if (paths.length === 1) {
				[this.objectCode, this.listId] = isNaN(parseFloat(paths[0])) ? [paths[0], ""] : ["", paths[0]];
			} else {
				let result = await ApiOptions.custom.updateMetaData(paths[0]);
				// let field = paths.reduce((r, c, i) => {
				//   return i === 0 ? result : r.find((f) => {
				//     try {
				//       return f.name === c;
				//     } catch (e) {
				//       console.log(e);
				//     }
				//   });
				// }, []);
				let field;
				for (let i = 0; i < paths.length; i++) {
					if (i === 0) {
						field = await ApiOptions.custom.updateMetaData(paths[i]);
					} else if (i === paths.length - 1) {
						field = field.find((f) => f.name === paths[i]);
					} else {
						field = await ApiOptions.custom.updateMetaData(field.find((f) => f.name === paths[i]).metaTargetObjectCode);
					}
				}
				[this.objectCode, this.listId] = [field.metaTargetObjectCode, field.metaTargetListId === "0" ? "" : field.metaTargetListId];
			}
		}
	},
	render(h) {
		if (this.objectCode || this.listId) {
			if (this.displayOnly) {
				if (!this.getValue()) {
					return;
				}
				return h(YDisplayOnlySelect, {
					props: {
						...this._props,
						objectCode: this.objectCode,
						listId: this.listId
					},
					attrs: this.$attrs
				});
			}
			
			if (this.objectCode) {
				return h(YObjectSelect, {
					props: {
						...this._props,
						objectCode: this.objectCode
					},
					attrs: this.$attrs
				});
			} else if (this.listId) {
				return h(YChoiceSelect, {
					props: {
						...this._props,
						listId: this.listId
					},
					attrs: this.$attrs
				});
			}
		}
		
	}
};
