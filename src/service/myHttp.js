import Vue from "vue";
import {Message} from "element-ui";
import {getCookieByQuery, setCookieByQuery} from "@/utils/auth";

const _httpHeaders = () => {
	const ENV_NOW = process.env;
	if (ENV_NOW.NODE_ENV === "development") {
		setCookieByQuery("tenantId", ENV_NOW.tenantId);
		setCookieByQuery("tenantToken", ENV_NOW.tenantToken);
	}
	return {
		Frontend: 1,
		TenantId: getCookieByQuery("tenantId"),
		Authorization: `Bearer ` + getCookieByQuery("tenantToken")
	};
};
export const generateHeaders = (configHeaders = {}) => {
	let httpHeaders = _httpHeaders();
	
	let header = {};
	if (configHeaders.TenantId === undefined) {
		if (getCookieByQuery("op_meta_tenantId")) {
			header = {TenantId: getCookieByQuery("op_meta_tenantId")};
		}
	}
	
	let result = {
		Authorization: httpHeaders.Authorization,
		TenantId: httpHeaders.TenantId,
		Frontend: httpHeaders.Frontend,
		source: "COREHR",
		...configHeaders,
		...header
	};
	if (!result.TenantId) {
		result.TenantId = undefined;
	}
	return result;
};
const API = () => {
	return  Vue.prototype.$JSONLayoutConfig.ENV_NOW.COREHR_URL || "";
};

function httpStartLog(type, url, params, config) {
	let isLog = true;
	const colorRed = 100 * Math.random();
	const colorGreen = 255 * Math.random();
	const colorBlue = 127 * Math.random() + ((colorGreen > 127) ? 0 : 127);
	const commonStyle = `width:30px;
											height:80px;
											margin-left:300px;
											background-color:#eee;`;
	if (isLog) {
		console.groupCollapsed(`%c${type} 请求: ${url}`,
				`color:rgb(${colorRed},${colorGreen},${colorBlue});${commonStyle}`);
		console.group("入参:");
		console.log(JSON.stringify(config || params || {}, null, 2));
		console.groupEnd();
		console.groupEnd();
	}
	return (response, error) => {
		if (isLog) {
			if (response) {
				console.groupCollapsed(`\t\t%c结果返回: ${url}`, `color:rgb(${colorRed},${colorGreen},${colorBlue});${commonStyle}`);
			} else {
				console.groupCollapsed(`%c结果返回 ERROR!! ${url}`, `color:red;font-size:23px;${commonStyle}`);
			}
			console.groupCollapsed("接口入参:");
			console.log("%c" + JSON.stringify(config || params || {}, null, 2), `color:rgb(${colorRed},${colorGreen},${colorBlue})`);
			console.groupEnd();
			if (response) {
				console.group("结果返回:");
				console.log("%c" + JSON.stringify(response, null, 2), `color:rgb(${colorRed},${colorGreen},${colorBlue})`);
				console.groupEnd();
			} else {
				console.group("%c结果返回:", `color:red;${commonStyle}`);
				console.log(JSON.stringify(error, null, 2));
				console.groupEnd();
				Message({
					message: "请求失败",
					type: "error"
				});
			}
			console.groupEnd();
		}
	};
}

function showErrorMessage(response) {
	try {
		if (response.data.bizCode !== "0") {
			let messages = response.data.data.errors;
			Message({
				type: "error",
				dangerouslyUseHTMLString: true,
				message: messages.reduce((r, c) => { return `${r}<div>${c.msg}</div>`;}, "")
			});
		}
	} catch (e) { }
}

export function requestFullPath(type, url, config = {}) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("get", url, config.params, config);
		config.headers = generateHeaders(config.headers);
		Vue.prototype.$JSONLayoutConfig.request({
			url: url,
			method: type,
			baseURL: "",
			...config
		}).then((response) => {
			logResult(response);
			
			try {
				resolve(response.data);
				showErrorMessage(response);
			} catch (e) {
				console.log("回调出错");
			}
		})
			 .catch((err) => {
				 logResult(undefined, err);
				 try {
					 reject(err);
				 } catch (e) {
					 console.log("回调出错");
				 }
			 });
	});
}

