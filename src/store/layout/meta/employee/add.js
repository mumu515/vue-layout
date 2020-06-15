export default () => ({
	path: "/corehr/EMPLOYEE/index/add",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				activeConfig: {activeIndex: 0},
				locale: [{CHN: [{}]}],
				formData: {
					personData: {"id": "$instance:1"},
					employeeData: {"personal": [{"PERSON_ID_UNIQUE": "$instance:1"}]}
				}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
                self.apiRequest({url: "/biz/LOCALE/search",type: "POST",headers: {},data: {"code": "CHN"}}).then(function(response){
									self.locale.CHN=response.data.instances[0];
									console.log(self);
								});
								self.getAutoId().then(function(response){
										self.formData.personData.id=response;
										self.formData.employeeData.personal[0].PERSON_ID_UNIQUE=response;
								});`
					}
				},
				{
					methodName: "getAutoId",
					handler: {
						body: `var r=self.apiRequest({url: "/system/tools/getAutoId/1",type: "GET"}).then(function(response){
											self.lastAutoId = response.data.list[0];
											return self.lastAutoId;
								});`,
						result: `r`
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"CorehrMetaObjectLayout",params: {pageType: "list"}});`}
				},
				{
					methodName: "submit",
					handler: {
						body: `
                self.apiRequest({
                  url: "/v2.4/transaction/api",type: "POST",headers: {},
                  data:  {
										"transaction": {
											"code": "Hire",
											"steps": [
												{
													"code": "New_Employee_Person",
													"effectiveDate": self.formData.employeeData.workRelationships[0].hireDate.replace(/-/g,""),
													"data": [{"payload": self.generateData(self.formData.personData)}]
												},
												{
													"code": "New_Employee",
													"effectiveDate": self.formData.employeeData.workRelationships[0].hireDate.replace(/-/g,""),
													"data": [{"payload": self.generateData( self.formData.employeeData)}]
												}
											]
										}
									}
								}).then(function(response){
                  if(response.bizCode==="0"){
                  	var isBPM=false;
                  	for(var i=0;i<response.data[0].transaction.steps.length;i++){
                  		if(response.data[0].transaction.steps[i].code==="New_BPM"){
                  			isBPM=true;
                  			self.$alert(
                  			response.data[0].transaction.code+"操作已提交审批流"+response.data[0].transaction.steps[i].results[0].processContext+",流程编号:"+response.data[0].transaction.steps[i].results[0].externalId,
                  			"弹出框",
                  			{
              					  type: "info",
              					  showConfirmButton: true,
              					  showClose:false,
              					  showCancelButton: false,
              					  confirmButtonText: "确定",
              					}).then(function(){
              					   self.toList();
              					});
                  		}
                  	}
                  	if(!isBPM){
                  		 self.toList();
                  	}
                  }else{
                  	//self.$message({message:response.message,type:"error"});
                  }
								});`
					}
				}
			]
		},
		children: [
			{
				nodeType: "el-row",
				children: [
					{
						nodeType: "el-col",
						props: {
							tag: "div",
							span: 24
						},
						children: [
							{
								nodeType: "el-container",
								class: "header-part page-header",
								style: {"align-items": "center"},
								children: [
									{
										nodeType: "i",
										"v-if": false,
										class: "el-icon-arrow-left icon-back",
										style: {"margin-right": "40px"},
										on: [
											{
												name: "click",
												handler: {name: "toList"}
											}]
									},
									{
										nodeType: "h2",
										innerHTML: "入职新员工",
										style: {flex: "auto"}
									}
								]
							}]
					}]
			},
			{
				nodeType: "y-steps",
				"v-if": "{activeConfig.activeIndex===0}",
				props: {stepPosition: "right"},
				style: {
					"padding-right": "20px",
					"padding-bottom": "90px"
				},
				children: [
					{
						nodeType: "el-container",
						props: {"direction": "vertical"},
						children: [
							// 个人信息
							{
								nodeType: "el-card",
								style: {margin: "20px 20px 0 20px"},
								props: {
									header: "档案资料",
									"body-style": {"padding": "0"}
								},
								defaultValueMap: [
									{
										value: "[{}]",
										valueType: "Array",
										key: "formData.personData.biographical"
									}],
								children: [
									{
										nodeType: "y-pre-form",
										style: {padding: "40px 20px 30px 20px"},
										props: {
											model: "{formData.personData.biographical[0]}",
											labelPosition: "top",
											span: 2,
											inline: true
										},
										children: [
											{
												nodeType: "el-form-item",
												defaultValueMap: [
													{
														value: "",
														valueType: "String",
														key: "formData.personData.biographical[0].dateOfBirth"
													}],
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "出生日期",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-date-picker",
														props: {
															"v-model": "{formData.personData.biographical[0].dateOfBirth}",
															defaultValue: ""
														}
													}]
											},
											{
												nodeType: "el-form-item",
												defaultValueMap: [
													{
														value: "[\"\"]",
														valueType: "Array",
														key: "formData.personData.biographical[0].birthLocale"
													}],
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "出生国家地区",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														props: {
															"v-model": "{formData.personData.biographical[0].birthLocale[0]}",
															optionsPath: "LOCALE",
															filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}}
														}
													}]
											}]
									}]
							},
							//中国-本地信息
							{
								nodeType: "el-card",
								style: {margin: "20px 20px 0 20px"},
								props: {
									header: "本地信息(中国)",
									"body-style": {"padding": "0"}
								},
								defaultValueMap: [
									{
										value: "[{}]",
										valueType: "Array",
										key: "formData.personData.personRegional"
									},
									{
										value: "[{}]",
										valueType: "Array",
										key: "formData.personData.personRegional[0].personRegionalCHN"
									}],
								children: [
									{
										nodeType: "y-pre-form",
										style: {"padding": "40px 20px 30px 20px"},
										props: {
											model: "{formData.personData.personRegional[0].personRegionalCHN[0]}",
											labelPosition: "top",
											span: 2,
											inline: true
										},
										children: [
											{
												nodeType: "el-form-item",
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "国籍",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														defaultValueMap: [
															{
																value: "",
																valueType: "String",
																key: "formData.personData.personRegional[0].personRegionalCHN[0].nationalityRegion"
															}],
														props: {
															"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].nationalityRegion}",
															defaultValue: "",
															optionsPath: "PERSON_REGIONAL_CHN.nationalityRegion"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "性别",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														defaultValueMap: [
															{
																value: "",
																valueType: "String",
																key: "formData.personData.personRegional[0].personRegionalCHN[0].gender"
															}],
														props: {
															"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].gender}",
															defaultValue: "",
															filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.gender"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "婚姻状态",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														defaultValueMap: [
															{
																value: "",
																valueType: "String",
																key: "formData.personData.personRegional[0].personRegionalCHN[0].maritalStatus"
															}],
														props: {
															"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].maritalStatus}",
															defaultValue: "",
															filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.maritalStatus"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "户口",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														defaultValueMap: [
															{
																value: "",
																valueType: "String",
																key: "formData.personData.personRegional[0].personRegionalCHN[0].huKou"
															}],
														props: {
															"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].huKou}",
															defaultValue: "",
															filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.huKou"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "民族",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														defaultValueMap: [
															{
																value: "",
																valueType: "String",
																key: "formData.personData.personRegional[0].personRegionalCHN[0].ethnicity"
															}],
														props: {
															"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].ethnicity}",
															defaultValue: "",
															filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												children: [
													{
														nodeType: "span",
														slot: "label",
														innerHTML: "政治面貌",
														style: {"font-weight": "normal"}
													},
													{
														nodeType: "y-select",
														defaultValueMap: [
															{
																value: "",
																valueType: "String",
																key: "formData.personData.personRegional[0].personRegionalCHN[0].politicsStatus"
															}],
														props: {
															"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].politicsStatus}",
															defaultValue: "",
															filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
															optionsPath: "PERSON_REGIONAL_CHN.politicsStatus"
														}
													}]
											}]
									}]
							},
							//姓名
							{
								nodeType: "el-card",
								style: {margin: "20px 20px 0 20px"},
								props: {"body-style": {padding: "0"}},
								children: [
									{
										nodeType: "el-row",
										slot: "header",
										props: {type: "flex"},
										style: {"align-items": "center"},
										children: [
											{
												nodeType: "div",
												style: {flex: "auto"},
												class: "required",
												innerHTML: "姓名"
											},
											{
												nodeType: "i",
												defaultValueMap: [
													{
														value: "[]",
														valueType: "Array",
														key: "formData.personData.names"
													}],
												class: "el-icon-plus",
												on: [
													{
														name: "click",
														handler: {
															body: "formData.personData.names.push({locale:[locale.CHN.instanceId]})"
														}
													}]
											}]
									},
									{
										nodeType: "y-list",
										"v-if": "{formData.personData.names&&formData.personData.names.length}",
										style: {padding: "10px 20px 30px 20px"},
										props: {forList: "{formData.personData.names}"},
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
																		handler: {
																			body: "formData.personData.names.splice(index,1)"
																		}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														props: {
															model: "{itemModel}",
															labelPosition: "top",
															span: 2,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																props: {
																	required: true
																},
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "类型",
																		style: {"font-weight": "normal"}
																	},
																	{
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.type"
																			}],
																		nodeType: "y-select",
																		props: {
																			"v-model": "{itemModel.type}",
																			defaultValue: "",
																			filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "NAME.type"
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	required: true
																},
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "国家地区",
																		style: {"font-weight": "normal"}
																	},
																	{
																		nodeType: "y-select",
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.locale"
																			}],
																		props: {
																			"v-model": "{itemModel.locale[0]}",
																			defaultValue: "",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															}]
													},
													{
														nodeType: "y-pre-form",
														"v-if": "{locale.CHN.instanceId===itemModel.locale[0]}",
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "itemModel.nameCHN"
															}],
														props: {
															model: "{itemModel.nameCHN[0]}",
															labelPosition: "top",
															span: 2,
															inline: true
														},
														children: [
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "中文姓",
																		style: {"font-weight": "normal"}
																	},
																	{
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].primaryFamilyName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].primaryFamilyName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "中文中间名",
																		style: {"font-weight": "normal"}
																	},
																	{
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].primaryMiddleName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].primaryMiddleName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "中文名",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].primaryGivenName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].primaryGivenName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "第二姓名的姓",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].secondaryFamilyName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].secondaryFamilyName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "第二姓名的中间名",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].secondaryMiddleName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].secondaryMiddleName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "第二姓名的名",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].secondaryGivenName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].secondaryGivenName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "第三姓名的姓",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].tertiaryFamilyName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].tertiaryFamilyName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "第三姓名的中间名",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].tertiaryMiddleName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].tertiaryMiddleName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "第三姓名的名",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].tertiaryGivenName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].tertiaryGivenName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "昵称",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].nickName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].nickName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																props: {
																	required: true
																},
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "显示姓名",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].displayName"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].displayName}",
																			defaultValue: ""
																		}
																	}]
															},
															{
																nodeType: "el-form-item",
																children: [
																	{
																		nodeType: "span",
																		slot: "label",
																		innerHTML: "头衔",
																		style: {"font-weight": "normal"}
																	}, {
																		nodeType: "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.nameCHN[0].title"
																			}],
																		props: {
																			"v-model": "{itemModel.nameCHN[0].title}",
																			defaultValue: ""
																		}
																	}]
															}
														]
													}
												]
											}]
									}
								]
							},
							//个人身份标识号
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "个人身份标识号"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.identifiers"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.personData.identifiers.push({})"
																		}
																	}]
															}
														]
													},
													{
														nodeType: "y-list",
														"v-if": "{formData.personData.identifiers&&formData.personData.identifiers.length}",
														style: {padding: "10px 20px 30px 20px"},
														props: {forList: "{formData.personData.identifiers}"},
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
																						handler: {
																							body: "formData.personData.identifiers.splice(index,1)"
																						}
																					}]
																			}]
																	},
																	{
																		nodeType: "y-pre-form",
																		props: {
																			model: "{itemModel}",
																			labelPosition: "top",
																			span: 2,
																			inline: true
																		},
																		children: [
																			{
																				nodeType: "el-form-item",
																				props: {
																					required: true
																				},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.locale"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "国家地区",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.locale[0]}",
																							defaultValue: "",
																							filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					required: true
																				},
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "类型",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.identificationType"
																							}],
																						props: {
																							"v-model": "{itemModel.identificationType}",
																							defaultValue: "",
																							filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "IDENTIFIER.identificationType"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					required: true
																				},
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "证件号",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.identificationId"
																							}],
																						props: {
																							"v-model": "{itemModel.identificationId}",
																							defaultValue: ""
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "发证日期",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-date-picker",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.issuedDate"
																							}],
																						props: {
																							"v-model": "{itemModel.issuedDate}",
																							defaultValue: ""
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "过期日期",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-date-picker",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.expirationDate"
																							}],
																						props: {
																							"v-model": "{itemModel.expirationDate}",
																							defaultValue: ""
																						}
																					}]
																			}]
																	}]
															}]
													}
												
												]
											}]
									}]
							},
							// 银行账号
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "银行账号"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.bankAccounts"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.personData.bankAccounts.push({})"
																		}
																	}]
															}
														]
													},
													{
														nodeType: "y-list",
														"v-if": "{formData.personData.bankAccounts&&formData.personData.bankAccounts.length}",
														style: {padding: "10px 20px 30px 20px"},
														props: {forList: "{formData.personData.bankAccounts}"},
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
																						handler: {
																							body: "formData.personData.bankAccounts.splice(index,1)"
																						}
																					}]
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.locale"
																					}],
																				"children": [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "LOCALE",
																							"v-model": "{itemModel.locale[0]}"
																						}
																					}],
																				"props": {
																					"label": "国家地区",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "BANK_ACCOUNT.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.type"
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "BANK",
																							"v-model": "{itemModel.bank[0]}"
																						}
																					}],
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.bank"
																					}],
																				"props": {
																					"label": "银行",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "BANK_BRANCH",
																							"v-model": "{itemModel.bankBranch[0]}"
																						}
																					}],
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.bankBranch"
																					}],
																				"props": {"label": "支行"}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.accountName"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.accountName}"
																						}
																					}],
																				"props": {
																					"label": "账户名",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.accountNumber"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.accountNumber}"
																						}
																					}],
																				"props": {
																					"label": "账户",
																					"required": true
																				}
																			}]
																	}]
															}]
													}
												
												]
											}]
									}]
							}
						]
					},
					{
						nodeType: "el-card",
						slot: "steps",
						style: {margin: "20px 0"},
						children: [
							{
								nodeType: "el-steps",
								props: {
									direction: "vertical",
									space: "100px",
									active: "{activeConfig.activeIndex}",
									"finish-status": "success"
								},
								children: [
									{
										nodeType: "el-step",
										props: {title: "个人信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "联系信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "雇佣信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "工作信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "薪酬信息"}
									}
								]
							}]
					}
				
				]
			},
			{
				nodeType: "y-steps",
				"v-if": "{activeConfig.activeIndex===1}",
				style: {
					"padding-right": "20px",
					"padding-bottom": "90px"
				},
				props: {stepPosition: "right"},
				children: [
					{
						nodeType: "el-container",
						props: {"direction": "vertical"},
						children: [
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "地址"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.addresses"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.personData.addresses.push({locale:[locale.CHN.instanceId]})"
																		}
																	}]
															}
														]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.personData.addresses&&formData.personData.addresses.length}",
														"props": {"forList": "{formData.personData.addresses}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "el-row",
																		"props": {"type": "flex"},
																		"style": {
																			"height": "30px",
																			"justify-content": "flex-end",
																			"align-items": "flex-end"
																		},
																		"children": [
																			{
																				"nodeType": "i",
																				"class": "el-icon-delete",
																				"on": [
																					{
																						"name": "click",
																						"handler": {"body": "formData.personData.addresses.splice(index,1)"}
																					}]
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "ADDRESS.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.locale"
																							}],
																						"props": {
																							"defaultValue": "",
																							"displayOnly": true,
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "LOCALE",
																							"v-model": "{itemModel.locale[0]}"
																						}
																					}],
																				"props": {
																					"label": "国家地区",
																					"required": true
																				}
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"v-if": "{!locale.CHN.instanceId||!itemModel.locale[0]||(locale.CHN.instanceId===itemModel.locale[0])}",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		defaultValueMap: [
																			{
																				value: "[{}]",
																				valueType: "Array",
																				key: "itemModel.addressCHN"
																			}],
																		"children": [
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].region"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "省市",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].region[0]}",
																							filter: {
																								data: {
																									type: "CHN_PROVINCE"
																								},
																								params: {
																									asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].city"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "城市",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].city[0]}",
																							filter: {
																								data: {
																									type: "CHN_CITY"
																								},
																								params: {
																									asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].district"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "地区",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].district[0]}",
																							filter: {
																								data: {type: "CHN_AREA"},
																								params: {
																									asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].subDistrict"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "子地区",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].subDistrict[0]}",
																							filter: {
																								data: {
																									type: "CHN_TOWN"
																								},
																								params: {
																									asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].address1"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "地址",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-input",
																						type: "text",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].address1}"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].postal"
																					}],
																				children: [
																					{
																						nodeType: "span",
																						slot: "label",
																						innerHTML: "邮政",
																						style: {"font-weight": "normal"}
																					},
																					{
																						nodeType: "y-input",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].postal}"
																						}
																					}]
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	"index": "index"
																}
															}]
													}
												]
											}]
									}]
							},
							//电话
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "电话"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.phones"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.personData.phones.push({})"
																		}
																	}]
															}
														]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.personData.phones&&formData.personData.phones.length}",
														"props": {"forList": "{formData.personData.phones}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "el-row",
																		"props": {"type": "flex"},
																		"style": {
																			"height": "30px",
																			"justify-content": "flex-end",
																			"align-items": "flex-end"
																		},
																		"children": [
																			{
																				"nodeType": "i",
																				"class": "el-icon-delete",
																				"on": [
																					{
																						"name": "click",
																						"handler": {"body": "formData.personData.phones.splice(index,1)"}
																					}]
																			}]
																	}, {
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "PHONE.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "LOCALE",
																							"v-model": "{itemModel.locale[0]}"
																						}
																					}],
																				"props": {
																					"label": "国家地区",
																					"required": true
																				},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.locale"
																					}]
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.interPrefix"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.interPrefix}"
																						}
																					}],
																				"props": {"label": "国际冠码"}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.trunkPrefix"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.trunkPrefix}"
																						}
																					}],
																				"props": {"label": "长途字冠"}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.phoneNumber"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.phoneNumber}"
																						}
																					}],
																				"props": {
																					"label": "号码",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.extension"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.extension}"
																						}
																					}],
																				"props": {"label": "分机"}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							//邮箱
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "邮箱"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.emails"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.personData.emails.push({})"
																		}
																	}]
															}
														]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.personData.emails&&formData.personData.emails.length}",
														"props": {"forList": "{formData.personData.emails}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "el-row",
																		"props": {"type": "flex"},
																		"style": {
																			"height": "30px",
																			"justify-content": "flex-end",
																			"align-items": "flex-end"
																		},
																		"children": [
																			{
																				"nodeType": "i",
																				"class": "el-icon-delete",
																				"on": [
																					{
																						"name": "click",
																						"handler": {"body": "formData.personData.emails.splice(index,1)"}
																					}]
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "EMAIL.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.email"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.email}"
																						}
																					}],
																				"props": {
																					"label": "邮箱",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "其他联系方式"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.otherContacts"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.personData.otherContacts.push({})"
																		}
																	}]
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.personData.otherContacts&&formData.personData.otherContacts.length}",
														"props": {"forList": "{formData.personData.otherContacts}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "el-row",
																		"props": {"type": "flex"},
																		"style": {
																			"height": "30px",
																			"justify-content": "flex-end",
																			"align-items": "flex-end"
																		},
																		"children": [
																			{
																				"nodeType": "i",
																				"class": "el-icon-delete",
																				"on": [
																					{
																						"name": "click",
																						"handler": {"body": "formData.personData.otherContacts.splice(index,1)"}
																					}]
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.otherContactType"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "OTHER_CONTACT.otherContactType",
																							"v-model": "{itemModel.otherContactType}"
																						}
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.otherContactId"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.otherContactId}"
																						}
																					}],
																				"props": {
																					"label": "其他联系方式ID",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							}
						]
					},
					{
						nodeType: "el-card",
						slot: "steps",
						style: {margin: "20px 0"},
						children: [
							{
								nodeType: "el-steps",
								props: {
									direction: "vertical",
									space: "100px",
									active: "{activeConfig.activeIndex}",
									"finish-status": "success"
								},
								children: [
									{
										nodeType: "el-step",
										props: {title: "个人信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "联系信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "雇佣信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "工作信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "薪酬信息"}
									}
								]
							}]
					}
				]
			},
			{
				nodeType: "y-steps",
				"v-if": "{activeConfig.activeIndex===2}",
				style: {
					"padding-right": "20px",
					"padding-bottom": "90px"
				},
				props: {stepPosition: "right"},
				children: [
					{
						nodeType: "el-container",
						props: {"direction": "vertical"},
						children: [
							//雇佣信息
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {"padding": "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																class: "required",
																innerHTML: "雇佣信息"
															}]
													},
													{
														"nodeType": "y-pre-form",
														"style": {"padding": "40px 20px 30px 20px"},
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.employment"
															}],
														
														"props": {
															"model": "{formData.employeeData.employment[0]}",
															"labelPosition": "top",
															"span": 2,
															"inline": true
														},
														"children": [
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-input",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "formData.employeeData.employment[0].employeeId"
																			}],
																		"props": {
																			"defaultValue": "",
																			"v-model": "{formData.employeeData.employment[0].employeeId}"
																		}
																	}],
																"props": {
																	"label": "雇佣工号",
																	"required": true
																}
															},
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-select",
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "formData.employeeData.employment[0].employmentType"
																			}],
																		"props": {
																			"defaultValue": "",
																			"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			"optionsPath": "EMPLOYMENT.employmentType",
																			"v-model": "{formData.employeeData.employment[0].employmentType}"
																		}
																	}],
																"props": {
																	"label": "雇佣类型",
																	"required": true
																}
															}]
													}]
											}]
									}]
							},
							//劳动关系
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																class: "required",
																innerHTML: "劳动关系"
															}],
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.workRelationships"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.workRelationships&&formData.employeeData.workRelationships.length}",
														"props": {"forList": "{formData.employeeData.workRelationships}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			// {
																			// 	"nodeType": "el-form-item",
																			// 	"children": [
																			// 		{
																			// 			"nodeType": "y-select",
																			// 			defaultValueMap: [
																			// 				{
																			// 					value: "HR",
																			// 					valueType: "String",
																			// 					key: "itemModel.assignmentType"
																			// 				}],
																			// 			"props": {
																			// 				"defaultValue": "",
																			// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			// 				"optionsPath": "WORK_RELATIONSHIPS.assignmentType",
																			// 				"v-model": "{itemModel.assignmentType}"
																			// 			}
																			// 		}],
																			// 	"props": {
																			// 		"label": "分配类型",
																			// 		"required": true
																			// 	}
																			// },
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.reason"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "WORK_RELATIONSHIPS.reason",
																							"v-model": "{itemModel.reason}"
																						}
																					}],
																				"props": {
																					"label": "原因",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.workRelationshipId"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.workRelationshipId}"
																						}
																					}],
																				"props": {
																					"label": "劳动关系ID",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.workRelationshipType"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "WORK_RELATIONSHIPS.workRelationshipType",
																							"v-model": "{itemModel.workRelationshipType}"
																						}
																					}],
																				"props": {
																					"label": "劳动关系类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-date-picker",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.hireDate"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.hireDate}"
																						}
																					}],
																				"props": {
																					"label": "入职日期",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							//劳动合同
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "劳动合同"
															}],
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.contracts"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.contracts&&formData.employeeData.contracts.length}",
														"props": {"forList": "{formData.employeeData.contracts}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "CONTRACTS.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-date-picker",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.startDate"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.startDate}"
																						}
																					}],
																				"props": {
																					"label": "开始日期",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-date-picker",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.endDate"
																							}],
																						"props": {
																							"defaultValue": "",
																							"v-model": "{itemModel.endDate}"
																						}
																					}],
																				"props": {"label": "结束日期"}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							}
						]
					},
					{
						nodeType: "el-card",
						slot: "steps",
						style: {margin: "20px 0"},
						children: [
							{
								nodeType: "el-steps",
								props: {
									direction: "vertical",
									space: "100px",
									active: "{activeConfig.activeIndex}",
									"finish-status": "success"
								},
								children: [
									{
										nodeType: "el-step",
										props: {title: "个人信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "联系信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "雇佣信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "工作信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "薪酬信息"}
									}
								]
							}]
					}
				]
			},
			{
				nodeType: "y-steps",
				"v-if": "{activeConfig.activeIndex===3}",
				style: {
					"padding-right": "20px",
					"padding-bottom": "90px"
				},
				props: {stepPosition: "right"},
				children: [
					{
						nodeType: "el-container",
						props: {"direction": "vertical"},
						children: [
							//职位
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "职位"
															}
														],
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.positions"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.positions&&formData.employeeData.positions.length}",
														"props": {"forList": "{formData.employeeData.positions}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			// {
																			// 	"nodeType": "el-form-item",
																			// 	"children": [
																			// 		{
																			// 			"nodeType": "y-select",
																			// 			defaultValueMap: [
																			// 				{
																			// 					value: "",
																			// 					valueType: "String",
																			// 					key: "itemModel.assignmentType"
																			// 				}],
																			// 			"props": {
																			// 				"defaultValue": "",
																			// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			// 				"optionsPath": "POSITIONS.assignmentType",
																			// 				"v-model": "{itemModel.assignmentType}"
																			// 			}
																			// 		}],
																			// 	"props": {
																			// 		"label": "分配类型",
																			// 		"required": true
																			// 	}
																			// },
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.position"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "POSITION",
																							"v-model": "{itemModel.position[0]}"
																						}
																					}],
																				"props": {
																					"label": "职位",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							// 职务
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																class: "required",
																innerHTML: "职务"
															}
														],
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.jobs"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.jobs&&formData.employeeData.jobs.length}",
														"props": {"forList": "{formData.employeeData.jobs}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			// {
																			// 	"nodeType": "el-form-item",
																			// 	"children": [
																			// 		{
																			// 			"nodeType": "y-select",
																			// 			defaultValueMap: [
																			// 				{
																			// 					value: "",
																			// 					valueType: "String",
																			// 					key: "itemModel.assignmentType"
																			// 				}],
																			// 			"props": {
																			// 				"defaultValue": "",
																			// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			// 				"optionsPath": "JOBS.assignmentType",
																			// 				"v-model": "{itemModel.assignmentType}"
																			// 			}
																			// 		}],
																			// 	"props": {
																			// 		"label": "分配类型",
																			// 		"required": true
																			// 	}
																			// },
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.job"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "JOB",
																							"v-model": "{itemModel.job[0]}"
																						}
																					}],
																				"props": {
																					"label": "职务",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							// 职级
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "职级"
															}],
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.managementLevels"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.managementLevels&&formData.employeeData.managementLevels.length}",
														"props": {"forList": "{formData.employeeData.managementLevels}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			// {
																			// 	"nodeType": "el-form-item",
																			// 	"children": [
																			// 		{
																			// 			"nodeType": "y-select",
																			// 			defaultValueMap: [
																			// 				{
																			// 					value: "",
																			// 					valueType: "String",
																			// 					key: "itemModel.assignmentType"
																			// 				}],
																			// 			"props": {
																			// 				"defaultValue": "",
																			// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			// 				"optionsPath": "MANAGEMENT_LEVELS.assignmentType",
																			// 				"v-model": "{itemModel.assignmentType}"
																			// 			}
																			// 		}],
																			// 	"props": {
																			// 		"label": "分配类型",
																			// 		"required": true
																			// 	}
																			// },
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.managementLevel"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "MANAGEMENT_LEVEL",
																							"v-model": "{itemModel.managementLevel[0]}"
																						}
																					}],
																				"props": {
																					"label": "职级",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							// 组织信息
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																class: "required",
																innerHTML: "组织信息"
															}],
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.organizations"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.organizations&&formData.employeeData.organizations.length}",
														"props": {"forList": "{formData.employeeData.organizations}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "ORGANIZATIONS.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				"props": {
																					"label": "组织类型",
																					"required": true
																				}
																			},
																			// {
																			// 	"nodeType": "el-form-item",
																			// 	"children": [
																			// 		{
																			// 			"nodeType": "y-select",
																			// 			defaultValueMap: [
																			// 				{
																			// 					value: "",
																			// 					valueType: "String",
																			// 					key: "itemModel.assignmentType"
																			// 				}],
																			// 			"props": {
																			// 				"defaultValue": "",
																			// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			// 				"optionsPath": "ORGANIZATIONS.assignmentType",
																			// 				"v-model": "{itemModel.assignmentType}"
																			// 			}
																			// 		}],
																			// 	"props": {
																			// 		"label": "分配类型",
																			// 		"required": true
																			// 	}
																			// },
																			{
																				"nodeType": "el-form-item",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.organization"
																					}],
																				"children": [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"defaultValue": "",
																							"optionsPath": "ORGANIZATION",
																							"filter": {
																								"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
																								"data": {"type": "{itemModel.type}"}
																							},
																							"v-model": "{itemModel.organization[0]}"
																						}
																					}],
																				"props": {
																					"label": "组织",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							},
							// 汇报关系
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "汇报关系"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.employeeData.managers"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.employeeData.managers.push({})"
																		}
																	}]
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.managers&&formData.employeeData.managers.length}",
														"props": {"forList": "{formData.employeeData.managers}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "el-row",
																		"props": {"type": "flex"},
																		"style": {
																			"height": "30px",
																			"justify-content": "flex-end",
																			"align-items": "flex-end"
																		},
																		"children": [
																			{
																				"nodeType": "i",
																				"class": "el-icon-delete",
																				"on": [
																					{
																						"name": "click",
																						"handler": {"body": "formData.employeeData.managers.splice(index,1)"}
																					}]
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "MANAGERS.type",
																							"v-model": "{itemModel.type}"
																						}
																					}],
																				"props": {
																					"label": "类型",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.manager"
																							}],
																						"props": {
																							"defaultValue": "",
																							"optionsPath": "EMPLOYEE",
																							"labelKey": "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																							"remoteFilterKey": "personal.names.nameCHN.displayName",
																							"filter": {
																								"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
																								"data": {"personal.names.type": "PREFERRED"}
																							},
																							"v-model": "{itemModel.manager[0]}"
																						}
																					}],
																				"props": {
																					"label": "主管",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							}
						]
					},
					{
						nodeType: "el-card",
						slot: "steps",
						style: {margin: "20px 0"},
						children: [
							{
								nodeType: "el-steps",
								props: {
									direction: "vertical",
									space: "100px",
									active: "{activeConfig.activeIndex}",
									"finish-status": "success"
								},
								children: [
									{
										nodeType: "el-step",
										props: {title: "个人信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "联系信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "雇佣信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "工作信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "薪酬信息"}
									}
								]
							}]
					}
				]
			},
			{
				nodeType: "y-steps",
				style: {
					"padding-right": "20px",
					"padding-bottom": "90px"
				},
				"v-if": "{activeConfig.activeIndex===4}",
				props: {stepPosition: "right"},
				children: [
					{
						nodeType: "el-container",
						props: {"direction": "vertical"},
						children: [
							
							// 薪酬信息
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {
													header: "薪酬信息",
													"body-style": {"padding": "0"}
												},
												children: [
													{
														"nodeType": "y-pre-form",
														"style": {"padding": "30px  20px"},
														defaultValueMap: [
															{
																value: "[{}]",
																valueType: "Array",
																key: "formData.employeeData.compensation"
															}],
														"props": {
															"model": "{formData.employeeData.compensation[0]}",
															"labelPosition": "top",
															"span": 2,
															"inline": true
														},
														"children": [
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-select",
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "formData.employeeData.compensation[0].grade"
																			}],
																		"props": {
																			"defaultValue": "",
																			"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			"optionsPath": "COMPENSATION.grade",
																			"v-model": "{formData.employeeData.compensation[0].grade[0]}"
																		}
																	}],
																"props": {"label": "薪等"}
															},
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-select",
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "formData.employeeData.compensation[0].step"
																			}],
																		"props": {
																			"defaultValue": "",
																			"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			"optionsPath": "COMPENSATION.step",
																			"v-model": "{formData.employeeData.compensation[0].step[0]}"
																		}
																	}],
																"props": {"label": "薪级"}
															}]
													}]
											}]
									}]
							},
							// 薪酬项
							{
								nodeType: "el-row",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-col",
										children: [
											{
												nodeType: "el-card",
												props: {"body-style": {padding: "0"}},
												children: [
													{
														nodeType: "el-row",
														slot: "header",
														props: {type: "flex"},
														style: {"align-items": "center"},
														children: [
															{
																nodeType: "div",
																style: {flex: "auto"},
																innerHTML: "薪酬项"
															},
															{
																nodeType: "i",
																defaultValueMap: [
																	{
																		value: "[]",
																		valueType: "Array",
																		key: "formData.personData.payComponents"
																	}],
																class: "el-icon-plus",
																on: [
																	{
																		name: "click",
																		handler: {
																			body: "formData.employeeData.payComponents.push({})"
																		}
																	}]
															}],
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "formData.employeeData.payComponents"
															}]
													},
													{
														"nodeType": "y-list",
														"style": {"padding": "10px 20px 30px 20px"},
														"v-if": "{formData.employeeData.payComponents&&formData.employeeData.payComponents.length}",
														"props": {"forList": "{formData.employeeData.payComponents}"},
														"scopedSlots": [
															{
																"name": "default",
																"nodes": [
																	{
																		"nodeType": "el-row",
																		"props": {"type": "flex"},
																		"style": {
																			"height": "30px",
																			"justify-content": "flex-end",
																			"align-items": "flex-end"
																		},
																		"children": [
																			{
																				"nodeType": "i",
																				"class": "el-icon-delete",
																				"on": [
																					{
																						"name": "click",
																						"handler": {"body": "formData.employeeData.payComponents.splice(index,1)"}
																					}]
																			}]
																	},
																	{
																		"nodeType": "y-pre-form",
																		"props": {
																			"model": "{itemModel}",
																			"labelPosition": "top",
																			"span": 2,
																			"inline": true
																		},
																		"children": [
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.payComponent"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "PAY_COMPONENTS.payComponent",
																							"v-model": "{itemModel.payComponent[0]}"
																						}
																					}],
																				"props": {
																					"label": "薪酬项",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-select",
																						defaultValueMap: [
																							{
																								value: "[\"\"]",
																								valueType: "Array",
																								key: "itemModel.currency"
																							}],
																						"props": {
																							"defaultValue": "",
																							"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"optionsPath": "CURRENCY",
																							"v-model": "{itemModel.currency[0]}"
																						}
																					}],
																				"props": {
																					"label": "货币",
																					"required": true
																				}
																			},
																			{
																				"nodeType": "el-form-item",
																				"children": [
																					{
																						"nodeType": "y-input-number",
																						defaultValueMap: [
																							{
																								value: "0",
																								valueType: "Number",
																								key: "itemModel.payRate"
																							}],
																						"props": {
																							"defaultValue": 0,
																							controls: false,
																							"precision": 2,
																							"v-model": "{itemModel.payRate}"
																						}
																					}],
																				"props": {
																					"label": "值",
																					"required": true
																				}
																			}]
																	}],
																"scopeMapping": {
																	"itemModel": "item",
																	index: "index"
																}
															}]
													}]
											}]
									}]
							}
						]
					},
					{
						nodeType: "el-card",
						slot: "steps",
						style: {margin: "20px 0"},
						children: [
							{
								nodeType: "el-steps",
								props: {
									direction: "vertical",
									space: "100px",
									active: "{activeConfig.activeIndex}",
									"finish-status": "success"
								},
								children: [
									{
										nodeType: "el-step",
										props: {title: "个人信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "联系信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "雇佣信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "工作信息"}
									},
									{
										nodeType: "el-step",
										props: {title: "薪酬信息"}
									}
								]
							}]
					}]
			},
			{
				nodeType: "el-row",
				style: {
					flex: "none",
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					"z-index":1
				},
				children: [
					{
						nodeType: "el-col",
						children: [
							{
								nodeType: "el-card",
								children: [
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
														"v-if": "{activeConfig.activeIndex===0}",
														props: {size: "mini"},
														innerHTML: "返回",
														on: [
															{
																name: "click",
																handler: {name: "toList"}
															}]
													},
													{
														nodeType: "y-button",
														"v-if": "{activeConfig.activeIndex!==0}",
														props: {size: "mini"},
														innerHTML: "上一步",
														on: [
															{
																name: "click",
																handler: {body: "activeConfig.activeIndex--;scrollToTop();"}
															}]
													},
													{
														nodeType: "el-button",
														"v-if": "{activeConfig.activeIndex!==4}",
														props: {
															size: "mini",
															type: "primary"
														},
														innerHTML: "下一步",
														on: [
															{
																name: "click",
																handler: {body: "activeConfig.activeIndex++;scrollToTop();"}
															}]
													},
													{
														nodeType: "el-button",
														"v-if": "{activeConfig.activeIndex===4}",
														props: {
															size: "mini",
															type: "primary"
														},
														innerHTML: "提交",
														on: [
															{
																name: "click",
																handler: {name: "submit"}
															}]
													}]
											}]
									}]
							}]
					}]
			}
			// {
			// 	nodeType: "el-form",
			// 	props: {model: "{formData}"},
			// 	children: [
			// 		{
			// 			nodeType: "y-carousel",
			// 			class: "y-carousel-no-animate",
			// 			props: {
			// 				containerDirection: "vertical",
			// 				height: "calc(100px - 10px)",
			// 				// height: "{'calc('+(mainContentHeight||100)+'px - 10px)'}",
			// 				autoplay: false,
			// 				"indicator-position": "none",
			// 				arrow: "never",
			// 				"initial-index": "{activeConfig.activeIndex}"
			// 			},
			// 			scopedSlots: [
			// 				{
			// 					name: "actions",
			// 					scopeMapping: {carousel: "carousel"},
			// 					nodes: [
			// 						{
			// 							nodeType: "el-row",
			// 							style: {flex: "none"},
			// 							children: [
			// 								{
			// 									nodeType: "el-col",
			// 									children: [
			// 										{
			// 											nodeType: "el-card",
			// 											children: [
			// 												{
			// 													nodeType: "el-row",
			// 													props: {type: "flex"},
			// 													style: {"justify-content": "center"},
			// 													children: [
			// 														{
			// 															nodeType: "div",
			// 															style: {flex: "none"},
			// 															children: [
			// 																{
			// 																	nodeType: "y-button",
			// 																	"v-if": "{activeConfig.activeIndex===0}",
			// 																	props: {size: "mini"},
			// 																	innerHTML: "返回",
			// 																	on: [
			// 																		{
			// 																			name: "click",
			// 																			handler: {name: "toList"}
			// 																		}]
			// 																},
			// 																{
			// 																	nodeType: "y-button",
			// 																	"v-if": "{activeConfig.activeIndex!==0}",
			// 																	props: {size: "mini"},
			// 																	innerHTML: "上一步",
			// 																	on: [
			// 																		{
			// 																			name: "click",
			// 																			handler: {body: "activeConfig.activeIndex--;carousel.setActiveItem(activeConfig.activeIndex)"}
			// 																		}]
			// 																},
			// 																{
			// 																	nodeType: "el-button",
			// 																	"v-if": "{activeConfig.activeIndex!==4}",
			// 																	props: {
			// 																		size: "mini",
			// 																		type: "primary"
			// 																	},
			// 																	innerHTML: "下一步",
			// 																	on: [
			// 																		{
			// 																			name: "click",
			// 																			handler: {body: "activeConfig.activeIndex++;carousel.setActiveItem(activeConfig.activeIndex)"}
			// 																		}]
			// 																},
			// 																{
			// 																	nodeType: "el-button",
			// 																	"v-if": "{activeConfig.activeIndex===4}",
			// 																	props: {
			// 																		size: "mini",
			// 																		type: "primary"
			// 																	},
			// 																	innerHTML: "提交",
			// 																	on: [
			// 																		{
			// 																			name: "click",
			// 																			handler: {name: "submit"}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										}]
			// 								}]
			// 						}]
			// 				}],
			// 			children: [
			// 				{
			// 					nodeType: "el-carousel-item",
			// 					props: {name: "carouselItem0"},
			// 					children: [
			// 						{
			// 							nodeType: "y-steps",
			// 							props: {stepPosition: "right"},
			// 							style: {
			// 								"padding-right": "20px",
			// 								"padding-bottom": "90px"
			// 							},
			// 							children: [
			// 								{
			// 									nodeType: "el-container",
			// 									props: {"direction": "vertical"},
			// 									children: [
			// 										// 个人信息
			// 										{
			// 											nodeType: "el-card",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											props: {
			// 												header: "档案资料",
			// 												"body-style": {"padding": "0"}
			// 											},
			// 											defaultValueMap: [
			// 												{
			// 													value: "[{}]",
			// 													valueType: "Array",
			// 													key: "formData.personData.biographical"
			// 												}],
			// 											children: [
			// 												{
			// 													nodeType: "y-pre-form",
			// 													style: {padding: "40px 20px 30px 20px"},
			// 													props: {
			// 														model: "{formData.personData.biographical[0]}",
			// 														labelPosition: "top",
			// 														span: 2,
			// 														inline: true
			// 													},
			// 													children: [
			// 														{
			// 															nodeType: "el-form-item",
			// 															defaultValueMap: [
			// 																{
			// 																	value: "",
			// 																	valueType: "String",
			// 																	key: "formData.personData.biographical[0].dateOfBirth"
			// 																}],
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "出生日期",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-date-picker",
			// 																	props: {
			// 																		"v-model": "{formData.personData.biographical[0].dateOfBirth}",
			// 																		defaultValue: ""
			// 																	}
			// 																}]
			// 														},
			// 														{
			// 															nodeType: "el-form-item",
			// 															defaultValueMap: [
			// 																{
			// 																	value: "[\"\"]",
			// 																	valueType: "Array",
			// 																	key: "formData.personData.biographical[0].birthLocale"
			// 																}],
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "出生国家地区",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	props: {
			// 																		"v-model": "{formData.personData.biographical[0].birthLocale[0]}",
			// 																		optionsPath: "LOCALE",
			// 																		filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}}
			// 																	}
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										//中国-本地信息
			// 										{
			// 											nodeType: "el-card",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											props: {
			// 												header: "本地信息(中国)",
			// 												"body-style": {"padding": "0"}
			// 											},
			// 											defaultValueMap: [
			// 												{
			// 													value: "[{}]",
			// 													valueType: "Array",
			// 													key: "formData.personData.personRegional"
			// 												},
			// 												{
			// 													value: "[{}]",
			// 													valueType: "Array",
			// 													key: "formData.personData.personRegional[0].personRegionalCHN"
			// 												}],
			// 											children: [
			// 												{
			// 													nodeType: "y-pre-form",
			// 													style: {"padding": "40px 20px 30px 20px"},
			// 													props: {
			// 														model: "{formData.personData.personRegional[0].personRegionalCHN[0]}",
			// 														labelPosition: "top",
			// 														span: 2,
			// 														inline: true
			// 													},
			// 													children: [
			// 														{
			// 															nodeType: "el-form-item",
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "国籍",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "",
			// 																			valueType: "String",
			// 																			key: "formData.personData.personRegional[0].personRegionalCHN[0].nationalityRegion"
			// 																		}],
			// 																	props: {
			// 																		"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].nationalityRegion}",
			// 																		defaultValue: "",
			// 																		optionsPath: "PERSON_REGIONAL_CHN.nationalityRegion"
			// 																	}
			// 																}]
			// 														},
			// 														{
			// 															nodeType: "el-form-item",
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "性别",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "",
			// 																			valueType: "String",
			// 																			key: "formData.personData.personRegional[0].personRegionalCHN[0].gender"
			// 																		}],
			// 																	props: {
			// 																		"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].gender}",
			// 																		defaultValue: "",
			// 																		filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																		optionsPath: "PERSON_REGIONAL_CHN.gender"
			// 																	}
			// 																}]
			// 														},
			// 														{
			// 															nodeType: "el-form-item",
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "婚姻状态",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "",
			// 																			valueType: "String",
			// 																			key: "formData.personData.personRegional[0].personRegionalCHN[0].maritalStatus"
			// 																		}],
			// 																	props: {
			// 																		"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].maritalStatus}",
			// 																		defaultValue: "",
			// 																		filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																		optionsPath: "PERSON_REGIONAL_CHN.maritalStatus"
			// 																	}
			// 																}]
			// 														},
			// 														{
			// 															nodeType: "el-form-item",
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "户口",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "",
			// 																			valueType: "String",
			// 																			key: "formData.personData.personRegional[0].personRegionalCHN[0].huKou"
			// 																		}],
			// 																	props: {
			// 																		"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].huKou}",
			// 																		defaultValue: "",
			// 																		filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																		optionsPath: "PERSON_REGIONAL_CHN.huKou"
			// 																	}
			// 																}]
			// 														},
			// 														{
			// 															nodeType: "el-form-item",
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "民族",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "",
			// 																			valueType: "String",
			// 																			key: "formData.personData.personRegional[0].personRegionalCHN[0].ethnicity"
			// 																		}],
			// 																	props: {
			// 																		"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].ethnicity}",
			// 																		defaultValue: "",
			// 																		filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																		optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
			// 																	}
			// 																}]
			// 														},
			// 														{
			// 															nodeType: "el-form-item",
			// 															children: [
			// 																{
			// 																	nodeType: "span",
			// 																	slot: "label",
			// 																	innerHTML: "政治面貌",
			// 																	style: {"font-weight": "normal"}
			// 																},
			// 																{
			// 																	nodeType: "y-select",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "",
			// 																			valueType: "String",
			// 																			key: "formData.personData.personRegional[0].personRegionalCHN[0].politicsStatus"
			// 																		}],
			// 																	props: {
			// 																		"v-model": "{formData.personData.personRegional[0].personRegionalCHN[0].politicsStatus}",
			// 																		defaultValue: "",
			// 																		filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																		optionsPath: "PERSON_REGIONAL_CHN.politicsStatus"
			// 																	}
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										//姓名
			// 										{
			// 											nodeType: "el-card",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											props: {"body-style": {padding: "0"}},
			// 											children: [
			// 												{
			// 													nodeType: "el-row",
			// 													slot: "header",
			// 													props: {type: "flex"},
			// 													style: {"align-items": "center"},
			// 													children: [
			// 														{
			// 															nodeType: "div",
			// 															style: {flex: "auto"},
			// 															class: "required",
			// 															innerHTML: "姓名"
			// 														},
			// 														{
			// 															nodeType: "i",
			// 															defaultValueMap: [
			// 																{
			// 																	value: "[]",
			// 																	valueType: "Array",
			// 																	key: "formData.personData.names"
			// 																}],
			// 															class: "el-icon-plus",
			// 															on: [
			// 																{
			// 																	name: "click",
			// 																	handler: {
			// 																		body: "formData.personData.names.push({locale:[locale.CHN.instanceId]})"
			// 																	}
			// 																}]
			// 														}]
			// 												},
			// 												{
			// 													nodeType: "y-list",
			// 													"v-if": "{formData.personData.names&&formData.personData.names.length}",
			// 													style: {padding: "10px 20px 30px 20px"},
			// 													props: {forList: "{formData.personData.names}"},
			// 													scopedSlots: [
			// 														{
			// 															name: "default",
			// 															scopeMapping: {
			// 																itemModel: "item",
			// 																index: "index"
			// 															},
			// 															nodes: [
			// 																{
			// 																	nodeType: "el-row",
			//
			// 																	props: {type: "flex"},
			// 																	style: {
			// 																		height: "30px",
			// 																		"justify-content": "flex-end",
			// 																		"align-items": "flex-end"
			// 																	},
			// 																	children: [
			// 																		{
			// 																			nodeType: "i",
			// 																			class: "el-icon-delete",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.names.splice(index,1)"
			// 																					}
			// 																				}]
			// 																		}]
			// 																},
			// 																{
			// 																	nodeType: "y-pre-form",
			// 																	props: {
			// 																		model: "{itemModel}",
			// 																		labelPosition: "top",
			// 																		span: 2,
			// 																		inline: true
			// 																	},
			// 																	children: [
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			props: {
			// 																				required: true
			// 																			},
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "类型",
			// 																					style: {"font-weight": "normal"}
			// 																				},
			// 																				{
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.type"
			// 																						}],
			// 																					nodeType: "y-select",
			// 																					props: {
			// 																						"v-model": "{itemModel.type}",
			// 																						defaultValue: "",
			// 																						filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						optionsPath: "NAME.type"
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			props: {
			// 																				required: true
			// 																			},
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "国家地区",
			// 																					style: {"font-weight": "normal"}
			// 																				},
			// 																				{
			// 																					nodeType: "y-select",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "[\"\"]",
			// 																							valueType: "Array",
			// 																							key: "itemModel.locale"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.locale[0]}",
			// 																						defaultValue: "",
			// 																						displayOnly: true,
			// 																						filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						optionsPath: "LOCALE"
			// 																					}
			// 																				}]
			// 																		}]
			// 																},
			// 																{
			// 																	nodeType: "y-pre-form",
			// 																	"v-if": "{locale.CHN.instanceId===itemModel.locale[0]}",
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "itemModel.nameCHN"
			// 																		}],
			// 																	props: {
			// 																		model: "{itemModel.nameCHN[0]}",
			// 																		labelPosition: "top",
			// 																		span: 2,
			// 																		inline: true
			// 																	},
			// 																	children: [
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "中文姓",
			// 																					style: {"font-weight": "normal"}
			// 																				},
			// 																				{
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].primaryFamilyName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].primaryFamilyName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "中文中间名",
			// 																					style: {"font-weight": "normal"}
			// 																				},
			// 																				{
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].primaryMiddleName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].primaryMiddleName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "中文名",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].primaryGivenName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].primaryGivenName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "第二姓名的姓",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].secondaryFamilyName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].secondaryFamilyName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "第二姓名的中间名",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].secondaryMiddleName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].secondaryMiddleName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "第二姓名的名",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].secondaryGivenName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].secondaryGivenName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "第三姓名的姓",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].tertiaryFamilyName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].tertiaryFamilyName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "第三姓名的中间名",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].tertiaryMiddleName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].tertiaryMiddleName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "第三姓名的名",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].tertiaryGivenName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].tertiaryGivenName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "昵称",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].nickName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].nickName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			props: {
			// 																				required: true
			// 																			},
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "显示姓名",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].displayName"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].displayName}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		},
			// 																		{
			// 																			nodeType: "el-form-item",
			// 																			children: [
			// 																				{
			// 																					nodeType: "span",
			// 																					slot: "label",
			// 																					innerHTML: "头衔",
			// 																					style: {"font-weight": "normal"}
			// 																				}, {
			// 																					nodeType: "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "itemModel.nameCHN[0].title"
			// 																						}],
			// 																					props: {
			// 																						"v-model": "{itemModel.nameCHN[0].title}",
			// 																						defaultValue: ""
			// 																					}
			// 																				}]
			// 																		}
			// 																	]
			// 																}
			// 															]
			// 														}]
			// 												}
			// 											]
			// 										},
			// 										//个人身份标识号
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "个人身份标识号"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.identifiers"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.identifiers.push({})"
			// 																					}
			// 																				}]
			// 																		}
			// 																	]
			// 																},
			// 																{
			// 																	nodeType: "y-list",
			// 																	"v-if": "{formData.personData.identifiers&&formData.personData.identifiers.length}",
			// 																	style: {padding: "10px 20px 30px 20px"},
			// 																	props: {forList: "{formData.personData.identifiers}"},
			// 																	scopedSlots: [
			// 																		{
			// 																			name: "default",
			// 																			scopeMapping: {
			// 																				itemModel: "item",
			// 																				index: "index"
			// 																			},
			// 																			nodes: [
			// 																				{
			// 																					nodeType: "el-row",
			// 																					props: {type: "flex"},
			// 																					style: {
			// 																						height: "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					children: [
			// 																						{
			// 																							nodeType: "i",
			// 																							class: "el-icon-delete",
			// 																							on: [
			// 																								{
			// 																									name: "click",
			// 																									handler: {
			// 																										body: "formData.personData.identifiers.splice(index,1)"
			// 																									}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					nodeType: "y-pre-form",
			// 																					props: {
			// 																						model: "{itemModel}",
			// 																						labelPosition: "top",
			// 																						span: 2,
			// 																						inline: true
			// 																					},
			// 																					children: [
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							props: {
			// 																								required: true
			// 																							},
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.locale"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "国家地区",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-select",
			// 																									props: {
			// 																										"v-model": "{itemModel.locale[0]}",
			// 																										defaultValue: "",
			// 																										filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										optionsPath: "LOCALE"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							props: {
			// 																								required: true
			// 																							},
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "类型",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.identificationType"
			// 																										}],
			// 																									props: {
			// 																										"v-model": "{itemModel.identificationType}",
			// 																										defaultValue: "",
			// 																										filter: {params: {asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										optionsPath: "IDENTIFIER.identificationType"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							props: {
			// 																								required: true
			// 																							},
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "证件号",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.identificationId"
			// 																										}],
			// 																									props: {
			// 																										"v-model": "{itemModel.identificationId}",
			// 																										defaultValue: ""
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "发证日期",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-date-picker",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.issuedDate"
			// 																										}],
			// 																									props: {
			// 																										"v-model": "{itemModel.issuedDate}",
			// 																										defaultValue: ""
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "过期日期",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-date-picker",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.expirationDate"
			// 																										}],
			// 																									props: {
			// 																										"v-model": "{itemModel.expirationDate}",
			// 																										defaultValue: ""
			// 																									}
			// 																								}]
			// 																						}]
			// 																				}]
			// 																		}]
			// 																}
			//
			// 															]
			// 														}]
			// 												}]
			// 										},
			// 										// 银行账号
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "银行账号"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.bankAccounts"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.bankAccounts.push({})"
			// 																					}
			// 																				}]
			// 																		}
			// 																	]
			// 																},
			// 																{
			// 																	nodeType: "y-list",
			// 																	"v-if": "{formData.personData.bankAccounts&&formData.personData.bankAccounts.length}",
			// 																	style: {padding: "10px 20px 30px 20px"},
			// 																	props: {forList: "{formData.personData.bankAccounts}"},
			// 																	scopedSlots: [
			// 																		{
			// 																			name: "default",
			// 																			scopeMapping: {
			// 																				itemModel: "item",
			// 																				index: "index"
			// 																			},
			// 																			nodes: [
			// 																				{
			// 																					nodeType: "el-row",
			// 																					props: {type: "flex"},
			// 																					style: {
			// 																						height: "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					children: [
			// 																						{
			// 																							nodeType: "i",
			// 																							class: "el-icon-delete",
			// 																							on: [
			// 																								{
			// 																									name: "click",
			// 																									handler: {
			// 																										body: "formData.personData.bankAccounts.splice(index,1)"
			// 																									}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.locale"
			// 																								}],
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "LOCALE",
			// 																										"v-model": "{itemModel.locale[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "国家地区",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "BANK_ACCOUNT.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "",
			// 																									valueType: "String",
			// 																									key: "itemModel.type"
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "BANK",
			// 																										"v-model": "{itemModel.bank[0]}"
			// 																									}
			// 																								}],
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.bank"
			// 																								}],
			// 																							"props": {
			// 																								"label": "银行",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "BANK_BRANCH",
			// 																										"v-model": "{itemModel.bankBranch[0]}"
			// 																									}
			// 																								}],
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.bankBranch"
			// 																								}],
			// 																							"props": {"label": "支行"}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.accountName"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.accountName}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "账户名",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.accountNumber"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.accountNumber}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "账户",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}]
			// 																		}]
			// 																}
			//
			// 															]
			// 														}]
			// 												}]
			// 										}
			// 									]
			// 								},
			// 								{
			// 									nodeType: "el-card",
			// 									slot: "steps",
			// 									style: {margin: "20px 0"},
			// 									children: [
			// 										{
			// 											nodeType: "el-steps",
			// 											props: {
			// 												direction: "vertical",
			// 												space: "100px",
			// 												active: "{activeConfig.activeIndex}",
			// 												"finish-status": "success"
			// 											},
			// 											children: [
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "个人信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "联系信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "雇佣信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "工作信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "薪酬信息"}
			// 												}
			// 											]
			// 										}]
			// 								}
			//
			// 							]
			// 						}
			// 					]
			// 				},
			// 				{
			// 					nodeType: "el-carousel-item",
			// 					props: {name: "carouselItem1"},
			// 					children: [
			// 						{
			// 							nodeType: "ySteps",
			// 							props: {stepPosition: "right"},
			// 							children: [
			// 								{
			// 									nodeType: "el-container",
			// 									props: {"direction": "vertical"},
			// 									children: [
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "地址"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.addresses"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.addresses.push({locale:[locale.CHN.instanceId]})"
			// 																					}
			// 																				}]
			// 																		}
			// 																	]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.personData.addresses&&formData.personData.addresses.length}",
			// 																	"props": {"forList": "{formData.personData.addresses}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "el-row",
			// 																					"props": {"type": "flex"},
			// 																					"style": {
			// 																						"height": "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "i",
			// 																							"class": "el-icon-delete",
			// 																							"on": [
			// 																								{
			// 																									"name": "click",
			// 																									"handler": {"body": "formData.personData.addresses.splice(index,1)"}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.type"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "ADDRESS.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.locale"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"displayOnly": true,
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "LOCALE",
			// 																										"v-model": "{itemModel.locale[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "国家地区",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"v-if": "{!locale.CHN.instanceId||!itemModel.locale[0]||(locale.CHN.instanceId===itemModel.locale[0])}",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "[{}]",
			// 																							valueType: "Array",
			// 																							key: "itemModel.addressCHN"
			// 																						}],
			// 																					"children": [
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.addressCHN[0].region"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "省市",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-select",
			// 																									props: {
			// 																										"v-model": "{itemModel.addressCHN[0].region[0]}",
			// 																										filter: {
			// 																											data: {
			// 																												type: "CHN_PROVINCE"
			// 																											},
			// 																											params: {
			// 																												asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
			// 																											}
			// 																										},
			// 																										optionsPath: "REGION"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.addressCHN[0].city"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "城市",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-select",
			// 																									props: {
			// 																										"v-model": "{itemModel.addressCHN[0].city[0]}",
			// 																										filter: {
			// 																											data: {
			// 																												type: "CHN_CITY"
			// 																											},
			// 																											params: {
			// 																												asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
			// 																											}
			// 																										},
			// 																										optionsPath: "REGION"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.addressCHN[0].district"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "地区",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-select",
			// 																									props: {
			// 																										"v-model": "{itemModel.addressCHN[0].district[0]}",
			// 																										filter: {
			// 																											data: {type: "CHN_AREA"},
			// 																											params: {
			// 																												asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
			// 																											}
			// 																										},
			// 																										optionsPath: "REGION"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.addressCHN[0].subDistrict"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "子地区",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-select",
			// 																									props: {
			// 																										"v-model": "{itemModel.addressCHN[0].subDistrict[0]}",
			// 																										filter: {
			// 																											data: {
			// 																												type: "CHN_TOWN"
			// 																											},
			// 																											params: {
			// 																												asOfDate: "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
			// 																											}
			// 																										},
			// 																										optionsPath: "REGION"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "",
			// 																									valueType: "String",
			// 																									key: "itemModel.addressCHN[0].address1"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "地址",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-input",
			// 																									type: "text",
			// 																									props: {
			// 																										"v-model": "{itemModel.addressCHN[0].address1}"
			// 																									}
			// 																								}]
			// 																						},
			// 																						{
			// 																							nodeType: "el-form-item",
			// 																							"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "",
			// 																									valueType: "String",
			// 																									key: "itemModel.addressCHN[0].postal"
			// 																								}],
			// 																							children: [
			// 																								{
			// 																									nodeType: "span",
			// 																									slot: "label",
			// 																									innerHTML: "邮政",
			// 																									style: {"font-weight": "normal"}
			// 																								},
			// 																								{
			// 																									nodeType: "y-input",
			// 																									props: {
			// 																										"v-model": "{itemModel.addressCHN[0].postal}"
			// 																									}
			// 																								}]
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				"index": "index"
			// 																			}
			// 																		}]
			// 																}
			// 															]
			// 														}]
			// 												}]
			// 										},
			// 										//电话
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "电话"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.phones"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.phones.push({})"
			// 																					}
			// 																				}]
			// 																		}
			// 																	]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.personData.phones&&formData.personData.phones.length}",
			// 																	"props": {"forList": "{formData.personData.phones}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "el-row",
			// 																					"props": {"type": "flex"},
			// 																					"style": {
			// 																						"height": "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "i",
			// 																							"class": "el-icon-delete",
			// 																							"on": [
			// 																								{
			// 																									"name": "click",
			// 																									"handler": {"body": "formData.personData.phones.splice(index,1)"}
			// 																								}]
			// 																						}]
			// 																				}, {
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.type"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "PHONE.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "LOCALE",
			// 																										"v-model": "{itemModel.locale[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "国家地区",
			// 																								"required": true
			// 																							},
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.locale"
			// 																								}]
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.interPrefix"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.interPrefix}"
			// 																									}
			// 																								}],
			// 																							"props": {"label": "国际冠码"}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.trunkPrefix"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.trunkPrefix}"
			// 																									}
			// 																								}],
			// 																							"props": {"label": "长途字冠"}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.phoneNumber"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.phoneNumber}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "号码",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.extension"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.extension}"
			// 																									}
			// 																								}],
			// 																							"props": {"label": "分机"}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										//邮箱
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "邮箱"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.emails"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.emails.push({})"
			// 																					}
			// 																				}]
			// 																		}
			// 																	]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.personData.emails&&formData.personData.emails.length}",
			// 																	"props": {"forList": "{formData.personData.emails}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "el-row",
			// 																					"props": {"type": "flex"},
			// 																					"style": {
			// 																						"height": "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "i",
			// 																							"class": "el-icon-delete",
			// 																							"on": [
			// 																								{
			// 																									"name": "click",
			// 																									"handler": {"body": "formData.personData.emails.splice(index,1)"}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.type"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "EMAIL.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.email"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.email}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "邮箱",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "其他联系方式"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.otherContacts"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.personData.otherContacts.push({})"
			// 																					}
			// 																				}]
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.personData.otherContacts&&formData.personData.otherContacts.length}",
			// 																	"props": {"forList": "{formData.personData.otherContacts}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "el-row",
			// 																					"props": {"type": "flex"},
			// 																					"style": {
			// 																						"height": "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "i",
			// 																							"class": "el-icon-delete",
			// 																							"on": [
			// 																								{
			// 																									"name": "click",
			// 																									"handler": {"body": "formData.personData.otherContacts.splice(index,1)"}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.otherContactType"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "OTHER_CONTACT.otherContactType",
			// 																										"v-model": "{itemModel.otherContactType}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.otherContactId"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.otherContactId}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "其他联系方式ID",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										}
			// 									]
			// 								},
			// 								{
			// 									nodeType: "el-card",
			// 									slot: "steps",
			// 									style: {margin: "20px 0"},
			// 									children: [
			// 										{
			// 											nodeType: "el-steps",
			// 											props: {
			// 												direction: "vertical",
			// 												space: "100px",
			// 												active: "{activeConfig.activeIndex}",
			// 												"finish-status": "success"
			// 											},
			// 											children: [
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "个人信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "联系信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "雇佣信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "工作信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "薪酬信息"}
			// 												}
			// 											]
			// 										}]
			// 								}
			// 							]
			// 						}
			// 					]
			// 				},
			// 				{
			// 					nodeType: "el-carousel-item",
			// 					props: {name: "carouselItem2"},
			// 					children: [
			// 						{
			// 							nodeType: "ySteps",
			// 							props: {stepPosition: "right"},
			// 							children: [
			// 								{
			// 									nodeType: "el-container",
			// 									props: {"direction": "vertical"},
			// 									children: [
			// 										//雇佣信息
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {"padding": "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			class: "required",
			// 																			innerHTML: "雇佣信息"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-pre-form",
			// 																	"style": {"padding": "40px 20px 30px 20px"},
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.employment"
			// 																		}],
			//
			// 																	"props": {
			// 																		"model": "{formData.employeeData.employment[0]}",
			// 																		"labelPosition": "top",
			// 																		"span": 2,
			// 																		"inline": true
			// 																	},
			// 																	"children": [
			// 																		{
			// 																			"nodeType": "el-form-item",
			// 																			"children": [
			// 																				{
			// 																					"nodeType": "y-input",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "formData.employeeData.employment[0].employeeId"
			// 																						}],
			// 																					"props": {
			// 																						"defaultValue": "",
			// 																						"v-model": "{formData.employeeData.employment[0].employeeId}"
			// 																					}
			// 																				}],
			// 																			"props": {
			// 																				"label": "雇佣工号",
			// 																				"required": true
			// 																			}
			// 																		},
			// 																		{
			// 																			"nodeType": "el-form-item",
			// 																			"children": [
			// 																				{
			// 																					"nodeType": "y-select",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "",
			// 																							valueType: "String",
			// 																							key: "formData.employeeData.employment[0].employmentType"
			// 																						}],
			// 																					"props": {
			// 																						"defaultValue": "",
			// 																						"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						"optionsPath": "EMPLOYMENT.employmentType",
			// 																						"v-model": "{formData.employeeData.employment[0].employmentType}"
			// 																					}
			// 																				}],
			// 																			"props": {
			// 																				"label": "雇佣类型",
			// 																				"required": true
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										//劳动关系
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			class: "required",
			// 																			innerHTML: "劳动关系"
			// 																		}],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.workRelationships"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.workRelationships&&formData.employeeData.workRelationships.length}",
			// 																	"props": {"forList": "{formData.employeeData.workRelationships}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						// {
			// 																						// 	"nodeType": "el-form-item",
			// 																						// 	"children": [
			// 																						// 		{
			// 																						// 			"nodeType": "y-select",
			// 																						// 			defaultValueMap: [
			// 																						// 				{
			// 																						// 					value: "HR",
			// 																						// 					valueType: "String",
			// 																						// 					key: "itemModel.assignmentType"
			// 																						// 				}],
			// 																						// 			"props": {
			// 																						// 				"defaultValue": "",
			// 																						// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						// 				"optionsPath": "WORK_RELATIONSHIPS.assignmentType",
			// 																						// 				"v-model": "{itemModel.assignmentType}"
			// 																						// 			}
			// 																						// 		}],
			// 																						// 	"props": {
			// 																						// 		"label": "分配类型",
			// 																						// 		"required": true
			// 																						// 	}
			// 																						// },
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.reason"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "WORK_RELATIONSHIPS.reason",
			// 																										"v-model": "{itemModel.reason}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "原因",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.workRelationshipId"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.workRelationshipId}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "劳动关系ID",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.workRelationshipType"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "WORK_RELATIONSHIPS.workRelationshipType",
			// 																										"v-model": "{itemModel.workRelationshipType}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "劳动关系类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-date-picker",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.hireDate"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.hireDate}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "入职日期",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										//劳动合同
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "劳动合同"
			// 																		}],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.contracts"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.contracts&&formData.employeeData.contracts.length}",
			// 																	"props": {"forList": "{formData.employeeData.contracts}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.type"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "CONTRACTS.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-date-picker",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.startDate"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.startDate}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "开始日期",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-date-picker",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.endDate"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"v-model": "{itemModel.endDate}"
			// 																									}
			// 																								}],
			// 																							"props": {"label": "结束日期"}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										}
			// 									]
			// 								},
			// 								{
			// 									nodeType: "el-card",
			// 									slot: "steps",
			// 									style: {margin: "20px 0"},
			// 									children: [
			// 										{
			// 											nodeType: "el-steps",
			// 											props: {
			// 												direction: "vertical",
			// 												space: "100px",
			// 												active: "{activeConfig.activeIndex}",
			// 												"finish-status": "success"
			// 											},
			// 											children: [
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "个人信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "联系信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "雇佣信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "工作信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "薪酬信息"}
			// 												}
			// 											]
			// 										}]
			// 								}
			// 							]
			// 						}
			// 					]
			// 				},
			// 				{
			// 					nodeType: "el-carousel-item",
			// 					props: {name: "carouselItem3"},
			// 					children: [
			// 						{
			// 							nodeType: "ySteps",
			// 							props: {stepPosition: "right"},
			// 							children: [
			// 								{
			// 									nodeType: "el-container",
			// 									props: {"direction": "vertical"},
			// 									children: [
			// 										//职位
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "职位"
			// 																		}
			// 																	],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.positions"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.positions&&formData.employeeData.positions.length}",
			// 																	"props": {"forList": "{formData.employeeData.positions}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						// {
			// 																						// 	"nodeType": "el-form-item",
			// 																						// 	"children": [
			// 																						// 		{
			// 																						// 			"nodeType": "y-select",
			// 																						// 			defaultValueMap: [
			// 																						// 				{
			// 																						// 					value: "",
			// 																						// 					valueType: "String",
			// 																						// 					key: "itemModel.assignmentType"
			// 																						// 				}],
			// 																						// 			"props": {
			// 																						// 				"defaultValue": "",
			// 																						// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						// 				"optionsPath": "POSITIONS.assignmentType",
			// 																						// 				"v-model": "{itemModel.assignmentType}"
			// 																						// 			}
			// 																						// 		}],
			// 																						// 	"props": {
			// 																						// 		"label": "分配类型",
			// 																						// 		"required": true
			// 																						// 	}
			// 																						// },
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.position"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "POSITION",
			// 																										"v-model": "{itemModel.position[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "职位",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										// 职务
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			class: "required",
			// 																			innerHTML: "职务"
			// 																		}
			// 																	],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.jobs"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.jobs&&formData.employeeData.jobs.length}",
			// 																	"props": {"forList": "{formData.employeeData.jobs}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						// {
			// 																						// 	"nodeType": "el-form-item",
			// 																						// 	"children": [
			// 																						// 		{
			// 																						// 			"nodeType": "y-select",
			// 																						// 			defaultValueMap: [
			// 																						// 				{
			// 																						// 					value: "",
			// 																						// 					valueType: "String",
			// 																						// 					key: "itemModel.assignmentType"
			// 																						// 				}],
			// 																						// 			"props": {
			// 																						// 				"defaultValue": "",
			// 																						// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						// 				"optionsPath": "JOBS.assignmentType",
			// 																						// 				"v-model": "{itemModel.assignmentType}"
			// 																						// 			}
			// 																						// 		}],
			// 																						// 	"props": {
			// 																						// 		"label": "分配类型",
			// 																						// 		"required": true
			// 																						// 	}
			// 																						// },
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.job"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "JOB",
			// 																										"v-model": "{itemModel.job[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "职务",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										// 职级
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "职级"
			// 																		}],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.managementLevels"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.managementLevels&&formData.employeeData.managementLevels.length}",
			// 																	"props": {"forList": "{formData.employeeData.managementLevels}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						// {
			// 																						// 	"nodeType": "el-form-item",
			// 																						// 	"children": [
			// 																						// 		{
			// 																						// 			"nodeType": "y-select",
			// 																						// 			defaultValueMap: [
			// 																						// 				{
			// 																						// 					value: "",
			// 																						// 					valueType: "String",
			// 																						// 					key: "itemModel.assignmentType"
			// 																						// 				}],
			// 																						// 			"props": {
			// 																						// 				"defaultValue": "",
			// 																						// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						// 				"optionsPath": "MANAGEMENT_LEVELS.assignmentType",
			// 																						// 				"v-model": "{itemModel.assignmentType}"
			// 																						// 			}
			// 																						// 		}],
			// 																						// 	"props": {
			// 																						// 		"label": "分配类型",
			// 																						// 		"required": true
			// 																						// 	}
			// 																						// },
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.managementLevel"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "MANAGEMENT_LEVEL",
			// 																										"v-model": "{itemModel.managementLevel[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "职级",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										// 组织信息
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			class: "required",
			// 																			innerHTML: "组织信息"
			// 																		}],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.organizations"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.organizations&&formData.employeeData.organizations.length}",
			// 																	"props": {"forList": "{formData.employeeData.organizations}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.type"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "ORGANIZATIONS.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "组织类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						// {
			// 																						// 	"nodeType": "el-form-item",
			// 																						// 	"children": [
			// 																						// 		{
			// 																						// 			"nodeType": "y-select",
			// 																						// 			defaultValueMap: [
			// 																						// 				{
			// 																						// 					value: "",
			// 																						// 					valueType: "String",
			// 																						// 					key: "itemModel.assignmentType"
			// 																						// 				}],
			// 																						// 			"props": {
			// 																						// 				"defaultValue": "",
			// 																						// 				"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						// 				"optionsPath": "ORGANIZATIONS.assignmentType",
			// 																						// 				"v-model": "{itemModel.assignmentType}"
			// 																						// 			}
			// 																						// 		}],
			// 																						// 	"props": {
			// 																						// 		"label": "分配类型",
			// 																						// 		"required": true
			// 																						// 	}
			// 																						// },
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							defaultValueMap: [
			// 																								{
			// 																									value: "[\"\"]",
			// 																									valueType: "Array",
			// 																									key: "itemModel.organization"
			// 																								}],
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"optionsPath": "ORGANIZATION",
			// 																										"filter": {
			// 																											"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
			// 																											"data": {"type": "{itemModel.type}"}
			// 																										},
			// 																										"v-model": "{itemModel.organization[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "组织",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										// 汇报关系
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "汇报关系"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.employeeData.managers"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.employeeData.managers.push({})"
			// 																					}
			// 																				}]
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.managers&&formData.employeeData.managers.length}",
			// 																	"props": {"forList": "{formData.employeeData.managers}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "el-row",
			// 																					"props": {"type": "flex"},
			// 																					"style": {
			// 																						"height": "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "i",
			// 																							"class": "el-icon-delete",
			// 																							"on": [
			// 																								{
			// 																									"name": "click",
			// 																									"handler": {"body": "formData.employeeData.managers.splice(index,1)"}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "",
			// 																											valueType: "String",
			// 																											key: "itemModel.type"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "MANAGERS.type",
			// 																										"v-model": "{itemModel.type}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "类型",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.manager"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"optionsPath": "EMPLOYEE",
			// 																										"labelKey": "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
			// 																										"remoteFilterKey": "personal.names.nameCHN.displayName",
			// 																										"filter": {
			// 																											"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
			// 																											"data": {"personal.names.type": "PREFERRED"}
			// 																										},
			// 																										"v-model": "{itemModel.manager[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "主管",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										}
			// 									]
			// 								},
			// 								{
			// 									nodeType: "el-card",
			// 									slot: "steps",
			// 									style: {margin: "20px 0"},
			// 									children: [
			// 										{
			// 											nodeType: "el-steps",
			// 											props: {
			// 												direction: "vertical",
			// 												space: "100px",
			// 												active: "{activeConfig.activeIndex}",
			// 												"finish-status": "success"
			// 											},
			// 											children: [
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "个人信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "联系信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "雇佣信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "工作信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "薪酬信息"}
			// 												}
			// 											]
			// 										}]
			// 								}
			// 							]
			// 						}
			// 					]
			// 				},
			// 				{
			// 					nodeType: "el-carousel-item",
			// 					props: {name: "carouselItem4"},
			// 					children: [
			// 						{
			// 							nodeType: "ySteps",
			// 							props: {stepPosition: "right"},
			// 							children: [
			// 								{
			// 									nodeType: "el-container",
			// 									props: {"direction": "vertical"},
			// 									children: [
			//
			// 										// 薪酬信息
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {
			// 																header: "薪酬信息",
			// 																"body-style": {"padding": "0"}
			// 															},
			// 															children: [
			// 																{
			// 																	"nodeType": "y-pre-form",
			// 																	"style": {"padding": "30px  20px"},
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[{}]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.compensation"
			// 																		}],
			// 																	"props": {
			// 																		"model": "{formData.employeeData.compensation[0]}",
			// 																		"labelPosition": "top",
			// 																		"span": 2,
			// 																		"inline": true
			// 																	},
			// 																	"children": [
			// 																		{
			// 																			"nodeType": "el-form-item",
			// 																			"children": [
			// 																				{
			// 																					"nodeType": "y-select",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "[\"\"]",
			// 																							valueType: "Array",
			// 																							key: "formData.employeeData.compensation[0].grade"
			// 																						}],
			// 																					"props": {
			// 																						"defaultValue": "",
			// 																						"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						"optionsPath": "COMPENSATION.grade",
			// 																						"v-model": "{formData.employeeData.compensation[0].grade[0]}"
			// 																					}
			// 																				}],
			// 																			"props": {"label": "薪等"}
			// 																		},
			// 																		{
			// 																			"nodeType": "el-form-item",
			// 																			"children": [
			// 																				{
			// 																					"nodeType": "y-select",
			// 																					defaultValueMap: [
			// 																						{
			// 																							value: "[\"\"]",
			// 																							valueType: "Array",
			// 																							key: "formData.employeeData.compensation[0].step"
			// 																						}],
			// 																					"props": {
			// 																						"defaultValue": "",
			// 																						"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																						"optionsPath": "COMPENSATION.step",
			// 																						"v-model": "{formData.employeeData.compensation[0].step[0]}"
			// 																					}
			// 																				}],
			// 																			"props": {"label": "薪级"}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										},
			// 										// 薪酬项
			// 										{
			// 											nodeType: "el-row",
			// 											style: {margin: "20px 20px 0 20px"},
			// 											children: [
			// 												{
			// 													nodeType: "el-col",
			// 													children: [
			// 														{
			// 															nodeType: "el-card",
			// 															props: {"body-style": {padding: "0"}},
			// 															children: [
			// 																{
			// 																	nodeType: "el-row",
			// 																	slot: "header",
			// 																	props: {type: "flex"},
			// 																	style: {"align-items": "center"},
			// 																	children: [
			// 																		{
			// 																			nodeType: "div",
			// 																			style: {flex: "auto"},
			// 																			innerHTML: "薪酬项"
			// 																		},
			// 																		{
			// 																			nodeType: "i",
			// 																			defaultValueMap: [
			// 																				{
			// 																					value: "[]",
			// 																					valueType: "Array",
			// 																					key: "formData.personData.payComponents"
			// 																				}],
			// 																			class: "el-icon-plus",
			// 																			on: [
			// 																				{
			// 																					name: "click",
			// 																					handler: {
			// 																						body: "formData.employeeData.payComponents.push({})"
			// 																					}
			// 																				}]
			// 																		}],
			// 																	defaultValueMap: [
			// 																		{
			// 																			value: "[]",
			// 																			valueType: "Array",
			// 																			key: "formData.employeeData.payComponents"
			// 																		}]
			// 																},
			// 																{
			// 																	"nodeType": "y-list",
			// 																	"style": {"padding": "10px 20px 30px 20px"},
			// 																	"v-if": "{formData.employeeData.payComponents&&formData.employeeData.payComponents.length}",
			// 																	"props": {"forList": "{formData.employeeData.payComponents}"},
			// 																	"scopedSlots": [
			// 																		{
			// 																			"name": "default",
			// 																			"nodes": [
			// 																				{
			// 																					"nodeType": "el-row",
			// 																					"props": {"type": "flex"},
			// 																					"style": {
			// 																						"height": "30px",
			// 																						"justify-content": "flex-end",
			// 																						"align-items": "flex-end"
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "i",
			// 																							"class": "el-icon-delete",
			// 																							"on": [
			// 																								{
			// 																									"name": "click",
			// 																									"handler": {"body": "formData.employeeData.payComponents.splice(index,1)"}
			// 																								}]
			// 																						}]
			// 																				},
			// 																				{
			// 																					"nodeType": "y-pre-form",
			// 																					"props": {
			// 																						"model": "{itemModel}",
			// 																						"labelPosition": "top",
			// 																						"span": 2,
			// 																						"inline": true
			// 																					},
			// 																					"children": [
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.payComponent"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "PAY_COMPONENTS.payComponent",
			// 																										"v-model": "{itemModel.payComponent[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "薪酬项",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-select",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "[\"\"]",
			// 																											valueType: "Array",
			// 																											key: "itemModel.currency"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": "",
			// 																										"filter": {"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
			// 																										"optionsPath": "CURRENCY",
			// 																										"v-model": "{itemModel.currency[0]}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "货币",
			// 																								"required": true
			// 																							}
			// 																						},
			// 																						{
			// 																							"nodeType": "el-form-item",
			// 																							"children": [
			// 																								{
			// 																									"nodeType": "y-input-number",
			// 																									defaultValueMap: [
			// 																										{
			// 																											value: "0",
			// 																											valueType: "Number",
			// 																											key: "itemModel.payRate"
			// 																										}],
			// 																									"props": {
			// 																										"defaultValue": 0,
			// 																										controls: false,
			// 																										"precision": 2,
			// 																										"v-model": "{itemModel.payRate}"
			// 																									}
			// 																								}],
			// 																							"props": {
			// 																								"label": "值",
			// 																								"required": true
			// 																							}
			// 																						}]
			// 																				}],
			// 																			"scopeMapping": {
			// 																				"itemModel": "item",
			// 																				index: "index"
			// 																			}
			// 																		}]
			// 																}]
			// 														}]
			// 												}]
			// 										}
			// 									]
			// 								},
			// 								{
			// 									nodeType: "el-card",
			// 									slot: "steps",
			// 									style: {margin: "20px 0"},
			// 									children: [
			// 										{
			// 											nodeType: "el-steps",
			// 											props: {
			// 												direction: "vertical",
			// 												space: "100px",
			// 												active: "{activeConfig.activeIndex}",
			// 												"finish-status": "success"
			// 											},
			// 											children: [
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "个人信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "联系信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "雇佣信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "工作信息"}
			// 												},
			// 												{
			// 													nodeType: "el-step",
			// 													props: {title: "薪酬信息"}
			// 												}
			// 											]
			// 										}]
			// 								}]
			// 						}]
			// 				}]
			// 		}]
			// }
		]
	}
})
