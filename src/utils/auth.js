import Cookies from "js-cookie";
import Vue from "vue";

const ENV_NOW = () => {
	try {
		return Vue.prototype.$JSONLayoutConfig.ENV_NOW;
	} catch (e) {
		console.log(e);
	}
};

const TokenKey = () => (ENV_NOW().TAGNAME + "-" + "attendToken");

export function getToken() {
	return Cookies.get(TokenKey());
}

export function getACSToken() {
	return Cookies.get(ENV_NOW().TAGNAME + "-" + "epToken");
}

export function getDomain() {
	return Cookies.get(ENV_NOW().TAGNAME + "-" + "epHost");
}

export function setToken(token) {
	if (ENV_NOW().ENV === "LOCAL") {
		return Cookies.set(TokenKey(), token);
	} else {
		return Cookies.set(TokenKey(), token, {domain: ".ecosaas.com"});
	}
}

export function removeToken() {
	return Cookies.remove(TokenKey());
}

export function getCookieByQuery(query) {
	query = ENV_NOW().TAGNAME + "-" + query;
	return Cookies.get(query);
}

export function removeCookieByQuery(query) {
	query = ENV_NOW().TAGNAME + "-" + query;
	if (ENV_NOW().ENV === "LOCAL") {
		return Cookies.remove(query);
	} else {
		return Cookies.remove(query, {domain: ".ecosaas.com"});
	}
}

export function setCookieByQuery(query, val) {
	query = ENV_NOW().TAGNAME + "-" + query;
	if (ENV_NOW().NODE_ENV === "development") {
    return Cookies.set(query, val);
	} else {
		return Cookies.set(query, val, {domain: ".ecosaas.com"});
	}
}
