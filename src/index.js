import "@/utils/typeJudge";
import "@/utils/jsAddFun";
import components from "@/components";
import Vue from "vue";
import registerRouter from "@/router";
import store from "@/store";

import "@/plugins/orgchart";
import "@/plugins/lodash";
import directives from "@/directives";
import mAxiosRetry from "@/plugins/axios-retry";

let vueJsonLayout = {
	install(Vue1, options = {}) {
		Vue.prototype.Vue1 = Vue1;
		Object.keys(components).forEach((key) => {Vue1.component(key, components[key]);});
		Object.keys(directives).forEach((key) => {Vue1.directive(key, directives[key]);});
		Vue.prototype.$JSONLayoutConfig = {
			request: options.request,
			CONSTANTS: {API_PATH: options.API},
			store: options.store,
			ENV_NOW: options.ENV_NOW
		};
		Vue.prototype.$JSONLayoutConfig.store.registerModule("corehr", store);
		registerRouter(options.router);
		mAxiosRetry(options.request);
		console.log("vueJsonLayout installed");
		
	}
};
export default vueJsonLayout;
