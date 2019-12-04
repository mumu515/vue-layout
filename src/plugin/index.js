import "@/utils/typeJudge";
import "@/utils/jsAddFun";
import localStorage from "@/utils/localstorage";
import {fetch, mdelete, post, put} from "@/service/myHttp";

let components = {};
const requireComponent = require.context(
		"../components",		// 其组件目录的相对路径
		true, // 是否查询其子目录
		/.*(\/).+(\/index\.js)$/ // 匹配基础组件文件名的正则表达式
);
requireComponent.keys().forEach((fileName) => {
	const componentConfig = requireComponent(fileName);	// 获取组件配置
	components[componentConfig.default.name] = componentConfig.default;
});

let vueJsonLayout = {};
vueJsonLayout.install = function(Vue, options = {}) {
	console.log(options);
	Vue.$JSONLayoutConfig = options;
	Vue.$JSONLayoutConfig.HTTP = options.HTTP || {
		GET: fetch,
		DELETE: mdelete,
		POST: post,
		PUT: put
	};
	Vue._localStorage = localStorage;
	Object.keys(components).forEach((key) => {
		Vue.component(key, components[key]);
	});
};
export default vueJsonLayout;
