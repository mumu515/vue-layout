import {getCookieByQuery} from "@/utils/auth";
import localStorage from "@/utils/localstorage";
import {CONSTANTS} from "@/utils/constants";
import {fetch, mdelete, post, put} from "@/service/myHttp";
import {generateHeaders} from "@/service/myHttp";

let HTTP = {
	GET: fetch,
	DELETE: mdelete,
	POST: post,
	PUT: put
};
export const ApiOptions = {
	get: {
		biz: ({objectCode = "", instanceId = ""},
					param = {
						depth: -1,
						asOfDate: "",
						uniqueKey: ""
					}) => HTTP.GET(CONSTANTS.URLS.get.biz.replace("${objectCode}", objectCode).replace("${instanceId}", instanceId), param),
		biz_choiceList: (listInstanceId = "",
										 config) => HTTP.GET(CONSTANTS.URLS.get.biz_choiceList.replace("${listInstanceId}", listInstanceId), {}, config),
		biz_tree: ({objectCode = "", guid = ""}) => HTTP.GET(CONSTANTS.URLS.get.biz_tree.replace("${objectCode}", objectCode).replace("${guid}", guid), {}),
		meta_codes: (objectCode = "", config) => HTTP.GET(CONSTANTS.URLS.get.meta_codes.replace("${objectCode}", objectCode), {}, config),
		meta_object: (objectCode = "", config) => HTTP.GET(CONSTANTS.URLS.get.meta_object.replace("${objectCode}", objectCode), {}, config),
		meta_Reload: () => HTTP.GET(CONSTANTS.URLS.get.meta_Reload, {}),
		getAutoId: (count) => HTTP.GET(CONSTANTS.URLS.get.getAutoId.replace("${count}", count), {})
	},
	post: {
		biz_child: ({childObjectCode = "", parentObjectCode = ""},
								param = {}) => HTTP.POST(CONSTANTS.URLS.post.biz_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz: (objectCode = "",
					param = {}) => HTTP.POST(CONSTANTS.URLS.post.biz.replace("${objectCode}", objectCode), param),
		biz_search: (objectCode = "", config = {}) => HTTP.POST(CONSTANTS.URLS.post.biz_search.replace("${objectCode}", objectCode), {}, config),
		biz_list: ({objectCode = ""},
							 param = {}) => HTTP.POST(CONSTANTS.URLS.post.biz_list.replace("${objectCode}", objectCode), param),
		biz_tree_child: ({childObjectCode = "", parentObjectCode = ""},
										 param = {}) => HTTP.POST(CONSTANTS.URLS.post.biz_tree_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz_tree: ({objectCode = ""},
							 param = {}) => HTTP.POST(CONSTANTS.URLS.post.biz_tree.replace("${objectCode}", objectCode), param)
	},
	put: {
		biz: (objectCode = "",
					param = {}) => HTTP.PUT(CONSTANTS.URLS.put.biz.replace("${objectCode}", objectCode), param),
		biz_tree: ({objectCode = ""},
							 param = {}) => HTTP.POST(CONSTANTS.URLS.put.biz_tree.replace("${objectCode}", objectCode), param)
	},
	delete: {
		biz_child: ({childObjectCode = "", parentObjectCode = ""},
								param = {}) => HTTP.DELETE(CONSTANTS.URLS.delete.biz_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz: ({objectCode = "", instanceId = ""},
					param = {uniqueKey: ""}) => HTTP.DELETE(CONSTANTS.URLS.delete.biz.replace("${objectCode}", objectCode).replace("${instanceId}", instanceId), param),
		biz_tree_child: ({childObjectCode = "", parentObjectCode = ""},
										 param = {}) => HTTP.DELETE(CONSTANTS.URLS.delete.biz_tree_child.replace("${childObjectCode}", childObjectCode).replace("${parentObjectCode}", parentObjectCode), param),
		biz_tree: ({objectCode = "", guid = ""}) => HTTP.DELETE(CONSTANTS.URLS.delete.biz_tree.replace("${objectCode}", objectCode).replace("${guid}", guid), {})
	},
	custom: {
		updateMetaDataTypes: async (tenantId) => {
			let t = tenantId || getCookieByQuery("tenantId");
			let result;
			let codes = localStorage.fetch("metaDataTypes_" + t).codes;
			if (codes && codes.length > 0) {
				result = codes;
			} else {
				let data = (await ApiOptions.get.meta_codes("", {headers: {TenantId: t}})).data;
				console.log("meta_codes:");
				console.log(data);
				localStorage.save("metaDataTypes_" + t, data);
				result = data.codes;
			}
			return result;
		},
		updateMetaData: async (objectCode, callback, tenantId) => {
			let t = tenantId || getCookieByQuery("tenantId");
			let result;
			let local = localStorage.fetch(`metaData_${objectCode}_${t}`).field;
			if (local) {
				result = local;
				try { callback(false);} catch (e) { }
			} else {
				let data = (await ApiOptions.get.meta_object(objectCode, {headers: {TenantId: t}})).data;
				localStorage.save(`metaData_${objectCode}_${t}`, data);
				result = data.field;
				try { callback(true);} catch (e) { }
			}
			return result;
		},
		getMetaData: (objectCode, tenantId) => {
			let t = tenantId || generateHeaders().TenantId;
			let result = localStorage.fetch(`metaData_${objectCode}_${t}`).field;
			return result;
		},
		updateMetaData_sync: (objectCode, tenantId) => {
			let t = tenantId || generateHeaders().TenantId;
			let result = localStorage.fetch(`metaData_${objectCode}_${t}`).field;
			return result;
		}
	}
};

