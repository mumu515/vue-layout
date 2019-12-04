import Vue from "vue";
import {getCookieByQuery} from "@/utils/auth";
import localStorage from "@/utils/localstorage";

export const ApiOptions = {
	get: {
		biz: ({objectCode = "", instanceId = ""},
					param = {
						depth: -1,
						asOfDate: "",
						uniqueKey: ""
					}) => Vue.prototype.$JSONLayoutConfig.HTTP.GET(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.get.biz.replace("${objectCode}", objectCode).replace("${instanceId}", instanceId), param),
		biz_choiceList: ({listInstanceId = ""},
										 {asOfDate}) => Vue.prototype.$JSONLayoutConfig.HTTP.GET(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.get.biz_choiceList.replace("${listInstanceId}", listInstanceId), {asOfDate}),
		biz_tree: ({objectCode = "", guid = ""}) => Vue.prototype.$JSONLayoutConfig.HTTP.GET(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.get.biz_tree.replace("${objectCode}", objectCode).replace("${guid}", guid), {}),
		meta_codes: (objectCode = "") => Vue.prototype.$JSONLayoutConfig.HTTP.GET(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.get.meta_codes.replace("${objectCode}", objectCode), {}),
		meta_object: (objectCode = "") => Vue.prototype.$JSONLayoutConfig.HTTP.GET(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.get.meta_object.replace("${objectCode}", objectCode), {}),
		meta_Reload: () => Vue.prototype.$JSONLayoutConfig.HTTP.GET(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.get.meta_Reload, {})
	},
	post: {
		biz_child: ({childObjectCode = "", parentObjectCode = ""},
								param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.post.biz_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz: (objectCode = "",
					param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.post.biz.replace("${objectCode}", objectCode), param),
		biz_search: (objectCode = "",
								 data = {},
								 {page = 1, pageSize = 10, asOfDate, depth} = {
									 page: 1,
									 pageSize: 10
								 }) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.post.biz_search.replace("${objectCode}", objectCode), data, {
			params: {
				page,
				pageSize,
				asOfDate,
				depth
			}
		}),
		biz_list: ({objectCode = ""},
							 param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.post.biz_list.replace("${objectCode}", objectCode), param),
		biz_tree_child: ({childObjectCode = "", parentObjectCode = ""},
										 param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.post.biz_tree_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz_tree: ({objectCode = ""},
							 param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.post.biz_tree.replace("${objectCode}", objectCode), param)
	},
	put: {
		biz: (objectCode = "",
					param = {}) => Vue.prototype.$JSONLayoutConfig.HTTP.PUT(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.put.biz.replace("${objectCode}", objectCode), param),
		biz_tree: ({objectCode = ""},
							 param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.POST(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.put.biz_tree.replace("${objectCode}", objectCode), param)
	},
	delete: {
		biz_child: ({childObjectCode = "", parentObjectCode = ""},
								param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.DELETE(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.delete.biz_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz: ({objectCode = "", instanceId = ""},
					param = {uniqueKey: ""}) => Vue.prototype.$JSONLayoutConfig.HTTp.DELETE(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.delete.biz.replace("${objectCode}", objectCode).replace("${instanceId}", instanceId), param),
		biz_tree_child: ({childObjectCode = "", parentObjectCode = ""},
										 param = {}) => Vue.prototype.$JSONLayoutConfig.HTTp.DELETE(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.delete.biz_tree_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz_tree: ({objectCode = "", guid = ""}) => Vue.prototype.$JSONLayoutConfig.HTTp.DELETE(Vue.prototype.$JSONLayoutConfig.CONSTANTS.URLS.delete.biz_tree.replace("${objectCode}", objectCode).replace("${guid}", guid), {})
	},
	custom: {
		updateMetaDataTypes: async () => {
			let tenantId = getCookieByQuery("tenantId");
			let result;
			let codes = localStorage.fetch("metaDataTypes_" + tenantId).codes;
			if (codes && codes.length > 0) {
				result = codes;
			} else {
				let data = (await ApiOptions.get.meta_codes("")).data;
				console.log("meta_codes:");
				console.log(data);
				localStorage.save("metaDataTypes_" + tenantId, data);
				result = data.codes;
			}
			return result;
		},
		updateMetaData: async (objectCode) => {
			let tenantId = getCookieByQuery("tenantId");
			let result;
			let local = localStorage.fetch(`metaData_${objectCode}_${tenantId}`).field;
			if (local) {
				result = local;
			} else {
				let data = (await ApiOptions.get.meta_object(objectCode)).data;
				localStorage.save(`metaData_${objectCode}_${tenantId}`, data);
				result = data.field;
			}
			return result;
		}
	}
};

