import Vue from "vue";

export function generateFormConfig(processConfig, payload) {
	// console.log(processConfig);
	// console.log({...payload});
	let rootScope = processConfig.formConfig.scopes.find(i => i.scopeId === 1);
	if (rootScope) {
		rootScope.data = {...rootScope.data, ...payload};
	}
}

export async function getProcessConfigByRequest(processUrl, payload, localTemplate) {
	if (processUrl) {
		let processConfig = (await Vue.prototype.$JSONLayoutConfig.HTTP.fetch(processUrl)).data;
		//使用本地layout
		processConfig.formConfig = localTemplate;
		payload.process = {...processConfig};
		delete payload.process.formConfig;
		generateFormConfig(processConfig, payload);
		return processConfig;
	} else {
		let processConfig = {formConfig: localTemplate};
		generateFormConfig(processConfig, payload);
		return processConfig;
	}
}
