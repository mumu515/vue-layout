import ObjectLayout from "@/views/ObjectLayout";
import KeepAliveObjectLayout from "@/views/KeepAliveObjectLayout";
import {setCookieByQuery} from "@/utils/auth";

export default function(router) {
	let customRoutes = [];
	router.options.routes.forEach((item, index) => {
		if (item.name === "CorehrMeta") {//dashboard
			item.children = [
				{
					path: `:objectCode`,
					name: `CorehrMetaObject`,
					tag: `CorehrMetaObject`,
					hidden: false,
					// redirect({params}) {return {name: `CorehrMetaObjectIndex`};},
					component: {template: "<corehr-root><router-view></router-view></corehr-root>"},
					children: [
						{
							path: `index`,
							name: `CorehrMetaObjectIndex`,
							tag: `CorehrMetaObjectIndex`,
							meta: {},
							component: ObjectLayout,
							props({params: {objectCode}}) {
								return {
									layoutCode: `meta__${objectCode.toLowerCase()}__home`,
									configParams: {payload: {pageName: "CorehrMetaObjectIndex"}}
									
								};
							},
							children: [
								{
									path: `:pageType`,
									name: `CorehrMetaObjectLayout`,
									meta: {
										showTitle: false,
										tag: `first-hr-dashboard`
									},
									props({params: {pageType, objectCode}}) {return {layoutCode: `meta__${objectCode.toLowerCase()}__${pageType}`};},
									component: ObjectLayout
								}
							]
						}
					]
				}];
			item.meta = item.meta || {};
			item.meta.generateSubMenu = () => {
				let children = [
					{
						path: "ORGANIZATION/index/list",
						title: "组织"
					},
					{
						path: "MANAGEMENT_LEVEL/index/list",
						title: "职级"
					},
					{
						path: "JOB/index/list",
						title: "职务"
					},
					{
						path: "POSITION/index/list",
						title: "职位"
					},
					{
						path: "GRADE/index/list",
						title: "薪等"
					},
					{
						path: "STEP/index/list",
						title: "薪级"
					},
					{
						path: "PAY_COMPONENT/index/list",
						title: "基本薪酬项"
					},
					{
						path: "EMPLOYEE/index/list",
						title: "人员管理"
					}
				];
				console.log(children);
				return children;
			};
			customRoutes.push({
				index,
				route: item
			});
		} else if (item.name === "OPCorehrMeta") {//OP
			item.children = [
				{
					path: `operation`,
					name: `OPCorehrMetaObject`,
					tag: `OPCorehrMetaObject`,
					meta: {
						code: "COREHR_OPERATION",
						title: "CoreHR运维中心"
					},
					// component: {template: "<el-main><router-view></router-view></el-main>"},
					component: ObjectLayout,
					props({params: {pageType}}) {
						return {layoutCode: `OP__home`};
					},
					children: [
						{
							path: `basic`,
							name: `OPCorehrMetaObjectBasic`,
							meta: {
								code: "COREHR_OPERATION_BASIC",
								title: "基本配置"
							},
							component: {template: "<router-view></router-view>"},
							children: [
								{
									path: `GENERAL_SETTING`,
									name: `OPCorehrMetaObjectBasicIndex`,
									meta: {
										code: "COREHR_OPERATION_BASIC_GENERAL_SETTING",
										title: "基本配置"
									},
									component: ObjectLayout,
									props({params: {pageType}}) {
										return {layoutCode: `OP__general_setting__home`};
									},
									children: [
										{
											path: `:pageType`,
											name: `OPCorehrGeneralSettingLayout`,
											meta: {
												defaultParams: {pageType: "view"},
												init: (p, q) => {
													return {
														code: "COREHR_OPERATION_BASIC_GENERAL_SETTING_view"
													};
												}
											},
											props({params: {pageType}}) {
												return {layoutCode: `OP__general_setting__${pageType}`};
											},
											component: ObjectLayout
										}
									]
								},
								{
									path: `CHOICE_LIST`,
									name: `OPCorehrMetaObjectChoice`,
									tag: `OPCorehrMetaObjectChoice`,
									meta: {
										code: "COREHR_OPERATION_BASIC_CHOICE_LIST",
										title: "选择列表"
									},
									component: ObjectLayout,
									props({params: {pageType}}) {
										return {layoutCode: `OP__choice_list__home`};
									},
									children: [
										{
											path: `:pageType`,
											name: `OPCorehrChoiceListLayout`,
											meta: {
												defaultParams: {pageType: "list"},
												init: (p, q) => {
													return {
														code: "COREHR_OPERATION_BASIC_CHOICE_LIST_list"
													};
												}
											},
											props({params: {pageType}}) {
												return {layoutCode: `OP__choice_list__${pageType}`};
											},
											component: ObjectLayout
										}
									]
								},
								{
									path: `WEB_PAGE`,
									name: `OPCorehrMetaObjectWebPage`,
									tag: `OPCorehrMetaObjectWebPage`,
									meta: {
										code: "COREHR_OPERATION_BASIC_WEB_PAGE",
										title: "页面"
									},
									component: ObjectLayout,
									props({params: {pageType}}) {
										return {layoutCode: `OP__web_page__home`};
									},
									children: [
										{
											path: `:pageType`,
											name: `OPCorehrWebPageLayout`,
											meta: {
												defaultParams: {pageType: "list"},
												init: (p, q) => {
													return {
														code: "COREHR_OPERATION_BASIC_WEB_PAGE_list"
													};
												}
											},
											props({params: {pageType}}) {
												return {layoutCode: `OP__web_page__${pageType}`};
											},
											component: ObjectLayout
										}
									]
								}
							]
						},
						{
							path: `internationalization`,
							name: `OPCorehrMetaObjectInter`,
							tag: `OPCorehrMetaObjectInter`,
							meta: {
								code: "COREHR_OPERATION_INTERNATIONALIZATION",
								title: "国际化"
							},
							component: {template: "<router-view></router-view>"},
							children: [
								{
									path: `:objectCode`,
									name: `OPCorehrMetaObjectInterIndex`,
									meta: {
										init: (p, q) => {
											return {
												code: "COREHR_OPERATION_INTERNATIONALIZATION_" + p.objectCode
												// title: "国际化"
											};
										}
									},
									component: ObjectLayout,
									props({params: {objectCode, pageType}}) {
										return {layoutCode: `OP__${objectCode.toLowerCase()}__home`};
									},
									children: [
										{
											path: `:pageType`,
											name: `OPCorehrMetaObjectLayout`,
											meta: {
												defaultParams: {pageType: "list"},
												init: (p, q) => {
													let title = {
														LOCALE: "国家地区管理",
														LANGUAGE: "语言管理",
														CURRENCY: "货币管理",
														REGION: "地理地区管理"
													}[p.objectCode];
													
													return {
														// code: "COREHR_OPERATION_INTERNATIONALIZATION_" + p.objectCode + "_" + p.pageType,
														code: "COREHR_OPERATION_INTERNATIONALIZATION_" + p.objectCode + "_list",
														title: title
													};
												}
											},
											props({params: {objectCode, pageType}}) {
												return {layoutCode: `OP__${objectCode.toLowerCase()}__${pageType}`};
											},
											component: ObjectLayout
										}
									]
								}
							]
						},
						{
							path: `meta`,
							name: `OPCorehrMeta`,
							component: {template: " <router-view></router-view>"},
							meta: {
								code: "COREHR_OPERATION_META",
								title: "人事架构管理"
							},
							children: [
								{
									path: `:menu2Type`,
									name: `OPCorehrMetaMenu2`,
									component: {template: " <router-view></router-view>"},
									meta: {
										init: (p, q) => {
											let title = {
												org: "组织管理",
												compensation: "薪酬管理",
												staff: "人员管理"
											}[p.menu2Type];
											
											return {
												code: "COREHR_OPERATION_META_" + p.menu2Type.toUpperCase(),
												title: title
											};
										}
									},
									children: [
										{
											path: `:objectCode`,
											name: `CorehrMetaObject`,
											component: {template: " <router-view></router-view>"},
											children: [
												{
													path: `index`,
													name: `CorehrMetaObjectIndex`,
													component: ObjectLayout,
													props({params: {objectCode}}) {
														return {
															layoutCode: `OP__meta__${objectCode.toLowerCase()}__home`,
															configParams: {payload: {pageName: "CorehrMetaObjectIndex"}}
															
														};
													},
													children: [
														{
															path: `:pageType`,
															name: `CorehrMetaObjectLayout`,
															component: ObjectLayout,
															meta: {
																defaultParams: {pageType: "list"},
																init: (p, q) => {
																	let title = {
																		EMPLOYEE: "员工管理",
																		GRADE: "薪等管理",
																		STEP: "薪级管理",
																		PAY_COMPONENT: "基本薪酬项",
																		MANAGEMENT_LEVEL: "职级管理",
																		JOB: "职务管理",
																		POSITION: "职位管理"
																	}[p.objectCode];
																	
																	return {
																		code: "COREHR_OPERATION_META_" + p.menu2Type.toUpperCase() + "_" + p.objectCode + "_list",
																		title: title
																	};
																}
															},
															props({params: {pageType, objectCode}}) {return {layoutCode: `OP__meta__${objectCode.toLowerCase()}__${pageType}`};}
														}
													]
												}
											]
										}]
								}
							]
						}
					]
				}
			];
			customRoutes.push({
				index,
				route: item
			});
		} else if (item.name === "CorehrPersonalInfo") {//portal
			item.children = [
				{
					path: `index`,
					name: `${item.name}Index`,
					tag: `${item.name}Index`,
					meta: {title: "个人档案"},
					redirect: {name: `${item.name}View`},
					component: {template: "<corehr-root><corehr-base></corehr-base></corehr-root>"},
					children: [
						{
							path: `edit`,
							name: `${item.name}Edit`,
							meta: {
								title: "修改",
								showTitle: false,
								tag: item.tag
							},
							redirect: {name: `${item.name}Edit_Main`},
							component: KeepAliveObjectLayout,
							props: {
								layoutCode: `personalInfo__edit`,
								configParams: {payload: {pageName: `${item.name}Edit`}}
							},
							children: [
								{
									path: `main`,
									name: `${item.name}Edit_Main`,
									meta: {
										title: "修改我的档案",
										showTitle: false,
										tag: item.tag
									},
									props: {corehr: {layoutCode: `personalInfo__edit__main`}},
									components: {corehr: ObjectLayout}
								},
								{
									path: `editFamilyPerson/:personIndex`,
									// path: `editFamilyPerson/:instanceId`,
									name: `${item.name}Edit_EditFamilyPerson`,
									meta: {
										title: "修改家庭成员",
										showTitle: false,
										tag: item.tag
									},
									props: {corehr: {layoutCode: `personalInfo__edit__editFamilyPerson`}},
									components: {corehr: ObjectLayout}
								}]
						},
						{
							path: `view`,
							name: `${item.name}View`,
							meta: {
								showTitle: false,
								tag: item.tag
							},
							props: {layoutCode: `personalInfo__view`},
							component: ObjectLayout
						},
						{
							path: `viewFamilyPerson`,
							name: `${item.name}ViewFamilyPerson`,
							meta: {
								showTitle: false,
								tag: item.tag
							},
							props: {layoutCode: `personalInfo__viewFamilyPerson`},
							component: ObjectLayout
						}
					]
				}];
			customRoutes.push({
				index,
				route: item
			});
		}
	});
	let result = [];
	customRoutes.forEach((item) => {
		router.options.routes.splice(item.index, 1, item.route);
		result.push(item.route);
	});
	router.addRoutes(result);
	router.afterEach((to, from) => {
		if (to.fullPath.indexOf("corehr/operation") < 0) {
			setCookieByQuery("op_meta_tenantId", "");
		}
	});
}
