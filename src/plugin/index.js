import "@/utils/typeJudge";
import "@/utils/jsAddFun";
import {fetch, mdelete, post, put} from "@/service/myHttp";
import request from "@/service/gatewayRequest";
import store from "@/store";
import components from "@/components";


let vueJsonLayout = {};
vueJsonLayout.install = function(Vue, options = {}) {
	console.log(Vue.prototype);
	Vue.prototype.$JSONLayoutConfig = {};
	Vue.prototype.$JSONLayoutConfig.request = options.request || request;
	Vue.prototype.$JSONLayoutConfig.CONSTANTS = {API_PATH: options.API};
	Vue.prototype.$JSONLayoutConfig.HTTP = options.HTTP || {
		GET: fetch,
		DELETE: mdelete,
		POST: post,
		PUT: put
	};
	Object.keys(components).forEach((key) => {Vue.component(key, components[key]);});
	
	Vue.prototype.$JSONLayoutConfig.store = options.store;
	Vue.prototype.$JSONLayoutConfig.store.registerModule("corehr", store);
};
export default vueJsonLayout;
