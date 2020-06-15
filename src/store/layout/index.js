import {getLayout} from "@/store/utils";
import {getCookieByQuery} from "@/utils/auth";
import {getLocalLayoutCodes, getLocalTemplates, getLocalTemplatesByCode} from "../utils";

export const layout = {
	namespaced: true,
	state: {
		templates: getLocalTemplates(),
		layoutCodes: getLocalLayoutCodes()
	},
	getters: {
		template: (state) => getLocalTemplatesByCode
	},
	actions: {
		async getProcessConfig({state, getters}, {layoutCode, configParams}) {
			let {payload = {}} = configParams;
			let {pageName = ""} = payload;
			
			if (pageName.indexOf("CorehrMeta") >= 0) {
			} else if (pageName.indexOf("CorehrPersonalInfo") >= 0) {
				payload.empId = getCookieByQuery("empId");	//todo
			}
			return (await getLayout(payload, layoutCode));
			
		}
	}
};

