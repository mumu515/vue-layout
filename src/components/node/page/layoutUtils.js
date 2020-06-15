import nodeLayout from "./layout";
import * as esprima from "esprima";
import jsonpath from "jsonpath";

function distinct(a, b) {
	let arr = a.concat(b);
	return arr.filter((item, index) => {
		return arr.indexOf(item) === index;
	});
}

function isJsonString(str) {
	try {
		if (typeof JSON.parse(str) == "object") {
			return true;
		}
	} catch (e) {
	}
	return false;
	
}

/**
 * 获取string中被{}包裹的内容区域,
 */
function getEvalString(str = "") {
	if (str.length < 2) {return str;}
	let result = str.replace(/^{|}$/g, "");
	return str === `{${result}}` ? result : str;
}

/**
 * 在self中查找evalStr中使用到的变量对应的变量声明
 */
function getStringVarDefsFromSelf(self, evalStr) {
	let varArray = getVars(evalStr);
	let vars = "";
	varArray.forEach(v => {
		if (self[v] !== undefined) {
			vars += `var ${v}=self.${v};`;
		} else if (self._parent) {
			let str = "self.";
			let scopeSelf = self._parent;
			while (scopeSelf) {
				str += "_parent.";
				if (scopeSelf[v] !== undefined) {
					scopeSelf = undefined;
				} else {
					scopeSelf = scopeSelf._parent;
				}
			}
			str += v;
			if (eval(str) !== undefined) {
				vars += `var ${v}=${str};`;
			}
		}
	});
	return vars;
}

function getVars(str) {
	function getObjectNames(obj) {
		let result = [];
		if (typeJudge.isObject(obj)) {
			Object.keys(obj).forEach((key) => {
				if (key === "key") {
					return;
				}
				if ("property" === key) {
					if (obj.computed) {
						result = distinct(result, getObjectNames(obj[key]));
					} else {
					}
					return;
				}
				if ("callee" === key) {
					let calleeNames;
					if (obj[key].name) {
						calleeNames = [obj[key].name];
					} else {
						calleeNames = getObjectNames(obj[key]);
					}
					calleeNames = calleeNames.filter((i) => {return (i !== "window") && (!typeJudge.isFunction(window[i]));});
					result = distinct(result, calleeNames);
				} else if ("name" === key) {
					result = distinct(result, [obj[key]]);
				} else if (typeJudge.isObject(obj[key])) {
					if (obj[key].name) {
						result = distinct(result, [obj[key].name]);
					} else {
						result = distinct(result, getObjectNames(obj[key]));
					}
				} else if (typeJudge.isArray(obj[key])) {
					obj[key].forEach(i => {result = distinct(result, getObjectNames(i));});
				}
			});
		} else if (typeJudge.isArray(obj)) {
			obj.forEach(i => {result = distinct(result, getObjectNames(i));});
		}
		return result;
	}
	try {
		let parseResult1 = esprima.parseScript(str);
		let result = parseResult1.body.reduce((r, c, i) => {
			r = distinct(r, getObjectNames(c));
			return r;
		}, []);
		return result;
	} catch (e) {
		let temp = str.substring(0, e.column).split(/\b/g);
		let errorStr = temp.pop();
		let result = [errorStr];
		if (e.column <= str.length) {
			result = distinct(result,
					getVars(temp.join("") + "_" + errorStr + str.substring(e.column, str.length - 1)).filter(i => i !== "_" + errorStr));
		} else {
			result = distinct(result, getVars(temp.join("") + "_" + errorStr).filter(i => i !== "_" + errorStr));
		}
		return result;
	}
}

function fetchDataByTree(self, str) {
	if (getEvalString(str) === str) {
		str = `{${str}}`;
	}
	let result = bindData(self, str);
	if (result !== undefined) {
		return result;
	} else {
		if (self._parent) {
			return fetchDataByTree(self._parent, str);
		}
	}
}

