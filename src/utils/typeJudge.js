window.typeJudge = {
  type(v) {
    if (window.typeJudge.isString(v)) {
      return "String";
    }
    if (window.typeJudge.isNumber(v)) {
      return "Number";
    }
    if (window.typeJudge.isBoolean(v)) {
      return "Boolean";
    }
    if (window.typeJudge.isUndefined(v)) {
      return "Undefined";
    }
    if (window.typeJudge.isNull(v)) {
      return "Null";
    }
    if (window.typeJudge.isObject(v)) {
      return "Object";
    }
    if (window.typeJudge.isArray(v)) {
      return "Array";
    }
    if (window.typeJudge.isFunction(v)) {
      return "Function";
    }
  },
  isString(v) {
    return Object.prototype.toString.call(v) === "[object String]";
  },
  isNumber(v) {
    return Object.prototype.toString.call(v) === "[object Number]";
  },
  isBoolean(v) {
    return Object.prototype.toString.call(v) === "[object Boolean]";
  },
  isUndefined(v) {
    return Object.prototype.toString.call(v) === "[object Undefined]";
  },
  isNull(v) {
    return Object.prototype.toString.call(v) === "[object Null]";
  },
  isObject(v) {
    return Object.prototype.toString.call(v) === "[object Object]";
  },
  isArray(v) {
    return Object.prototype.toString.call(v) === "[object Array]";
  },
  isFunction(v) {
    return Object.prototype.toString.call(v) === "[object Function]";
  },
  isEmpty(v) {
    if (v === undefined || v === null || v === "") {
      return true;
    }
    if (window.typeJudge.isArray(v) && v.length === 0) {
      return true;
    }
    if (window.typeJudge.isObject(v) && JSON.stringify(v) === "{}") {
      return true;
    }
  }
};
