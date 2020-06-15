window.assert = function assert(bCondition, sErrorMsg, errorCallback) {
	if (!bCondition) {
		// alert(sErrorMsg);
		if (typeof (errorCallback) === "function") {
			errorCallback();
		} else {
			throw new Error(sErrorMsg);
		}
	}
};

Date.prototype.mFormat = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};
window.deepEquals =function (x, y) {
	var f1 = x instanceof Object;
	var f2 = y instanceof Object;
	if (!f1 || !f2) {
		return x === y
	}
	if (Object.keys(x).length !== Object.keys(y).length) {
		return false
	}
	var newX = Object.keys(x);
	for (var p in newX) {
		p = newX[p];
		var a = x[p] instanceof Object;
		var b = y[p] instanceof Object;
		if (a && b) {
			let equal = deepEquals(x[p], y[p])
			if (!equal) {
				return equal
			}
		} else if (x[p] !== y[p]) {
			return false;
		}
	}
	return true;
}
window.deepCompareObject = function(Obj_1, Obj_2) {
	var state = true;
	for (var key in Obj_1) {
		if (typeof (Obj_2[key]) === "undefined") {
			state = false;
		} else {
			if (typeof (Obj_1[key]) === "object") {
				state = compare(Obj_1[key], Obj_2[key]);
			} else {
				if (Obj_1[key] !== Obj_2[key]) {
					state = false;
				}
			}
		}
	}
	return state;
};