function bindData(self, data) {
	if (!data) {return data;}
	let bindObj = (obj) => {
		let r = {};
		Object.keys(obj).forEach(i => {
			if (typeJudge.isArray(obj[i])) {
				r[i] = obj[i].map(ai => {
					return bindObj(ai);
				});
			} else if (typeJudge.isObject(obj[i])) {
				r[i] = bindObj(obj[i]);
			} else {
				r[i] = bindString(obj[i]);
			}
		});
		return r;
	};
	let bindString = (str) => {
		let r;
		if (!typeJudge.isString(str)) {
			return str;
		} else {
			let evalStr = getEvalString(str);
			if (evalStr === str) {
				if (evalStr.startsWith("$.")) {
					r = evalStr.replace(/{.*?}/g, (substr) => {
						return fetchDataByTree(self, substr);
					});
				} else {
					r = str;
				}
			} else {
				if (evalStr.startsWith("$.")) {
					evalStr = evalStr.replace(/{.*?}/g, (substr) => {
						return fetchDataByTree(self, substr);
					});
					try {
						let varStr = evalStr.match(/\$\.(.*?)[\[|\.]/)[1];
						if (self[varStr] !== undefined) {
							r = jsonpath.value(self, evalStr);
						} else {
							let s = self._parent;
							while (s) {
								if (s[varStr] !== undefined) {
									r = jsonpath.value(s, evalStr);
									s = undefined;
								} else {
									s = s._parent;
								}
							}
						}
					} catch (e) {
						console.dir(e);
						console.log(jsonpath);
						console.log(self);
						console.log(str);
						console.log(evalStr);
					}
				} else {
					let vars = getStringVarDefsFromSelf(self, evalStr);
					try {
						r = eval(vars + evalStr);
					} catch (e) {
					}
				}
			}
		}
		return r;
	};
	let result;
	if (typeJudge.isArray(data)) {
		result = data.map(ai => {
			return bindObj(ai);
		});
	} else if (typeJudge.isObject(data)) {
		result = bindObj(data);
	} else {
		result = bindString(data);
	}
	return result;
	
}

export function vIf(self, node) {
	if (node["v-if"] !== undefined) {
		if (typeJudge.isString(node["v-if"])) {
			let vIf = bindData(self, node["v-if"]);
			return vIf;
		} else {
			return !!node["v-if"];
		}
	} else {
		return true;
	}
}

function handlerFun(self, handler, actionArgs) {
	if (typeJudge.isObject(handler)) {
		let args = handler.args ? [
			...(handler.args.split(",")).map((item) => {
				return fetchDataByTree(self, item);
			}), ...actionArgs] : actionArgs;
		if (handler.body) {//直接执行的方法内容
			let vars = getStringVarDefsFromSelf(self, getEvalString(handler.body));
			let f = new Function("self", "args", vars + getEvalString(handler.body));  //创建函数
			f(self, args);
		} else if (handler.name) {
			let actionFun = fetchDataByTree(self, handler.name);
			actionFun(...args);
		}
	}
}

function on(self, node) {
	return {
		on: {
			...(node.on || []).reduce((r, {name, handler}) => {
				r[name] = function() {
					if (typeJudge.isObject(handler)) {
						handlerFun(self, handler, arguments);
					} else if (typeJudge.isFunction(handler)) {
						handler(...arguments);
					}
				};
				return r;
			}, {})
		}
	};
}

function scopedSlots(self, node) {
	return (node.scopedSlots && node.scopedSlots.length) ? {
		scopedSlots: node.scopedSlots.reduce((r, {nodes, name, scopeMapping}, i) => {
			r[name] = (slotScope) => {
				let fields = nodes;
				if (typeJudge.isObject(fields)) {
					fields = [fields];
				}
				if (typeJudge.isArray(fields)) {
					return fields.map((field, index) => {
						let a = self.$createElement(nodeLayout, {
							// key: field.key || (new Date().getTime() + index),//防止组件复用,导致列表翻页后数据让然显示前一页数据
							props: {
								layout: {
									...field,
									scope: {
										data: Object.keys(scopeMapping).reduce((r, c, i) => {
											r[c] = slotScope[scopeMapping[c]];
											return r;
										}, {}),
										methods: []
									}
								}
							}
						});
						return a;
					});
				}
			};
			return r;
		}, {})
	} : {};
}

export function generateMethods(self, methods = []) {
	return methods.reduce((r, method, i) => {
		if (typeJudge.isFunction(method.handler)) {
			r[method.methodName] = function() {
				return method.handler(...arguments);
			};
		} else {
			r[method.methodName] = function() {
				console.log(`调用 ${method.methodName} 方法:`);
				// console.log(this);
				let args = arguments;
				let vars = "";
				if (method.handler.args) {
					method.handler.args.split(",").forEach((key, index) => {
						if (args.length >= index) {
							vars += `let ${key}=args[${index}];`;
						} else {
							vars += `let ${key};`;
						}
					});
				}
				let result;
				try {
					if (method.handler.result) {
						console.log(`;${vars}${method.handler.body};return ${method.handler.result}`);
						result = eval(`let fun=function(){${vars}${method.handler.body};return ${method.handler.result}};fun()`);
					} else {
						eval(`${vars}${method.handler.body}`);
					}
				} catch (e) {
					console.dir(e);
					console.log("self", self);
					console.log("method", method);
				}
				self.$forceUpdate();
				return result;
				
			};
		}
		
		return r;
	}, {});
}

export function generateNode(self, node) {
	// console.log("generateNode", self, node);
	if (!node.nodeType) {
		console.log(node);
		throw new Error("nodeType 不存在");
	}
	// console.log("generateNode", "isGenerated", node.isGenerated);
	if (!node.isGenerated) {
		if (node.props) {
			Object.keys(node.props).forEach((prop) => {
				if (prop.startsWith("v-")) {
					//v-model,v-if,v-show ...
					switch (prop) {
						case "v-model":
							node.props.value = node.props[prop];
							delete node.props[prop];
							let displayOnly = bindData(self, (node.props || {}).displayOnly);
							if (!displayOnly && (
									node.nodeType.endsWith("-input-number") ||
									node.nodeType.endsWith("-input") ||
									node.nodeType.endsWith("-date-picker")
							)) {
								node.on = node.on || [];
								let f = function(event) {
									console.log("input", event);
									setValue(self, node.props.value, event);
								};
								let ev = node.on.find(i => (i.name === "input"));
								if (ev) {
									let h = ev.handler;
									ev.handler = function(event) {
										f(event);
										handlerFun(self, h);
									};
								} else {
									node.on.push({
										name: "input",
										handler: f
									});
								}
							} else if (node.nodeType.endsWith("-select") && !displayOnly) {
								node.on = node.on || [];
								let f = function(event) {
									console.log("change", event);
									console.log(self, event);
									setValue(self, node.props.value, event);
								};
								let ev = node.on.find(i => (i.name === "change"));
								if (ev) {
									let h = ev.handler;
									ev.handler = function(event) {
										f(event);
										handlerFun(self, h);
									};
								} else {
									node.on.push({
										name: "change",
										handler: f
									});
								}
							}
							break;
					}
				}
			});
		}
		node.isGenerated = true;
	}
	
	// 处理defaultValue:
	
	if (node.defaultValueMap) {
		node.defaultValueMap.forEach((item) => {
			try {
				let value = fetchDataByTree(self, item.key);
				if (value === undefined || value === null) {
					let defaultValue = item.value;
					if (item.valueType && item.valueType !== "String") {
						defaultValue = eval(defaultValue);
					}
					setValue(self, item.key, defaultValue);
				}
			} catch (e) {
				console.log("%c处理defaultValue不成功=>node:", "color:rgb(255,0,0)", "self", self, "node", node, "item", item);
				console.dir(e);
			}
		});
	}
	
	let propData = {
		key: node.key,
		class: node.class,
		style: bindData(self, node.style),
		props: bindData(self, node.props),
		attrs: bindData(self, node.attrs),
		directives: bindData(self, node.directives),
		...((!(node.children && node.children.length) && node.innerHTML !== undefined) ? {domProps: {innerHTML: bindData(self, node.innerHTML)}} : {}),
		...(node.slot ? {slot: node.slot} : {}),// slot 如果为其他组件的子组件,需要为插槽制定名称
		...on(self, node),
		...scopedSlots(self, node)
	};
	return propData;
}

export function setValue(self, path, val) {
	let varArray = getVars(getEvalString(path));
	let vars = "";
	varArray.forEach(v => {
		if (self[v] !== undefined) {
			vars += `var ${v}=self.${v};`;
		} else {
			if (self._parent) {
				let str = "self.";
				let scopeSelf = self._parent;
				while (scopeSelf) {
					str += "_parent.";
					if (scopeSelf[v] !== undefined) {
						scopeSelf = undefined;
					} else {
						scopeSelf = scopeSelf._parent;
					}
				}
				str += v;
				vars += `var ${v}=${str};`;
			}
		}
	});
	// 使用set方法防止新增属性的时候无法触发observe
	let mPath = getEvalString(path);
	if (mPath.endsWith("]")) {
		let _mVar = mPath.substring(0, mPath.lastIndexOf("["));
		let _mKey = mPath.substring(mPath.lastIndexOf("[") + 1, mPath.length - 1);
		eval(`${vars}self.$set(${_mVar},"${_mKey}",arguments[2])`);
	} else if (mPath.indexOf(".") > 0) {
		let _mVar = mPath.substring(0, mPath.lastIndexOf("."));
		let _mKey = mPath.substring(mPath.lastIndexOf(".") + 1, mPath.length);
		console.log(`${vars}self.$set(_mVar,_mKey,arguments[2])`);
		eval(`${vars}self.$set(${_mVar},"${_mKey}",arguments[2])`);
	} else {
		console.log(`设置无效:${path}`);
	}
	self.$forceUpdate();
	
}
