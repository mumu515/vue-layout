import store from "@/store";
import Vue from "vue";

const ENV_NOW = process.env;
const headers = (config = {}) => {
	let httpHeaders = store.getters["httpHeaders"]();
	return {
		...(config.headers ? config.headers : {}),
		Authorization: httpHeaders.Authorization,
		TenantId: httpHeaders.TenantId,
		Frontend: httpHeaders.Frontend
		
	};
};
const API = () => {
	let httpHeaders = store.getters["httpHeaders"]();
	return (httpHeaders.API || ENV_NOW.GATEWAY_API) + httpHeaders.appendUrl;
};

function httpStartLog(type, url, params, config) {
	const colorRed = 255 * Math.random();
	const colorGreen = 255 * Math.random();
	const colorBlue = 255 * Math.random();
	console.groupCollapsed(`%c ${type} 请求: ${url}`, `color:rgb(${colorRed},${colorGreen},${colorBlue})`);
	console.group("入参:");
	console.log(JSON.stringify(config || params || {}, null, 2));
	console.groupEnd();
	console.groupEnd();
	return (response, error) => {
		if (response) {
			console.groupCollapsed(`%c结果返回: ${url}`, `color:rgb(${colorRed},${colorGreen},${colorBlue})`);
		} else {
			console.groupCollapsed(`%c结果返回 %c ERROR!! ${url}`, `color:rgb(${colorRed},${colorGreen},${colorBlue})`, `color:red`);
		}
		console.groupCollapsed("接口入参:");
		console.log(JSON.stringify(config || params || {}, null, 2));
		console.groupEnd();
		if (response) {
			console.group("结果返回:");
			console.log(JSON.stringify(response, null, 2));
			console.groupEnd();
		} else {
			console.group("%c结果返回:", `color:red`);
			console.log(JSON.stringify(error, null, 2));
			console.groupEnd();
			Vue.prototype.$message({
				message: "请求失败",
				type: "error"
			});
		}
		console.groupEnd();
	};
}

function showErrorMessage(response) {
	try {
		if (response.data.bizCode !== "0") {
			let messages = response.data.data.errors;
			Vue.prototype.$message({
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
		config.headers = headers(config);
		Vue.$JSONLayoutConfig.request({
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

export function fetch(url, params, config = {}) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("get", url, params, config);
		config.params = config.params || params;
		config.headers = headers(config);
		Vue.$JSONLayoutConfig.request({
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
		config.headers = headers(config);
		Vue.$JSONLayoutConfig.request({
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
		Vue.$JSONLayoutConfig.request({
			url: API() + url,
			method: "patch",
			headers: headers(),
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
		;
	});
}

export function put(url, data, config = {}) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("put", url, data);
		config.data = config.data || data;
		config.headers = headers(config);
		Vue.$JSONLayoutConfig.request({
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
		;
	});
}

export function mdelete(url, data) {
	return new Promise((resolve, reject) => {
		const logResult = httpStartLog("patch", url, data);
		Vue.$JSONLayoutConfig.request({
			url: API() + url,
			method: "delete",
			headers: headers(),
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
					Vue.prototype.$message({
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
