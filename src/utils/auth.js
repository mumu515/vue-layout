import Cookies from "js-cookie";

export function getCookieByQuery(query) {
	return Cookies.get(query);
}

export function removeCookieByQuery(query) {
	return Cookies.remove(query);
}

export function setCookieByQuery(query, val) {
	return Cookies.set(query, val);
}
