export default () => ({
	path: "/corehr/personalInfo/index/edit",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		style: {padding: "20px"},
		scope: {
			scopeId: 1,
			data: {
				familyPersonData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
								try{
									self.familyPersonData = JSON.parse(JSON.stringify(self._parent.familyDependentPersons[self.personIndex]));
									self.familyPersonData = lodash.mergeWith({
										names:[{nameCHN:{},locale:[self._parent.locale.CHN.instanceId]}],
										biographical:[{}],
										personRegional:[{personRegionalCHN:[{}]}],
										identifiers:[{locale:[""]}],
										addresses:[],
										phones:[],
										emails:[],
										bankAccounts:[]
									},self.familyPersonData,function(obj,source){if(source===null){return obj;}});
								}catch(e){
									self.cancel();
								}`
					}
				},
				{
					methodName: "cancel",
					handler: {
						body: `self.$router.replace({name:"CorehrPersonalInfoEdit_Main"});`
					}
				},
				{
					methodName: "save",
					handler: {
						body: `
								var fun = function(s) {
									var r = lodash.mergeWith({}, s, function(obj, source) {
										if (typeJudge.isArray(source)) {
											if (source.length === 0) {
												return null;
											} else {
												var arr = lodash.filter(lodash.map(source, function(item) {
													if (typeJudge.isObject(item)) {
														var t = fun(item);
														t = lodash.pickBy(t, function(v, k) {return v !== null;});
														if (JSON.stringify(t) === "{}") {return null;}
														return t;
													} else if (typeJudge.isString(item)) {
														if (item === "") {return null;}else{return item;}
													} else {
														return item;
													}
												}), function(item) {
													return item !== null;
												});
												if (arr.length) {
													return arr;
												} else {
													return null;
												}
											}
										}
									});
									console.log(r);
									r = lodash.pickBy(r, function(v, k) {return v !== null;});
									console.log(r);
									return r;
								};
								self._parent.familyDependentPersons[self.personIndex] = self.generateData(self.familyPersonData);
								self.$router.replace({name: "CorehrPersonalInfoEdit_Main"});`
					}
				}
			]
		},
		children: [
			{
				nodeType: "el-breadcrumb",
				props: {"separator-class": "el-icon-arrow-right"},
				children: [
					{
						nodeType: "el-breadcrumb-item",
						props: {to: {path: "/index"}},
						children: [
							{
								nodeType: "span",
								innerHTML: "首页"
							}]
					},
					{
						nodeType: "el-breadcrumb-item",
						props: {
							replace: true,
							to: {name: "CorehrPersonalInfoView"}
						},
						children: [
							{
								nodeType: "span",
								innerHTML: "我的档案"
							}]
					},
					{
						nodeType: "el-breadcrumb-item",
						props: {
							replace: true,
							to: {name: "CorehrPersonalInfoEdit_Main"}
						},
						children: [
							{
								nodeType: "span",
								innerHTML: "修改我的档案"
							}]
					},
					{
						nodeType: "el-breadcrumb-item",
						children: [
							{
								nodeType: "span",
								innerHTML: "修改家庭成员"
							}]
					}
				]
			},
			{
				nodeType: "y-anchor",
				style: {"margin": "20px 0"},
				props: {
					anchors: [
						{
							anchorName: "name",
							title: "姓名"
						},
						{
							anchorName: "personal-info",
							title: "档案资料"
						},
						{
							anchorName: "local",
							title: "本地信息(中国)"
						},
						{
							anchorName: "id",
							title: "个人身份标识号"
						},
						{
							anchorName: "location",
							title: "地址"
						},
						{
							anchorName: "mobile",
							title: "电话"
						},
						{
							anchorName: "mail",
							title: "邮箱"
						},
						{
							anchorName: "bank",
							title: "银行账号"
						}
					]
				},
				children: [
					{
						slot: "default",
						nodeType: "el-card",
						style: {
							flex: "auto",
							"margin-left": "20px"
						},
						children: [
							{
								nodeType: "el-container",
								props: {direction: "vertical"},
								children: [
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-name"},
										props: {
											title: "姓名",
											iconClass: "name"
										},
										children: [
											{
												slot: "footer",
												nodeType: "i",
												class: "el-icon-plus",
												style: {margin: "0 20px"},
												on: [
													{
														name: "click",
														handler: {body: "{familyPersonData.names.push({nameCHN:{},locale:[locale.CHN.instanceId]})}"}
													}]
											}]
									},
									{
										nodeType: "y-list",
										"v-if": "{familyPersonData.names.length}",
										style: {padding: "10px 20px 30px 20px"},
										props: {forList: "{familyPersonData.names}"},
										scopedSlots: [
											{
												name: "default",
												scopeMapping: {
													itemModel: "item",
													index: "index"
												},
												nodes: [
													{
														nodeType: "el-row",
														props: {type: "flex"},
														style: {
															height: "30px",
															"justify-content": "flex-end",
															"align-items": "flex-end"
														},
														children: [
															{
																nodeType: "i",
																class: "el-icon-delete",
																on: [
																	{
																		name: "click",
																		handler: {body: "{familyPersonData.names.splice(index,1)}"}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	label: "类型",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.type"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.type}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "NAME.type"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																defaultValueMap: [
																	{
																		value: "[\"\"]",
																		valueTYpe: "Array",
																		key: "itemModel.locale"
																	}],
																props: {
																	label: "国家地区",
																	required: true
																	
																},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.locale[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														"v-if": "{locale.CHN.instanceId===itemModel.locale[0]}",
														props: {
															model: "{itemModel.nameCHN[0]}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {label: "中文姓"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].primaryFamilyName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].primaryFamilyName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "中文中间名"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].primaryMiddleName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].primaryMiddleName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "中文名"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].primaryGivenName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].primaryGivenName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "第二姓名的姓"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].secondaryFamilyName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].secondaryFamilyName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "第二姓名的中间名"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].secondaryMiddleName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].secondaryMiddleName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "第二姓名的名"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].secondaryGivenName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].secondaryGivenName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "第三姓名的姓"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].tertiaryFamilyName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].tertiaryFamilyName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "第三姓名的中间名"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].tertiaryMiddleName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].tertiaryMiddleName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "第三姓名的名"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].tertiaryGivenName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].tertiaryGivenName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "昵称"},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].nickName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].nickName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "显示姓名",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].displayName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].displayName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "头衔"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.nameCHN[0].title"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.nameCHN[0].title}"
																		}
																	}]
															}]
													}
												]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-personal-info"},
										props: {
											title: "档案资料",
											iconClass: "personal-info"
										}
									},
									{
										nodeType: "y-pre-form",
										style: {padding: "40px 20px 30px 20px"},
										props: {
											model: "{familyPersonData.biographical[0]}",
											labelPosition: "top",
											span: 3,
											inline: true,
											defaultValueMap: [
												{
													value: [{}],
													key: "familyPersonData.biographical[0]"
												}]
										},
										children: [
											{
												nodeType: "el-form-item",
												props: {
													label: "出生日期"
												},
												defaultValueMap: [
													{
														value: "",
														key: "itemModel.nameCHN[0].dateOfBirth"
													}],
												children: [
													{
														nodeType: "y-input",
														props: {
															"v-model": "{familyPersonData.biographical[0].dateOfBirth}"
														}
													}]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-local"},
										props: {
											title: "本地信息(中国)",
											iconClass: "local-info"
										}
									},
									{
										nodeType: "y-pre-form",
										style: {"padding": "40px 20px 30px 20px"},
										props: {
											model: "{familyPersonData.personRegional.personRegionalCHN[0]}",
											labelPosition: "top",
											span: 3,
											inline: true
										},
										children: [
											{
												nodeType: "el-form-item",
												props: {
													label: "性别"
												},
												defaultValueMap: [
													{
														value: "",
														key: "familyPersonData.personRegional[0].personRegionalCHN[0].gender"
													}],
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{familyPersonData.personRegional[0].personRegionalCHN[0].gender}",
															filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.gender"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {
													label: "婚姻状态"
												},
												defaultValueMap: [
													{
														value: "",
														key: "familyPersonData.personRegional[0].personRegionalCHN[0].maritalStatus"
													}],
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{familyPersonData.personRegional[0].personRegionalCHN[0].maritalStatus}",
															filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.maritalStatus"
														}
													}]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-id"},
										props: {
											title: "个人身份标识号",
											iconClass: "id-card"
										},
										children: [
											{
												slot: "footer",
												nodeType: "i",
												class: "el-icon-plus",
												style: {margin: "0 20px"},
												on: [
													{
														name: "click",
														handler: {body: "{familyPersonData.identifiers.push({})}"}
													}]
											}]
									},
									{
										nodeType: "y-list",
										"v-if": "{familyPersonData.identifiers.length}",
										style: {padding: "10px 20px 30px 20px"},
										props: {forList: "{familyPersonData.identifiers}"},
										scopedSlots: [
											{
												name: "default",
												scopeMapping: {
													itemModel: "item",
													index: "index"
												},
												nodes: [
													{
														nodeType: "el-row",
														props: {type: "flex"},
														style: {
															height: "30px",
															"justify-content": "flex-end",
															"align-items": "flex-end"
														},
														children: [
															{
																nodeType: "i",
																class: "el-icon-delete",
																on: [
																	{
																		name: "click",
																		handler: {body: "{familyPersonData.identifiers.splice(index,1)}"}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	label: "国家地区",
																	required: true,
																	defaultValueMap: [
																		{
																			value: "[\"\"]",
																			valueTYpe: "Array",
																			key: "itemModel.locale"
																		}]
																},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.locale[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "类型",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.identificationType"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.identificationType}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "IDENTIFIER.identificationType"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "证件号",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.identificationId"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.identificationId}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "发证日期"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.issuedDate"
																	}],
																children: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{itemModel.issuedDate}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "过期日期"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.expirationDate"
																	}],
																children: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{itemModel.expirationDate}"
																		}
																	}]
															}]
													}]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-location"},
										props: {
											title: "地址",
											iconClass: "location"
										},
										children: [
											{
												slot: "footer",
												nodeType: "i",
												class: "el-icon-plus",
												style: {margin: "0 20px"},
												on: [
													{
														name: "click",
														handler: {body: "{familyPersonData.addresses.push({addressCHN:{},locale:[locale.CHN.instanceId]})}"}
													}]
											}]
									},
									{
										nodeType: "y-list",
										style: {padding: "10px 20px 30px 20px"},
										"v-if": "{familyPersonData.addresses.length}",
										props: {forList: "{familyPersonData.addresses}"},
										scopedSlots: [
											{
												name: "default",
												scopeMapping: {
													itemModel: "item",
													index: "index"
												},
												nodes: [
													{
														nodeType: "el-row",
														props: {type: "flex"},
														style: {
															height: "30px",
															"justify-content": "flex-end",
															"align-items": "flex-end"
														},
														children: [
															{
																nodeType: "i",
																class: "el-icon-delete",
																on: [
																	{
																		name: "click",
																		handler: {body: "{familyPersonData.addresses.splice(index,1)}"}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	label: "类型",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.type"
																	}],
																children: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{itemModel.type}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "ADDRESS.type"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "国家地区",
																	required: true,
																	defaultValueMap: [
																		{
																			value: "[\"\"]",
																			valueTYpe: "Array",
																			key: "itemModel.locale"
																		}]
																},
																children: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{itemModel.locale[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														"v-if": "{!locale.CHN.instanceId||!itemModel.locale[0]||(locale.CHN.instanceId===itemModel.locale[0])}",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {label: "省市"},
																defaultValueMap: [
																	{
																		value: "[\"\"]",
																		valueType: "Array",
																		key: "itemModel.addressCHN[0].region"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.addressCHN[0].region[0]}",
																			filter: {
																				data: {
																					type: "CHN_PROVINCE"
																				},
																				params: {
																					asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																				}
																			},
																			optionsPath: "REGION"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "城市"},
																defaultValueMap: [
																	{
																		value: "[\"\"]",
																		valueType: "Array",
																		key: "itemModel.addressCHN[0].city"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.addressCHN[0].city[0]}",
																			filter: {
																				data: {
																					type: "CHN_CITY"
																				},
																				params: {
																					asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																				}
																			},
																			optionsPath: "REGION"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "地区"},
																defaultValueMap: [
																	{
																		value: "[\"\"]",
																		valueType: "Array",
																		key: "itemModel.addressCHN[0].district"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.addressCHN[0].district[0]}",
																			filter: {
																				data: {type: "CHN_AREA"},
																				params: {
																					asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																				}
																			},
																			optionsPath: "REGION"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {label: "子地区"},
																defaultValueMap: [
																	{
																		value: "[\"\"]",
																		valueType: "Array",
																		key: "itemModel.addressCHN[0].subDistrict"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.addressCHN[0].subDistrict[0]}",
																			filter: {
																				data: {
																					type: "CHN_TOWN"
																				},
																				params: {
																					asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																				}
																			},
																			optionsPath: "REGION"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "地址"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.addressCHN[0].address1"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.addressCHN[0].address1}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "邮政"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.addressCHN[0].postal"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.addressCHN[0].postal}"
																		}
																	}]
															}]
													}
												]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-mobile"},
										props: {
											title: "电话",
											iconClass: "mobile"
										},
										children: [
											{
												slot: "footer",
												nodeType: "i",
												class: "el-icon-plus",
												style: {margin: "0 20px"},
												on: [
													{
														name: "click",
														handler: {body: "{familyPersonData.phones.push({locale:[\"\"]})}"}
													}
												]
											}]
									},
									{
										nodeType: "y-list",
										style: {padding: "10px 20px 30px 20px"},
										"v-if": "{familyPersonData.phones.length}",
										props: {forList: "{familyPersonData.phones}"},
										scopedSlots: [
											{
												name: "default",
												scopeMapping: {
													itemModel: "item",
													index: "index"
												},
												nodes: [
													{
														nodeType: "el-row",
														
														props: {type: "flex"},
														style: {
															height: "30px",
															"justify-content": "flex-end",
															"align-items": "flex-end"
														},
														children: [
															{
																nodeType: "i",
																class: "el-icon-delete",
																on: [
																	{
																		name: "click",
																		handler: {body: "{familyPersonData.phones.splice(index,1)}"}
																	}
																]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	label: "类型",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.type"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.type}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "PHONE.type"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "国家地区",
																	required: true,
																	defaultValueMap: [
																		{
																			value: "[\"\"]",
																			valueTYpe: "Array",
																			key: "itemModel.locale"
																		}]
																},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.locale[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "国际冠码"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.interPrefix"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.interPrefix}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "长途字冠"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.trunkPrefix"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.trunkPrefix}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "号码",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.phoneNumber"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.phoneNumber}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "分机"
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.extension"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.extension}"
																		}
																	}]
															}]
													}
												]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-mail"},
										props: {
											title: "邮箱",
											iconClass: "mail"
										},
										children: [
											{
												slot: "footer",
												nodeType: "i",
												class: "el-icon-plus",
												style: {margin: "0 20px"},
												on: [
													{
														name: "click",
														handler: {body: "{familyPersonData.emails.push({})}"}
													}
												]
											}]
									},
									{
										nodeType: "y-list",
										style: {padding: "10px 20px 30px 20px"},
										"v-if": "{familyPersonData.emails.length}",
										props: {forList: "{familyPersonData.emails}"},
										scopedSlots: [
											{
												name: "default",
												scopeMapping: {
													itemModel: "item",
													index: "index"
												},
												nodes: [
													{
														nodeType: "el-row",
														props: {type: "flex"},
														style: {
															height: "30px",
															"justify-content": "flex-end",
															"align-items": "flex-end"
														},
														children: [
															{
																nodeType: "i",
																class: "el-icon-delete",
																on: [
																	{
																		name: "click",
																		handler: {body: "{familyPersonData.emails.splice(index,1)}"}
																	}
																]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	label: "类型",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.type"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.type}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "EMAIL.type"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "邮箱",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.email"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.email}"
																		}
																	}]
															}]
													}]
											}]
									},
									{
										nodeType: "y-portal-item-header",
										attrs: {id: "anchor-bank"},
										props: {
											title: "银行账号",
											iconClass: "bank-card"
										},
										children: [
											{
												slot: "footer",
												nodeType: "i",
												class: "el-icon-plus",
												style: {margin: "0 20px"},
												on: [
													{
														name: "click",
														handler: {body: "{familyPersonData.bankAccounts.push({})}"}
													}
												]
											}]
									},
									{
										nodeType: "y-list",
										"v-if": "{familyPersonData.bankAccounts.length}",
										style: {padding: "10px 20px 30px 20px"},
										props: {forList: "{familyPersonData.bankAccounts}"},
										scopedSlots: [
											{
												name: "default",
												scopeMapping: {
													itemModel: "item",
													index: "index"
												},
												nodes: [
													{
														nodeType: "el-row",
														props: {type: "flex"},
														style: {
															height: "30px",
															"justify-content": "flex-end",
															"align-items": "flex-end"
														},
														children: [
															{
																nodeType: "i",
																class: "el-icon-delete",
																on: [
																	{
																		name: "click",
																		handler: {body: "{familyPersonData.bankAccounts.splice(index,1)}"}
																	}
																]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 3,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	label: "国家地区",
																	required: true,
																	defaultValueMap: [
																		{
																			value: "[\"\"]",
																			valueTYpe: "Array",
																			key: "itemModel.locale"
																		}]
																},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.locale[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "类型",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.type"
																	}],
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.type}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "BANK_ACCOUNT.type"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "银行",
																	required: true,
																	defaultValueMap: [
																		{
																			value: "[\"\"]",
																			valueTYpe: "Array",
																			key: "itemModel.bank"
																		}]
																},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.bank[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "BANK"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "支行",
																	defaultValueMap: [
																		{
																			value: "[\"\"]",
																			valueTYpe: "Array",
																			key: "itemModel.bankBranch"
																		}]
																},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.bankBranch[0]}",
																			filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "BANK_BRANCH"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "账户名",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.accountName"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.accountName}"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	label: "账户",
																	required: true
																},
																defaultValueMap: [
																	{
																		value: "",
																		key: "itemModel.accountNumber"
																	}],
																children: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{itemModel.accountNumber}"
																		}
																	}]
															}]
													}]
											}]
									},
									{
										nodeType: "el-row",
										props: {type: "flex"},
										style: {"justify-content": "center"},
										children: [
											{
												nodeType: "div",
												style: {flex: "none"},
												children: [
													{
														nodeType: "y-button",
														props: {size: "mini"},
														innerHTML: "取消",
														on: [
															{
																name: "click",
																handler: {name: "cancel"}
															}]
													},
													{
														nodeType: "el-button",
														props: {
															size: "mini",
															type: "primary"
														},
														innerHTML: "保存",
														on: [
															{
																name: "click",
																handler: {name: "save"}
															}]
													}]
											}]
									}
								]
							}
						]
					}]
			}]
	}
})
