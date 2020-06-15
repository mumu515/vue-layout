import YObjectSelect from "./src/object-select";
import YChoiceSelect from "./src/choice-select";
import YOptionsSelect from "./src/options-select";
import YDisplayOnlySelect from "./src/display-only-select";
import {ApiOptions} from "@/service/apiOptions";

let generateType = (optionsPath, tenantId) => {
	// console.log("generateType");
	// console.log(optionsPath, tenantId);
	let objectCode = "", listId = "";
	if (optionsPath) {
		let paths = optionsPath.split(".");
		if (paths.length === 1) {
			[objectCode, listId] = isNaN(parseFloat(paths[0])) ? [paths[0], ""] : ["", paths[0]];
		} else {
			let result = ApiOptions.custom.updateMetaData_sync(paths[0], tenantId);
			let field;
			for (let i = 0; i < paths.length; i++) {
				try {
					if (i === 0) {
						field = ApiOptions.custom.updateMetaData_sync(paths[i], tenantId);
					} else if (i === paths.length - 1) {
						field = field.find((f) => f.name === paths[i]);
					} else {
						field = ApiOptions.custom.updateMetaData_sync(field.find((f) => f.name === paths[i]).metaTargetObjectCode, tenantId);
					}
				} catch (e) {
					console.log(e);
					console.log(paths[i]);
					break;
				}
			}
			try {
				[objectCode, listId] = [field.metaTargetObjectCode, field.metaTargetListId === "0" ? "" : field.metaTargetListId];
			} catch (e) {
				console.log(e);
				console.log(paths);
				console.log(tenantId);
			}
		}
	}
	return [objectCode, listId];
};
let functionalSelect = {
	name: "YFunctionalSelect",
	functional: true,
	inject: {
		elForm: {default: ""}
	},
	render(h, context) {
		if (typeJudge.isObject(context.data.props.value) && context.data.props.displayOnly) {
			return h(YDisplayOnlySelect, {
				...context.data,
				props: context.data.props
			}, context.children);
		}
		context.data.props = context.data.props || {};
		if (context.data.props.options) {
			return h(YOptionsSelect, context.data, context.children);
			
		} else {
			
			let [objectCode, listId] = generateType(context.data.props.optionsPath, ((context.data.props.filter || {}).headers || {}).TenantId);
			if (objectCode || listId) {
				
				if (context.data.props.displayOnly) {
					return h(YDisplayOnlySelect, {
						...context.data,
						props: {
							...context.data.props,
							objectCode,
							listId
						}
					}, context.children);
				}
				if (objectCode) {
					// context.data.props.objectCode = objectCode;
					// console.log("YSelect=>return:");
					// console.log("YObjectSelect");
					return h(YObjectSelect, {
						...context.data,
						props: {
							...context.data.props,
							objectCode,
							listId
						}
					}, context.children);
				} else if (listId) {
					// context.data.props.listId = listId;
					// console.log("YSelect=>return:");
					// console.log("YChoiceSelect");
					return h(YChoiceSelect, {
						...context.data,
						props: {
							...context.data.props,
							objectCode,
							listId
						}
					}, context.children);
				}
			}
		}
	}
};
//添加ySelect这一层是为了防止在scopedSlot中渲染functional组件时$parent指向错误的问题
export default {
	name: "YSelect",
	inject: {
		elForm: {default: ""}
	},
	components: {"y-functional-select": functionalSelect},
	props: {
		"listId": {},
		"value": {},
		"optionsPath": {},
		"valueKey": {},
		"filter": {},
		"labelKey": {},
		"disabled": {},
		"objectCode": {},
		"remoteFilterKey": {},
		"displayOnly": {},
		"options": {},
		optionValueKey: {}
	},
	render(h) {
		let displayOnly;
		if (this.elForm) {displayOnly = this.elForm.displayOnly || this.elForm.$attrs.displayOnly;}
		return h("y-functional-select", {
			props: {
				...this.$props,
				displayOnly: (this.$props.displayOnly === undefined && displayOnly !== undefined) ? displayOnly : this.$props.displayOnly
			},
			on: this.$listeners
		});
	}
};
