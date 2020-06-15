import Vue from "vue";
import jsonpath from "jsonpath";
import * as esprima from "esprima/dist/esprima";
import {getCookieByQuery} from "@/utils/auth";
import localStorage from "@/utils/localstorage";

window.jsonpath = jsonpath;
let arrayExp = new RegExp("^.+\\[\\d+]$");
let numberExp = new RegExp("^[0-9]*$");

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

let GlobalVars = [];

function getVars() {
	if (GlobalVars.length) {
	} else {
		GlobalVars = Object.keys(window).filter((key) => {
			return key.indexOf("_") !== 0 &&
					(window[key] !== undefined && window[key] !== null) &&
					!(window[key] instanceof Function);
		});
	}
	return GlobalVars;
}

let generateNewValueKeys = (obValue) => {
	console.log(obValue);
	try {
		if (typeJudge.isArray(obValue)) {
			obValue.forEach((key) => {
				generateNewValueKeys(obValue[key]);
			});
		}
		if (typeJudge.isObject(obValue) && !obValue._isVue) {//不要对vue实例操作
			Object.keys(obValue).forEach((key) => {
				if (!Object.getOwnPropertyDescriptor(obValue, key).get) {
					// console.log(obValue);
					// console.log(key);
					let temp = obValue[key];
					delete obValue[key];
					Vue.set(obValue, key, temp);
				}
				generateNewValueKeys(obValue[key]);
			});
		}
	} catch (e) {
		console.log(e);
	}
};
const Utils = {
			_getKeyArray: (str) => {
				let f = (str) => {
					let result = "";
					while (result !== str) {
						result = str;
						//以.开始,以[结束,中间不含有./[/]的字符串 e.g.  .XXX[ => [XXX][
						str = str.replace(/\.[^.[\]]*?\[/g, (substring) => {
									return "[" + substring.substring(1, substring.length - 1) + "][";
								}
						);
					}
					let a = result.replace(/^[^.[]*/, (substring) => {
						return "[" + substring.substring(0, substring.length) + "]";
					}).replace(/][^[\]]*$/g, (substring) => {
						return substring.replace(/\.[^.]*/g, (substring) => {
							return "[" + substring.substring(1, substring.length) + "]";
						});
					}).replace(/"/g, "");
					let b = a.split(/[\[\]]/);
					let c = b.filter((item) => !!item);
					return c;
				};
				let keyArray = f(str);
				return keyArray;
			},
			generateMeta: (obj, objectCode, containedObjectCodes = []) => {
				if (!obj) {
					return;
				}
				if (typeJudge.isArray(obj)) {
					return obj.map(i => {
						return Utils.generateMeta(i, objectCode, containedObjectCodes);
					});
				}
				let result = {instanceId: obj.instanceId};
				let tenantId = getCookieByQuery("tenantId");
				try {
					let fields = localStorage.fetch(`metaData_${objectCode}_${tenantId}`).field;
					fields.forEach((field) => {
						switch (field.dataType) {
							case "Text":
								result[field.name] = obj[field.name];
								break;
							case "Number":
								result[field.name] = obj[field.name];
								break;
							case "List":
								if (typeJudge.isArray(obj[field.name])) {
									result[field.name] = obj[field.name][0];
								} else {
									result[field.name] = obj[field.name];
								}
								if (typeJudge.isObject(result[field.name])) {
									result[field.name] = result[field.name].instanceId;
								}
								break;
							case "SingleInstance":
								if (typeJudge.isArray(obj[field.name])) {
									result[field.name] = obj[field.name][0];
								} else {
									result[field.name] = obj[field.name];
								}
								if (typeJudge.isObject(result[field.name])) {
									if (field.cascadeRelation === "MS" ||
											containedObjectCodes.indexOf(field.metaTargetObjectCode) >= 0) { // 强引用
										result[field.name] = Utils.generateMeta(result[field.name], field.metaTargetObjectCode, containedObjectCodes);
									} else { // 弱引用
										result[field.name] = result[field.name].instanceId;
									}
								}
								break;
							case "MultiInstance":
								if (typeJudge.isArray(obj[field.name])) {
									result[field.name] = [];
									obj[field.name].forEach((i) => {
										if (typeJudge.isObject(i)) {
											if (field.cascadeRelation !== "MR" ||
													containedObjectCodes.indexOf(field.metaTargetObjectCode) >= 0) { // 强引用
												result[field.name].push(Utils.generateMeta(i, field.metaTargetObjectCode, containedObjectCodes));
											} else { // 弱引用
												result[field.name].push(i.instanceId);
											}
										} else {
											result[field.name].push(i);
										}
									});
								}
								break;
						}
					});
				} catch (e) {
					console.log(e);
				}
				console.log("generateMeta");
				console.log(obj);
				console.log(objectCode);
				console.log(containedObjectCodes);
				console.log(result);
				return result;
				
			},
			setEvalData: (evalScope, targetPath, targetValue, isInit) => {
				if (!evalScope) {
					return;
				}
				let keyArray = Utils._getKeyArray(targetPath);
				let r = keyArray.reduce((result, key, index) => {
					let isLast = index === keyArray.length - 1;
					
					if (numberExp.test(key)) {
						if (typeJudge.isArray(result)) {
							while (result.length <= parseFloat(key)) {
								result.push(undefined);
							}
						} else {
							throw `Error: 无法在${result}中获取${key}`;
						}
						key = parseFloat(key);
					}
					
					if (isLast) {
						if (isInit) {
							if (result[key] === undefined) {
								Vue.set(result, key, targetValue);
							}
						} else {
							Vue.set(result, key, targetValue);
						}
						
					} else {
						if (!result[key]) {
							if (numberExp.test(keyArray[index + 1])) {
								Vue.set(result, key, []);
							} else {
								Vue.set(result, key, {});
							}
						}
					}
					return result[key];
				}, evalScope);
				// console.log(evalScope);
				// console.log("\n");
				return r;
			},
			/**
			 * 获取string中被{}包裹的内容区域,
			 * 存在时,按顺序返回对应数组;
			 * 不存在时,返回undefined
			 * @param str 要判断的string
			 * @returns {Array|undefined}
			 */
			getEvalString: (str = "") => {
				if (str.length <= 2) {return str;}
				let result = str.replace(/^{|}$/g, "");
				if (str === `{${result}}`) {
					return result;
				} else {
					return str;
				}
			},
			getEvalArrayByTemplate(evalScopeArray, template = {}, appendValue) {
				console.log(evalScopeArray);
				console.log(template);
				console.log(appendValue);
				let setEvalByTemplate = (evalScope, template) => {
					let target = undefined;
					const setObject = (tem) => {
						let tar = {};
						Object.keys(tem).forEach((key) => {
							let v = tem[key];
							try {
								if (typeJudge.isArray(v)) {
									if (!typeJudge.isArray(tar[key])) {
										tar[key] = [];
									}
									tar[key] = setArray(v);
								} else if (typeJudge.isObject(v)) {
									if (!typeJudge.isObject(tar[key])) {
										tar[key] = {};
									}
									tar[key] = setObject(v);
								} else if (typeJudge.isString(v)) {//有可能存在被{}包裹的内容区域
									let evalStr = Utils.getEvalString(v);
									if (evalStr !== v) {
										Utils.setEvalData(tar, key, Utils.getEvalResult(evalScope, evalStr));
									} else {//不是有效模板
										Utils.setEvalData(tar, key, v);
									}
								}
							} catch (e) {
								console.warn(e);
							}
						});
						return tar;
					};
					const setArray = (tem) => {
						let tar = [];
						tem.forEach((item, index) => {
							while (tar.length <= index) {
								tar.push({});
							}
							try {
								if (typeJudge.isArray(item)) {
									if (!typeJudge.isArray(tar[index])) {
										tar[index] = [];
									}
									tar[index] = setArray(item);
								} else if (typeJudge.isObject(item)) {
									if (!typeJudge.isObject(tar[index])) {
										tar[index] = {};
									}
									tar [index] = setObject(item);
								} else if (typeJudge.isString(item)) {//有可能存在被{}包裹的内容区域
									let evalStr = Utils.getEvalString(item);
									if (evalStr !== item) {
										Utils.setEvalData(tar, index, Utils.getEvalResult(evalScope, evalStr));
									} else {//不是有效模板
										Utils.setEvalData(tar, index, item);
									}
								}
							} catch (e) {
								console.warn(e);
							}
						});
						return tar;
					};
					if (typeJudge.isArray(template)) {
						target = setArray(template);
					} else if (typeJudge.isObject(template)) {
						target = setObject(template);
					} else if (typeJudge.isString(template)) {
						let evalStr = Utils.getEvalString(template);
						if (template !== evalStr) {
							target = Utils.getEvalResult(evalScope, evalStr);
						} else {
							target = template;
						}
					}
					return target;
				};
				let result = evalScopeArray.map((i) => {
					i.__proto__.$this = i;
					let r = setEvalByTemplate(i, template);
					delete i.__proto__.$this;
					console.log(r);
					return r;
				});
				if (appendValue) {
					if (typeJudge.isArray(result)) {
						result.push(...appendValue);
					} else if (typeJudge.isObject(result)) {
						Object.keys(appendValue).forEach((key) => {
							result[key] = result[key] === undefined ? appendValue[key] : result[key];
						});
					} else if (typeJudge.isString(result)) {
						result = result + appendValue;
					}
				}
				return result;
			},
			getEvalScopeData(evalScope, template) {
				console.log(evalScope);
				console.log(template);
				let result = JSON.parse(JSON.stringify({a: template})).a;
				let getListeners = (target, type) => {
					let listeners = [];
					const _findObject = (obj, path) => {
						Object.keys(obj).forEach((key) => {
							if (type === "layout") {
								if (obj.scopeId) {return;}//子节点为栅格布局顶点,不需要在本层scope中初始化
								if (key === "scopedSlots") {return;}//scopedSlots 需要依赖作用域实时初始化
								if (key === "on") {return;}//action 需要依赖作用域实时初始化
								if (key === "vInit") {return;}
							}
							if (key.indexOf("$") === 0) {return;}//以$开头的为模板,不需要eval转值
							
							_setListeners(obj[key], path ? (path +
									// (key.indexOf(".") < 0 ? `.${key}` : `["${key}"]`)
									(new RegExp("^[0-9]*$").test(key) ? `[${key}]` : `["${key}"]`)
							) : key);
						});
					};
					const _setListeners = (targetData, objPath) => {
						if (typeJudge.isObject(targetData)) {
							_findObject(targetData, objPath);
						} else if (typeJudge.isArray(targetData)) {
							targetData.forEach((item, index) => {_setListeners(item, `${objPath}[${index}]`);});
						} else if (typeJudge.isString(targetData) && Utils.getEvalString(targetData) !== targetData) {
							listeners.push({
								objPath: objPath,
								listenerPath: targetData
							});
						}
					};
					_findObject(target, "");
					return listeners;
				};
				let listeners = getListeners(template, "action");
				listeners.forEach(({objPath, listenerPath}) => {
					Utils.setEvalData(result, objPath, Utils.getEvalResult(evalScope, listenerPath));
				});
				return result;
			},
			getVars: (str) => {
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
				
				// console.log(str);
				try {
					let parseResult1 = esprima.parseScript(str);
					let result = parseResult1.body.reduce((r, c, i) => {
						r = distinct(r, getObjectNames(c));
						return r;
					}, []);
					//http://www.techweb.com.cn/network/system/2017-06-24/2540350.shtml
					// console.log(esprima);
					// console.log(str);
					// console.log(parseResult1);
					// console.log(result);
					// console.log("\n");
					return result;
				} catch (e) {
					let temp = str.substring(0, e.column).split(/\b/g);
					let errorStr = temp.pop();
					let result = [errorStr];
					if (e.column <= str.length) {
						result = distinct(result,
								Utils.getVars(temp.join("") + "_" + errorStr + str.substring(e.column, str.length - 1)).filter(i => i !== "_" + errorStr));
					} else {
						result = distinct(result, Utils.getVars(temp.join("") + "_" + errorStr).filter(i => i !== "_" + errorStr));
					}
					return result;
				}
			},
			getEvalResultFor$(evalScope, model, $prop) {
				let evalString = Utils.getEvalString($prop);
				if ($prop.indexOf("$.") >= 0) {
					try {
						let evalStrings = evalString.match(/{.*?}/g);
						if (evalStrings) {
							let evalStringsResult = evalStrings.map((i) => {
								let r = Utils.getEvalResult(model, i);
								if (r === undefined) {
									return Utils.getEvalResult(evalScope, i);
								}
								return r;
							});
							evalStrings.forEach((i, index) => {
								evalString = evalString.replace(i, evalStringsResult[index]);
							});
							return jsonpath.value(model, evalString);
						} else {
							return jsonpath.value(model, evalString);
						}
					} catch (e) {
					
					}
				} else {
					return Utils.getEvalResult(model, $prop);
				}
			},
			/**
			 *
			 * 在evalScope域中计算str对应值.
			 * @param evalScope 域
			 * @param str 可能包含{}的str
			 * @returns {*}
			 */
			getEvalResult: (evalScope, str = "") => {
				let evalString = Utils.getEvalString(str);
				if (str.indexOf("$.") >= 0) {
					try {
						return Utils.getEvalResultFor$(evalScope, evalScope, str);
					} catch (e) {
					
					}
				}
				var args = Object.keys(evalScope);  //枚举key
				let scope = evalScope;
				while (scope.__proto__) {
					let arr = Object.keys(scope.__proto__);
					args = distinct(args, arr);
					scope = scope.__proto__;
				}
				if (args.length === 0) {return;}
				
				let codes = evalString.split(";").filter(i => i);
				let code1 = "", code2 = "";
				if (codes.length === 1) {
					code2 = codes[0];
				} else {
					code2 = codes.pop();
					code1 = codes.join(";");
				}
				let evalArgs = Utils.getVars(evalString);
				let varsStr = evalArgs
						.filter(i => {return ["Vue", "data", "Utils"].indexOf(i) < 0;})
						.reduce((r, c, i) => {
							
							if ([
								"break", "case", "catch", "continue", "default",
								"delete", "do", "else", "finally", "for",
								"function", "if", "in", "instanceof", "new",
								"return", "switch", "this", "throw", "try",
								"typeof", "var", "void", "while", "with",
								"abstract", "boolean", "byte", "char", "class",
								"const", "debugger", "double", "enum", "export",
								"extends", "fimal", "float", "goto", "implements",
								"import", "int", "interface", "long", "mative",
								"package", "private", "protected", "public",
								"short", "static", "super", "synchronized",
								"throws", "transient", "volatile"
							].indexOf(c) >= 0 || Object.keys(window).indexOf(c) >= 0) {
								r += `var _${c} = data.${c};`;
								code1 = code1.replace(new RegExp(`((^\\b${c}\\b)|([^\.]${c}\\b))`, "g"), `_${c}`);
								code2 = code2.replace(new RegExp(`((^\\b${c}\\b)|([^\.]${c}\\b))`, "g"), `_${c}`);
							} else {
								r += `var ${c} = data.${c};`;
							}
							return r;
						}, "");
				code1 = (code1.lastIndexOf(";") === code1.length - 1) ? code1 : (code1 + ";");
				let a = `${varsStr}
              ${code1}
              // try{
              let result=(${code2});
              return result;
              // }catch(e){}
              `;  //函数体的字符串
				try {
					var f = new Function("Vue", "data", "Utils", a);  //创建函数
					let result = f(Vue, evalScope, Utils);
					// console.log(args);
					// console.log(evalArgs);
					evalArgs.forEach((arg) => {
						// console.log(arg);
						let value = evalScope[arg];
						// generateNewValueKeys(value);
					});
					return result;
				} catch (e) {
					console.debug("str:");
					console.debug(str);
					console.debug("evalScope:");
					console.debug(evalScope);
					console.debug("function:");
					console.debug(a);
					console.debug(e);
					console.debug("\n");
				} finally {
				}
			}
			
		}
;
// window._Utils = Utils
export default Utils;
