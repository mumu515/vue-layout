import {fetch} from "@/service/myHttp";
import noPermissionPage from "./layout/error_page/no-permisson";
import {getCookieByQuery} from "@/utils/auth";
import simpleWarning from "@/store/layout/error_page/simple-warning";
import Vue from "vue";

const requireTemplates = require.context("./layout/", true, /.*(\/).+(\.js)$/);

export function getLocalTemplates() {
	let templates = {};
	requireTemplates.keys().forEach((fileName) => {
		const template = requireTemplates(fileName);
		if (template.default && !fileName.match(/.*index\.js/)) {
			let dirNames = fileName.match(/\.\/(.*)\.js/)[1].split("/");
			let n = dirNames.join("__");
			dirNames.reduce((r, c, i) => {
				if (i === dirNames.length - 1) {
					r[c] = {
						getTemplate: template.default,
						layoutCode: n
					};
				} else {
					r[c] = r[c] || {};
				}
				return r[c];
			}, templates);
		}
	});
	return templates;
}

export function getLocalLayoutCodes() {
	let layoutCodes = [];
	console.groupCollapsed("layoutCodes");
	requireTemplates.keys().forEach((fileName) => {
		const template = requireTemplates(fileName);
		if (template.default && !fileName.match(/.*index\.js/)) {
			let dirNames = fileName.match(/\.\/(.*)\.js/)[1].split("/");
			let n = dirNames.join("__");
			console.log(`layoutCode:${n}`);
			layoutCodes.push(n);
		}
	});
	console.groupEnd();
	return layoutCodes;
}

export function getLocalTemplatesByCode(layoutCode = "") {
	let w = {
		getTemplate: () => {
			return showLayoutByObj({}, simpleWarning("404"));
		}
	};
	try { //OP_META特殊处理
		if (layoutCode.startsWith("OP__meta__")) {
			layoutCode = layoutCode.replace("OP__", "");
		}
		
		let layoutCodeArr = layoutCode.split("__");
		let t = layoutCodeArr.reduce((r, c, i) => {return r[c];}, getLocalTemplates());
		return t || w;
	} catch (e) {
		return w;
	}
}

export function generateFormConfig(processConfig, payload) {
	let rootScope = processConfig.layout.scope;
	if (rootScope) {
		rootScope.data = {
			...rootScope.data, ...payload,
			today: new Date()
		};
	}
}

async function getLayoutByRequest(id) {
	try {
		return (await fetch("/layout/LAYOUT_PAGE/" + id, {uniqueKey: "WEB_PAGE_ID_UNIQUE"})).data.node;
	} catch (e) {
	}
}

async function getLayoutPermission(id) {
	try {
		let d = (await fetch("/permission/page/" + id));
		if (d.isEnablePermission === "0") {
			return true;
		}
		return !!(d.data && d.data.length && d.data[0]);
	} catch (e) {
	}
}

async function permission(payload, layoutCode) {
	let isShow = false;
	if (layoutCode.startsWith("personalInfo__")) {//个人信息界面不做权限控制
		isShow = true;
	} else if (layoutCode.endsWith("__home")) {
		if (!isShow) {
			isShow = await getLayoutPermission(layoutCode.replace("__home", "__add"));
		}
		if (!isShow) {
			isShow = await getLayoutPermission(layoutCode.replace("__home", "__list"));
		}
		if (!isShow) {
			isShow = await getLayoutPermission(layoutCode.replace("__home", "__view"));
		}
	} else if (layoutCode.endsWith("__list")) {
		if (!isShow) {
			isShow = await getLayoutPermission(layoutCode.replace("__list", "__list"));
		}
		if (!isShow) {
			isShow = await getLayoutPermission(layoutCode.replace("__list", "__view"));
		}
	} else {
		isShow = await getLayoutPermission(layoutCode);
	}
	if (!isShow) {
		// 	界面权限
		return showLayoutByObj(payload, noPermissionPage());
	}
}

function showLayoutByObj(payload, obj) {
	let processConfig = obj;
	generateFormConfig(processConfig, payload);
	return processConfig;
}

export async function getLayout(payload, layoutCode) {
	Vue.prototype.$JSONLayoutConfig.store.state.corehr.loadingStackNum++;
	let processConfig = getLocalTemplatesByCode(layoutCode).getTemplate();
	if (layoutCode) {
		if (!layoutCode.startsWith("OP_") && !layoutCode.startsWith("personalInfo_")) {
			// 员工自助 OP界面不控制权限,否则先判断界面权限
			let p = await permission(payload, layoutCode);
			if (p) {
				return p;
			}
		}
		let needRequestLayout = true;
		if (layoutCode.startsWith("OP_")) {// OP界面按照所选租户获取远端layout
			if (layoutCode === "OP__home") {
				needRequestLayout = false;
			} else if (!getCookieByQuery("op_meta_tenantId")) {
				needRequestLayout = false;
				return showLayoutByObj(payload, simpleWarning("请先在上方切换要查看的租户"));//OP没有选中租户时 下方不显示
			}
			//OP_META特殊处理
			if (layoutCode.startsWith("OP__meta__")) {
				layoutCode = layoutCode.replace("OP__", "");
			}
		}
		
		if (needRequestLayout) {
			let t = await getLayoutByRequest(layoutCode);
			if (t && Vue.prototype.$JSONLayoutConfig.ENV_NOW.NODE_ENV !== "development") {
				processConfig.layout = t;
			}
		}
	}
	generateFormConfig(processConfig, payload);
	Vue.prototype.$JSONLayoutConfig.store.state.corehr.loadingStackNum--;
	return processConfig;
}
