import Utils from "@/components/utils";
import Vue from "vue";

let getInits = (layout) => {
	let inits = [];
	const _findObject = (obj, path) => {
		Object.keys(obj).forEach((key) => {
			if (obj.scopeId) {return;}//子节点为栅格布局顶点,不需要在本层scope中初始化
			if (key === "scopedSlots") {return;}//scopedSlots 需要依赖作用域实时初始化
			if (key === "on") {return;}//action 需要依赖作用域实时初始化
			if (key === "vInit" && typeJudge.isString(obj[key])) {
				inits.push(obj[key]);
				return;
			}
			_setInits(obj[key], path ? (path + (key.indexOf(".") < 0 ? `.${key}` : `["${key}"]`)) : key);
		});
	};
	const _setInits = (targetData, objPath) => {
		if (typeJudge.isObject(targetData)) {
			_findObject(targetData, objPath);
		} else if (typeJudge.isArray(targetData)) {
			targetData.forEach((item, index) => {_setInits(item, `${objPath}[${index}]`);});
		}
	};
	_findObject(layout, "");
	return inits;
};
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
let setEvalByTemplate = (evalScope, template, target) => {
	const setObject = (tem, tar) => {
		Object.keys(tem).forEach((key) => {
			let v = tem[key];
			try {
				if (typeJudge.isArray(v)) {
					setArray(v, tar[key]);
				} else if (typeJudge.isObject(v)) {
					setObject(v, tar[key]);
				} else if (typeJudge.isString(v)) {//有可能存在被{}包裹的内容区域
					let evalStr = Utils.getEvalString(v);
					if (evalStr !== v) {
						Utils.setEvalData(evalScope, evalStr, tar[key]);
					} else {//不是有效模板
						// do  nothing
					}
				}
			} catch (e) {
				console.warn(e);
			}
		});
	};
	const setArray = (tem, tar) => {
		tem.forEach((item, index) => {
			try {
				if (typeJudge.isArray(item)) {
					setArray(item, tar[index]);
				} else if (typeJudge.isObject(item)) {
					setObject(item, tar[index]);
				} else if (typeJudge.isString(item)) {//有可能存在被{}包裹的内容区域
					let evalStr = Utils.getEvalString(item);
					if (evalStr !== item) {
						Utils.setEvalData(evalScope, evalStr, tar[index]);
					} else {//不是有效模板
						// do  nothing
					}
				}
			} catch (e) {
				console.warn(e);
			}
		});
	};
	if (typeJudge.isArray(template)) {
		setArray(template, target);
	} else if (typeJudge.isObject(template)) {
		setObject(template, target);
	} else if (typeJudge.isString(template)) {
		let evalStr = Utils.getEvalString(template);
		if (template !== evalStr) {
			Utils.setEvalData(evalScope, evalStr, target);
		}
	}
};
let Scope = function(scope, copyScope = {}) {
	this.scopeId = scope.scopeId || copyScope.scopeId;
	this.parentScopeId = copyScope.parentScopeId;
	
	let Data = function(scope) {
		let self = this;
		Object.keys(copyScope.data || {}).forEach((key) => {
			self[key] = copyScope.data[key];
		});
		Object.keys(scope.data || {}).forEach((key) => {
			self[key] = scope.data[key];
		});
	};
	Data.prototype = copyScope.data.__proto__;
	this.data = new Data(scope);
	
	let Action = function(scope) {
		let self = this;
		Object.keys(copyScope.action || {}).forEach((key) => {
			self[key] = copyScope.action[key];
		});
		Object.keys(scope.action || {}).forEach((key) => {
			self[key] = scope.action[key];
		});
	};
	Action.prototype = copyScope.action.__proto__;
	this.action = new Action(scope);
};
const YScope = {//配合layout使用
			name: "YScope",
			inheritAttrs: false,
			provide() {
				return {
					scope: this.scope,
					handleAction: this.handleAction
				};
			},
			inject: ["getScopes"],
			props: {
				layout: {
					type: Object,
					default: () => ({})
				},
				scope: {
					type: Object,
					default: () => ({})
				}
			},
			data() {
				return {
					listeners: [],
					mLayout: {}
				};
			},
			created() {
				let self = this;
				let inits = getInits(this.layout);
				inits.forEach((code) => {Utils.getEvalResult(self.scope.data, code);});
				this.generateLayout();
			},
			render(h) {
				let result = this.createNode(this.mLayout);
				return result;
			},
			computed: {
				VIF() {
					return this.vIf(this.mLayout);
				}
			},
			watch: {
				VIF(n, o) {
					if (n) {
						this.init();
					}
				},
				layout(n, o) {
					if (JSON.stringify({layout: n}) !== JSON.stringify({layout: o})) {
						this.generateLayout();
					}
				},
				scope: {
					handler: "scopeChanged",
					deep: true
					// immediate: true
				}
			},
			async mounted() {
				if (this.VIF) {await this.init();}
			},
			methods: {
				scopeChanged(n, o) {
					let self = this;
					this.listeners.forEach(({objPath, listenerPath}) => {
						if (Utils.getEvalResult(self.scope.data, listenerPath) !== Utils.getEvalResult(self.mLayout, objPath)) {
							Utils.setEvalData(self.mLayout, objPath, Utils.getEvalResult(self.scope.data, listenerPath));
						}
					});
				},
				generateLayout() {
					this.mLayout = JSON.parse(JSON.stringify(this.layout));
					this.listeners = getListeners(this.mLayout, "layout");
					this.scopeChanged(this.scope);
				},
				
				async init() {
					let scope = this.scope;
					if (scope.hasOwnProperty("action") && scope.action.hasOwnProperty("init")) {
						await this.actionOperate("init");
					}
				},
				_getActions(actionName) {
					let result = [];
					if (this.scope.action[actionName]) {
						for (let action of this.scope.action[actionName]) {
							if (typeJudge.isObject(action)) {
								result.push(action);
							} else if (typeJudge.isString(action)) {
								result.push(...this._getActions(action));
							}
						}
					}
					return result;
				},
				async actionOperate(name) {
					let self = this;
					let actions = this._getActions(name);
					for (let action of actions) {
						let config = {};
						if (action.type === "route") {// 路由跳转
							config = JSON.parse(JSON.stringify(action.config));
							let listeners = getListeners(config, "action");
							listeners.forEach(({objPath, listenerPath}) => {
								Utils.setEvalData(config, objPath, Utils.getEvalResult(self.scope.data, listenerPath));
							});
							// this.$router.push("/dashboard");
							// this.$router.push("/dashboard/corehr/employee/index/add");
							this.$router[config.action]({
								...config,
								action: undefined
							});
						} else if (action.type === "process") {
							config = JSON.parse(JSON.stringify(action.config));
							let listeners = getListeners(config, "action");
							listeners.forEach(({objPath, listenerPath}) => {
								Utils.setEvalData(config, objPath, Utils.getEvalResult(self.scope.data, listenerPath));
							});
							let processConfig = await this.$store.dispatch(config.storeActionName, {
								processUrl: config.processUrl,
								payload: config.payload
							});
							this.$router.push({
								path: processConfig.formConfig.path,
								query: {processUrl: config.processUrl}
							});
						} else if (action.type === "api") {
							config = JSON.parse(JSON.stringify(action.config));
							let listeners = getListeners(config, "action");
							listeners.forEach(({objPath, listenerPath}) => {Utils.setEvalData(config, objPath, Utils.getEvalResult(self.scope.data, listenerPath));});
							try {
								let response = await this.apiRequest(config);
								if (response.bizCode !== "0") {
									break;
								}
							} catch (e) {
								console.log(e);
							} finally {}
						} else if (action.type === "eval") {
							Utils.getEvalResult(self.scope.data, action.config.eval);
						} else if (action.type === "messageBox") {
							try {
								await this.$msgbox(action.config.options);
								
							} catch (e) {
								break;
							}
						}
					}
				},
				async apiRequest(apiConfig, resultScope) {
					// console.log("apiRequest");
					// console.log({apiConfig});
					let response = await Vue.$JSONLayoutConfig.HTTP[apiConfig.type](apiConfig.url, undefined, {
						params: apiConfig.params,
						headers: apiConfig.headers,
						data: apiConfig.data
					});
					if (apiConfig.$response) {
						setEvalByTemplate(this.scope.data, apiConfig.$response, response);
					}
					return response;
					// console.log("apiRequest end");
				},
				vIf(layout) {
					if (!layout.hasOwnProperty("vIf")) {
						return true;
					}
					// if (layout.vIf === undefined) {
					//   return true;
					// }
					if (!typeJudge.isString(layout.vIf)) {
						return !!layout.vIf;
					}
					let eS = Utils.getEvalString(layout.vIf);
					if (eS === layout.vIf) {
						return !!layout.vIf;
					} else {
						let result = !!Utils.getEvalResult(this.scope.data, layout.vIf);
						return result;
					}
				}
				,
				handleAction(actionName, $params, params) {
					if ($params) {
						setEvalByTemplate(this.scope.data, $params, params);
					}
					this.$nextTick(() => this.actionOperate(actionName));
				}
				,
				on(layout) {
					let _self = this;
					if (layout.on) {
						return {
							on: Object.keys(layout.on).reduce((r, key) => {
								/**
								 * 两种定义时间的方式:object||String.
								 * string直接为在本级作用于中执行语句
								 */
								let v = layout.on[key];
								if (typeJudge.isString(v)) {
									r[key] = function() {
										// let {data, api, action, parent} = _self.scope;
										// eval(v);
										return Utils.getEvalResult(_self.scope.data, v);
									};
								} else {
									r[key] = function() {
										let params = {
											append: _self.scope,
											arguments: arguments
										};
										_self.handleAction(v.actionName, v.$params, params);
									};
								}
								return r;
							}, {})
						};
					} else {
						return {};
					}
				},
				innerHTML(layout) {return (!layout.children && layout.innerHTML !== undefined) ? {domProps: {innerHTML: layout.innerHTML}} : {};},
				children(layout) {return (layout.children || []).map((child) => {return this.createNode(child);});},
				//如果为其他组件的子组件,需要为插槽制定名称
				slot(layout) {return layout.slot ? {slot: layout.slot} : {};},
				/**
				 * 作用域插槽的格式为 { name: props => VNode | Array<VNode> }
				 * @param layout
				 */
				scopedSlots(layout) {
					if (layout.scopedSlots) {
						let self = this;
						let h = self.$createElement;
						return {
							scopedSlots: {
								...Object.keys(layout.scopedSlots).reduce((r, c, i) => {
									r[c] = (slotScope) => {
										let field = layout.scopedSlots[c];
										if (typeJudge.isObject(field)) {
											field = [field];
										}
										if (typeJudge.isArray(field)) {
											return field.map((item) => {
												let scopeData = {};
												if (item.scopeMapping) {
													Object.keys(item.scopeMapping).forEach((key) => {
														let v = item.scopeMapping[key];
														scopeData[key] = Utils.getEvalResult(slotScope, v);
													});
												}
												if (item.scopeId) {
													let scopeId = item.scopeId;
													let scopes = this.getScopes();
													let selectedScope = scopes.find((i) => i.scopeId === scopeId);
													if (selectedScope) {
														scopeId = item.scopeId + "-child";
														return h("y-page", {
															...(scopeData.key ? {key: scopeData.key} : {}),
															props: {
																layout: {
																	...item,
																	scopeId
																},
																scopes: [
																	...field,
																	new Scope({
																		data: scopeData,
																		scopeId
																	}, selectedScope)]
															}
														});
													} else {
														return h("y-page", {
															...(scopeData.key ? {key: scopeData.key} : {}),
															props: {
																layout: {
																	...item,
																	scopeId
																},
																scopes: [
																	...field,
																	{
																		data: scopeData,
																		scopeId
																	}]
															}
														});
													}
												} else {
													let scopes = this.getScopes();
													return h("y-page", {
														...(scopeData.key ? {key: scopeData.key} : {}),
														props: {
															layout: {
																...item,
																scopeId: (this.scope.scopeId + "-child")
															},
															scopes: [
																...scopes,
																{
																	data: scopeData,
																	scopeId: (this.scope.scopeId + "-child")
																}]
														}
													});
												}
											});
										}
										
									};
									return r;
								}, {})
							}
						};
					} else {
						return {};
					}
				},
				createNode(layout) {
					if (this.vIf(layout)) {
						if (layout) {
							if (layout.scopeId) {//利用 YScope 生成新的scope
								return this.$createElement("y-layout", {props: {layout: layout}});
							} else { // 使用本层scope
								return this.$createElement(
										layout.nodeType,
										{
											key: layout.key,
											props: layout.props,
											attrs: layout.attrs,
											class: layout.class,
											style: layout.style,
											...this.innerHTML(layout),
											...this.on(layout),
											...this.slot(layout),
											...this.scopedSlots(layout)
										},
										this.children(layout)
								);
							}
						} else {
							console.log("layout 不存在");
							return undefined;
						}
					}
				}
			}
			
		}
;
export default YScope;
