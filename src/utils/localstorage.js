const localStorage = {
	fetch(key) {
		let value = window.localStorage.getItem(key);
		if (value !== "undefined" && value !== "null") {
			return JSON.parse(value || "{}");
		} else {
			return {};
		}
	},
	save(key, data) {
		window.localStorage.setItem(key, JSON.stringify(data));
	},
	remove(key) {
		window.localStorage.removeItem(key);
	},
	clear() {
		window.localStorage.clear();
	}
};
export default localStorage;