export function fetch(url, params = {}, config = {}) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("get", url, params, config);
		config.params = config.params || params;
		config.headers = generateHeaders(config.headers);
		Vue.prototype.$JSONLayoutConfig.request({
			baseURL: "",
			url: API() + url,
			method: "get",
			...config
		}).then((response) => {
			logResult(response);
			
			try {
				resolve(response.data);
				showErrorMessage(response);
			} catch (e) {
				console.log("回调出错");
			}
		})
			 .catch((err) => {
				 logResult(undefined, err);
				 try {
					 reject(err);
				 } catch (e) {
					 console.log("回调出错");
				 }
			 });
	});
}

export function post(url, data, config = {}) {
	
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("post", url, data, config);
		config.data = config.data || data;
		config.headers = generateHeaders(config.headers);
		Vue.prototype.$JSONLayoutConfig.request({
			baseURL: "",
			url: API() + url,
			method: "post",
			...config
		}).then(
				(response) => {
					logResult(response);
					try {
						resolve(response.data);
						showErrorMessage(response);
						
					} catch (e) {
						console.log("回调出错");
					}
				},
				(err) => {
					logResult(undefined, err);
					try {
						reject(err);
					} catch (e) {
						console.log("回调出错");
					}
				}
		).catch((err) => {
			logResult(undefined, err);
			try {
				reject(err);
			} catch (e) {
				console.log("回调出错");
			}
		});
		;
	});
}

export function patch(url, data) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("patch", url, data);
		Vue.prototype.$JSONLayoutConfig.request({
			baseURL: "",
			url: API() + url,
			method: "patch",
			headers: generateHeaders({}),
			data
		}).then(
				(response) => {
					logResult(response);
					try {
						resolve(response.data);
						showErrorMessage(response);
						
					} catch (e) {
						console.log("回调出错");
					}
				},
				(err) => {
					logResult(undefined, err);
					try {
						reject(err);
					} catch (e) {
						console.log("回调出错");
					}
				}
		).catch((err) => {
			logResult(undefined, err);
			try {
				reject(err);
			} catch (e) {
				console.log("回调出错");
			}
		});
	});
}

export function put(url, data, config = {}) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("put", url, data);
		config.data = config.data || data;
		config.headers = generateHeaders(config.headers);
		Vue.prototype.$JSONLayoutConfig.request({
			baseURL: "",
			url: API() + url,
			method: "put",
			...config
		}).then(
				(response) => {
					logResult(response);
					try {
						resolve(response.data);
						showErrorMessage(response);
						
					} catch (e) {
						console.log("回调出错");
					}
				},
				(err) => {
					logResult(undefined, err);
					try {
						reject(err);
					} catch (e) {
						console.log("回调出错");
					}
				}
		).catch((err) => {
			logResult(undefined, err);
			try {
				reject(err);
			} catch (e) {
				console.log("回调出错");
			}
		});
	});
}

export function mdelete(url, data, config) {
	return new Promise((resolve, reject) => {
		config.data = config.data || data;
		config.headers = generateHeaders(config.headers);
		const logResult = httpStartLog("delete", url, data, config);
		Vue.prototype.$JSONLayoutConfig.request({
			baseURL: "",
			url: API() + url,
			method: "delete",
			...config
		}).then(
				(response) => {
					logResult(response);
					try {
						resolve(response.data);
						showErrorMessage(response);
						
					} catch (e) {
						console.log("回调出错");
					}
				},
				(err) => {
					logResult(undefined, err);
					Message({
						message: "请求失败",
						type: "error"
					});
					try {
						reject(err);
					} catch (e) {
						console.log("回调出错");
					}
				}
		).catch((err) => {
			logResult(undefined, err);
			try {
				reject(err);
			} catch (e) {
				console.log("回调出错");
			}
		});
	});
}
