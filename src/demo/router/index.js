import VueRouter from "vue-router";
import common from "../views/common";
import Vue from "vue";

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
// "dynamic-import-webpack"/"dynamic-import-node" 可以解决动态导入的问题
let router;
switch (process.env.corehr_env_type) {
	case "dashboard":
		router = new VueRouter({
			mode: "history",
			base: "/dashboard/",
			routes: [
				{
					path: "/404",
					component: () => import(/* webpackChunkName: "404" */ "../views/errorPage/404")
				},
				{
					path: `/corehr`,
					component: common,
					name: `CorehrMeta`,
					// redirect: {name: `CorehrMetaIndex`},
					children: []
				}
			]
		});
		break;
	case "OP":
		router = new VueRouter({
			mode: "history",
			base: "/",
			routes: [
				{
					path: "/404",
					component: () => import(/* webpackChunkName: "404" */ "../views/errorPage/404")
				},
				{
					path: `/corehr`,
					component: common,
					name: `OPCorehrMeta`,
					children: []
				}
			]
		});
		break;
	case "portal":
		router = new VueRouter({
			mode: "history",
			base: "/portal/",
			routes: [
				{
					path: "/404",
					component: () => import(/* webpackChunkName: "404" */ "../views/errorPage/404")
				},
				{
					path: "/ele",
					component: () => import(/* webpackChunkName: "404" */ "../views/ele")
				},
				{
					path: "/test",
					component: () => import(/* webpackChunkName: "404" */ "../views/test")
				},
				{
					path: `/corehr/personalInfo`,
					component: common,
					name: `CorehrPersonalInfo`,
					redirect: {name: `CorehrPersonalInfoIndex`},
					children: []
				}
			]
		});
		break;
}
Vue.use(VueRouter);
export default router;
