import promise from "es6-promise";
import axios from "axios";
import {Message} from "element-ui"; // eslint-disable-line
import {getCookieByQuery} from "@/utils/auth";

promise.polyfill();
const ENV_NOW = process.env;
// 创建axios实例
const service = axios.create({
	baseURL: ENV_NOW.GATEWAY_API, // api的base_url
	timeout: 15000, // 请求超时时间
	validateStatus: function(status) {
		return status >= 200 && status < 500; // 默认的
	}
});

// request拦截器
service.interceptors.request.use(config => {
	let lang = getCookieByQuery("hr_locale");
	if (lang == "zhCN") {
		lang = "zh_CN";
	} else if (lang == "enUS" || lang == "en") {
		lang = "en_US";
	}
	//所有请求都加上动态时间戳，以防止缓存
	config.params = {
		_t: Date.parse(new Date()) / 1000,
		language: lang,
		...config.params
	};
	return config;
}, error => {
	// Do something with request error
	console.log(error); // for debug
	Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
		response => {
			/**
			 * code为非20000是抛错 可结合自己业务进行修改
			 */
			const res = response.data;
			if (response.status == 301) {
				if (ENV_NOW.ENV != "LOCAL") {
					Message({
						message: res.message,
						type: "error",
						duration: 5 * 1000
					});
					location.href = response.data.redirect_url;
				}
			}
			if (response.status >= 400 && response.status < 500) {
				if (response.request.responseURL && response.request.responseURL.indexOf("login/account") == -1) {
					Message({
						message: res.message,
						type: "error",
						duration: 5 * 1000
					});
				}
				return Promise.reject(res);
			} else {
				return response;
			}
		}
);

export default service;
