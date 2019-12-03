import "../utils/typeJudge";

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

let VueLayout = {};
VueLayout.install = function(Vue, options) {
	Object.keys(components).forEach((key) => {
		Vue.component(key, components[key]);
	});
};
export default VueLayout;
