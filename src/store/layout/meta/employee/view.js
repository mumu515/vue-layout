export default () => ({
	path: "/corehr/EMPLOYEE/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			scopeId: 1,
			data: {
				EMPLOYEE_EXTENSIBLE_INFO: "EMPLOYEE_EXTENSIBLE_INFO",
				META_EMPLOYEE_EXTENSIBLE_INFO: {},
				locale: {},
				detailData: {},
				extList: []
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
          		self.apiRequest({url: "/biz/LOCALE/search",type: "POST",headers: {},data: {"code": "CHN"}})
								.then(function(response){
									self.locale.CHN=response.data.instances[0];
									self.getData();
							});
							self.META_EMPLOYEE_EXTENSIBLE_INFO=self.getMetaData("EMPLOYEE_EXTENSIBLE_INFO");`
					}
				},
				{
					methodName: "getData",
					handler: {
						body: `
             self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
             	data:{
             		"transaction":{
             			"code":"Web_Get_Employee",
             			"steps":[
             				{
             					"code":"Web_Get_Employee",
             					"data":[{"payload":{"query":{"instanceId":self.instanceId},"asOfDate":self.asOfDate}}]
             				}]
             			}
             		}
              }).then(function(response){
                self.detailData=response.data[0].transaction.steps[0].results[0].instances[0];
                self.extList=[];
                var extObject=self.detailData.employeeExtensibleInformation[0];
                for(var i=0;i<self.META_EMPLOYEE_EXTENSIBLE_INFO.length;i++){
									
									var t=self.META_EMPLOYEE_EXTENSIBLE_INFO[i];
									if(t.name.indexOf("c_")===0){
										self.extList.push({
                				name:t.name,
                				type:t.dataType,
                				value:extObject[t.name],
                		});
									}
              	}
              });`
						
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"CorehrMetaObjectLayout",params: {pageType: "list"}});`}
				},
				{
					methodName: "toModifyPay",
					handler: {
						body: `
								self.$router.push({
                  name:"CorehrMetaObjectLayout",
                  params: {pageType: "modifyPay"},
                  query: {instanceId: self.detailData.instanceId,asOfDate: self.asOfDate}
                });`
					}
				},
				{
					methodName: "toModifyWork",
					handler: {
						body: `
								self.$router.push({
                  name:"CorehrMetaObjectLayout",
                  params: {pageType: "modifyWork"},
                  query: {instanceId: self.detailData.instanceId,asOfDate: self.asOfDate}
                });`
					}
				},
				{
					methodName: "toTerminate",
					handler: {
						body: `
            self.$msgbox({
                message: "您确认要为该员工办理离职么",
                title: "办理离职确认",
                type: "warning",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }).then(function(){
                 self.$router.push({
                  name:"CorehrMetaObjectLayout",
                  params: {pageType: "terminate"},
                  query: {instanceId: self.detailData.instanceId,asOfDate: self.asOfDate}
                 });
              })`
						
					}
				}
			]
		},
		children: [
			{
				nodeType: "el-container",
				class: "header-part page-header",
				style: {"align-items": "center"},
				children: [
					{
						nodeType: "i",
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
						innerHTML: "查看员工",
						style: {flex: "auto"}
					},
					{
						nodeType: "span",
						innerHTML: "截止日期",
						style: {"margin-right": "20px"}
					},
					{
						nodeType: "y-date-picker",
						props: {
							displayOnly: true,
							"value-format": "yyyyMMdd",
							format: "yyyy-MM-dd",
							"v-model": "{asOfDate}"
						}
					}
				]
			},
			{
				nodeType: "el-container",
				props: {direction: "vertical"},
				children: [
					{
						nodeType: "el-card",
						style: {margin: "20px 20px 0 20px"},
						children: [
							{
								nodeType: "el-container",
								children: [
									{
										nodeType: "el-form",
										style: {flex: "auto"},
										props: {
											model: "{detailData}",
											"label-width": "140px",
											"label-position": "left"
										},
										children: [
											{
												nodeType: "el-form-item",
												style: {margin: 0},
												children: [
													{
														nodeType: "span",
														innerHTML: "显示姓名",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-link-scope",
														props: {
															tag: "el-row",
															links: "{detailData._links}",
															linkKey: "self.personal",
															data: "{detailData.personal}"
														},
														on: [
															{
																name: "instances-completed",
																handler: {body: "detailData.personal=args[0];"}
															}],
														children: [
															{
																"nodeType": "y-select",
																"props": {
																	"displayOnly": true,
																	"optionsPath": "PERSON",
																	"labelKey": "$.names[?(@.locale[0].instanceId==\"{locale.CHN.instanceId}\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																	"remoteFilterKey": "instanceId",
																	"filter": {
																		"params": {"asOfDate": "{detailData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}
																	},
																	"v-model": "{detailData.personal[0].instanceId}"
																}
															}]
													}
												]
											},
											{
												nodeType: "el-form-item",
												style: {margin: 0},
												children: [
													{
														nodeType: "span",
														innerHTML: "员工号",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-input",
														props: {
															displayOnly: true,
															"v-model": "{detailData.employment[0].employeeId}"
														}
													}
												]
											}]
									},
									{
										nodeType: "el-dropdown",
										"v-if": false,
										style: {
											flex: "none",
											"align-self": "center"
										},
										children: [
											{
												nodeType: "el-button",
												props: {type: "primary"},
												children: [
													{
														nodeType: "span",
														innerHTML: "操作"
													},
													{
														nodeType: "i",
														class: "el-icon-arrow-down el-icon--right"
													}
												]
											},
											{
												nodeType: "el-dropdown-menu",
												slot: "dropdown",
												children: [
													{
														nodeType: "el-dropdown-item",
														"v-if": "{detailData.employment[0].employmentStatus===\"ACTIVE\"}",
														children: [
															{
																nodeType: "el-button",
																props: {type: "text"},
																innerHTML: "办理离职",
																on: [
																	{
																		name: "click",
																		handler: {name: "toTerminate"}
																	}]
															}]
													},
													{
														nodeType: "el-dropdown-item",
														"v-if": "{detailData.employment[0].employmentStatus===\"ACTIVE\"}",
														children: [
															{
																nodeType: "el-button",
																props: {type: "text"},
																innerHTML: "调整薪酬",
																on: [
																	{
																		name: "click",
																		handler: {name: "toModifyPay"}
																	}]
															}]
													},
													{
														nodeType: "el-dropdown-item",
														"v-if": "{detailData.employment[0].employmentStatus===\"ACTIVE\"}",
														children: [
															{
																nodeType: "el-button",
																props: {type: "text"},
																innerHTML: "调整工作",
																on: [
																	{
																		name: "click",
																		handler: {name: "toModifyWork"}
																	}]
															}]
													}
												]
											}
										]
									}
								]
							}]
					},
					{
						nodeType: "el-card",
						style: {margin: "20px 20px 0 20px"},
						children: [
							{
								nodeType: "el-tabs",
								children: [
									// 个人信息
									{
										nodeType: "el-tab-pane",
										props: {label: "个人信息"},
										children: [
											{
												nodeType: "el-tabs",
												children: [
													{
														nodeType: "el-tab-pane",
														props: {label: "档案资料"},
														children: [
															{
																nodeType: "div",
																class: "detail-label-title",
																children: [
																	{
																		nodeType: "div",
																		class: "begin-tag main-color-bg"
																	},
																	{
																		nodeType: "div",
																		class: "content",
																		innerHTML: "档案资料"
																	},
																	{
																		nodeType: "div",
																		class: "end-tag"
																	}
																]
															},
															{
																nodeType: "y-pre-form",
																style: {margin: "0 40px"},
																props: {
																	model: "{detailData.personal[0].biographical[0]}",
																	span: 2,
																	inline: true
																},
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {label: "出生日期"},
																		children: [
																			{
																				nodeType: "y-input",
																				props: {
																					"v-model": "{detailData.personal[0].biographical[0].dateOfBirth}",
																					"displayOnly": true
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {label: "出生国家地区"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].biographical[0].birthLocale[0]}",
																					displayOnly: true,
																					filter: {params: {asOfDate: "{asOfDate}"}},
																					optionsPath: "LOCALE"
																				}
																			}]
																	}]
															}]
													},
													{
														nodeType: "el-tab-pane",
														props: {label: "本地信息(中国)"},
														children: [
															{
																nodeType: "div",
																class: "detail-label-title",
																children: [
																	{
																		nodeType: "div",
																		class: "begin-tag main-color-bg"
																	},
																	{
																		nodeType: "div",
																		class: "content",
																		innerHTML: "本地信息(中国)"
																	},
																	{
																		nodeType: "div",
																		class: "end-tag"
																	}
																]
															},
															{
																nodeType: "y-pre-form",
																style: {margin: "0 40px"},
																props: {
																	model: "{detailData.personal[0].personRegional[0].personRegionalCHN[0]}",
																	span: 2,
																	inline: true
																},
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {label: "国籍"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].personRegional[0].personRegionalCHN[0].nationalityRegion}",
																					displayOnly: true,
																					optionsPath: "PERSON_REGIONAL_CHN.nationalityRegion",
																					filter: {params: {asOfDate: "{asOfDate}"}}
																				}
																			}
																		
																		]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {label: "性别"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].personRegional[0].personRegionalCHN[0].gender}",
																					displayOnly: true,
																					optionsPath: "PERSON_REGIONAL_CHN.gender",
																					filter: {params: {asOfDate: "{asOfDate}"}}
																				}
																			}
																		
																		]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {label: "婚姻状态"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].personRegional[0].personRegionalCHN[0].maritalStatus}",
																					displayOnly: true,
																					optionsPath: "PERSON_REGIONAL_CHN.maritalStatus",
																					filter: {params: {asOfDate: "{asOfDate}"}}
																				}
																			}
																		
																		]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {label: "户口"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].personRegional[0].personRegionalCHN[0].huKou}",
																					displayOnly: true,
																					optionsPath: "PERSON_REGIONAL_CHN.huKou",
																					filter: {params: {asOfDate: "{asOfDate}"}}
																				}
																			}
																		
																		]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {label: "民族"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].personRegional[0].personRegionalCHN[0].ethnicity}",
																					displayOnly: true,
																					filter: {params: {asOfDate: "{asOfDate}"}},
																					optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
																				}
																			}
																		
																		]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {label: "政治面貌"},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					"v-model": "{detailData.personal[0].personRegional[0].personRegionalCHN[0].politicsStatus}",
																					displayOnly: true,
																					filter: {params: {asOfDate: "{asOfDate}"}},
																					optionsPath: "PERSON_REGIONAL_CHN.politicsStatus"
																				}
																			}
																		]
																	}
																
																]
															}]
													},
													{
														nodeType: "el-tab-pane",
														props: {label: "姓名"},
														children: [
															{
																nodeType: "div",
																class: "detail-label-title",
																children: [
																	{
																		nodeType: "div",
																		class: "begin-tag main-color-bg"
																	},
																	{
																		nodeType: "div",
																		class: "content",
																		innerHTML: "姓名"
																	},
																	{
																		nodeType: "div",
																		class: "end-tag"
																	}
																]
															},
															{
																nodeType: "el-table",
																style: {
																	margin: "0 40px",
																	width: "auto"
																},
																props: {data: "{detailData.personal[0].names}"},
																children: [
																	{
																		nodeType: "el-table-column",
																		props: {label: "类型"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {row: "row"},
																				nodes: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{row.type}",
																							displayOnly: true,
																							filter: {params: {asOfDate: "{asOfDate}"}},
																							optionsPath: "NAME.type"
																						}
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {label: "国家地区"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {
																					row: "row",
																					index: "$index"
																				},
																				nodes: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{row.locale[0]}",
																							displayOnly: true,
																							filter: {params: {asOfDate: "{asOfDate}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {
																			label: "显示姓名",
																			prop: "nameCHN[0].displayName"
																		}
																	}
																]
															}]
													},
													{
														nodeType: "el-tab-pane",
														props: {label: "个人身份标识号"},
														children: [
															{
																nodeType: "div",
																class: "detail-label-title",
																children: [
																	{
																		nodeType: "div",
																		class: "begin-tag main-color-bg"
																	},
																	{
																		nodeType: "div",
																		class: "content",
																		innerHTML: "个人身份标识号"
																	},
																	{
																		nodeType: "div",
																		class: "end-tag"
																	}
																]
															},
															{
																nodeType: "el-table",
																style: {
																	margin: "0 40px",
																	width: "auto"
																},
																props: {data: "{detailData.personal[0].identifiers}"},
																children: [
																	{
																		nodeType: "el-table-column",
																		props: {label: "国家地区"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {
																					row: "row",
																					index: "$index"
																				},
																				nodes: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{row.locale[0]}",
																							displayOnly: true,
																							filter: {params: {asOfDate: "{asOfDate}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {label: "类型"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {row: "row"},
																				nodes: {
																					nodeType: "y-select",
																					props: {
																						"v-model": "{row.identificationType}",
																						displayOnly: true,
																						filter: {params: {asOfDate: "{asOfDate}"}},
																						optionsPath: "IDENTIFIER.identificationType"
																					}
																				}
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {
																			label: "证件号",
																			prop: "identificationId"
																		}
																	},
																	{
																		nodeType: "el-table-column",
																		props: {
																			label: "发证日期",
																			prop: "issuedDate"
																		}
																	},
																	{
																		nodeType: "el-table-column",
																		props: {
																			label: "过期日期",
																			prop: "expirationDate"
																		}
																	}
																]
															}]
													},
													{
														nodeType: "el-tab-pane",
														props: {label: "银行账号"},
														children: [
															{
																nodeType: "div",
																class: "detail-label-title",
																children: [
																	{
																		nodeType: "div",
																		class: "begin-tag main-color-bg"
																	},
																	{
																		nodeType: "div",
																		class: "content",
																		innerHTML: "银行账号"
																	},
																	{
																		nodeType: "div",
																		class: "end-tag"
																	}
																]
															},
															{
																nodeType: "el-table",
																style: {
																	margin: "0 40px",
																	width: "auto"
																},
																props: {data: "{detailData.personal[0].bankAccounts}"},
																children: [
																	{
																		nodeType: "el-table-column",
																		props: {label: "国家地区"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {
																					row: "row",
																					index: "$index"
																				},
																				nodes: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{row.locale[0]}",
																							displayOnly: true,
																							filter: {params: {asOfDate: "{asOfDate}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {label: "类型"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {row: "row"},
																				nodes: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{row.type}",
																							displayOnly: true,
																							filter: {params: {asOfDate: "{asOfDate}"}},
																							optionsPath: "BANK_ACCOUNT.type"
																						}
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {label: "银行"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {
																					row: "row",
																					index: "$index"
																				},
																				nodes: [
																					{
																						nodeType: "y-link-scope",
																						props: {
																							tag: "el-row",
																							links: "{detailData.personal[0]._links}",
																							linkKey: "self.bankAccounts.bank",
																							data: "{row.bank}"
																						},
																						on: [
																							{
																								name: "instances-completed",
																								handler: {body: "row.bank=args[0];"}
																							}],
																						children: [
																							{
																								nodeType: "y-input",
																								props: {
																									"v-model": "{row.bank[0].name}",
																									displayOnly: true
																								}
																							}]
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {label: "支行"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {
																					row: "row",
																					index: "$index"
																				},
																				nodes: [
																					{
																						nodeType: "y-link-scope",
																						props: {
																							tag: "el-row",
																							links: "{detailData.personal[0]._links}",
																							linkKey: "self.bankAccounts.bankBranch",
																							data: "{row.bankBranch}"
																						},
																						on: [
																							{
																								name: "instances-completed",
																								handler: {body: "row.bankBranch=args[0];"}
																							}],
																						children: [
																							{
																								nodeType: "y-input",
																								props: {
																									"v-model": "{row.bankBranch[0].name}",
																									displayOnly: true
																								}
																							}]
																					}]
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {
																			label: "账户名",
																			prop: "accountName"
																		}
																	},
																	{
																		nodeType: "el-table-column",
																		props: {
																			label: "账户",
																			prop: "accountNumber"
																		}
																	}
																]
															}]
													},
													{
														nodeType: "el-tab-pane",
														props: {label: "家庭成员以及社会关系"},
														children: [
															{
																nodeType: "div",
																class: "detail-label-title",
																children: [
																	{
																		nodeType: "div",
																		class: "begin-tag main-color-bg"
																	},
																	{
																		nodeType: "div",
																		class: "content",
																		innerHTML: "家庭成员以及社会关系"
																	},
																	{
																		nodeType: "div",
																		class: "end-tag"
																	}
																]
															},
															{
																nodeType: "el-table",
																style: {
																	margin: "0 40px",
																	width: "auto"
																},
																props: {data: "{detailData.personal[0].familyDependents}"},
																children: [
																	{
																		nodeType: "el-table-column",
																		props: {label: "关系"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {row: "row"},
																				nodes: {
																					nodeType: "y-select",
																					props: {
																						"v-model": "{row.relationship}",
																						displayOnly: true,
																						filter: {params: {asOfDate: "{asOfDate}"}},
																						optionsPath: "FAMILY_DEPENDENT.relationship"
																					}
																				}
																			}]
																	},
																	{
																		nodeType: "el-table-column",
																		props: {label: "家庭成员以及社会关系人"},
																		scopedSlots: [
																			{
																				name: "default",
																				scopeMapping: {row: "row"},
																				nodes: [
																					{
																						"nodeType": "y-select",
																						"props": {
																							"displayOnly": true,
																							"optionsPath": "PERSON",
																							"labelKey": "$.names[?((@.locale[0]==\"{locale.CHN.instanceId}\"||@.locale[0].instanceId==\"{locale.CHN.instanceId}\")&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																							"remoteFilterKey": "instanceId",
																							"filter": {"params": {"asOfDate": "{detailData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							"v-model": "{row.familyDependentPerson[0]}"
																						}
																					}]
																			}]
																	}]
															}]
													}
												]
											}
										]
									},
									// 联系方式
									{
										nodeType: "el-tab-pane",
										props: {label: "联系方式"},
										children: [
											// 地址
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "地址"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {
													margin: "0 40px",
													width: "auto"
												},
												props: {data: "{detailData.personal[0].addresses}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.type}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "ADDRESS.type"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "国家地区"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {
																	row: "row",
																	index: "$index"
																},
																nodes: [
																	{
																		nodeType: "y-link-scope",
																		props: {
																			tag: "el-row",
																			links: "{detailData.personal[0]._links}",
																			linkKey: "self.addresses.locale",
																			data: "{row.locale}"
																		},
																		on: [
																			{
																				name: "instances-completed",
																				handler: {body: "row.locale=args[0];"}
																			}],
																		children: [
																			{
																				nodeType: "y-input",
																				props: {
																					"v-model": "{row.locale[0].name}",
																					displayOnly: true
																				}
																			}]
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "显示地址"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {"model": "row"},
																nodes: [
																	{
																		nodeType: "span",
																		children: [
																			{
																				nodeType: "span",
																				innerHTML: "{model.locale[0].name||\"\"}"
																			},
																			{
																				nodeType: "y-link-scope",
																				props: {
																					links: "{detailData.personal[0]._links}",
																					linkKey: "self.addresses.addressCHN.region",
																					data: "{model.addressCHN[0].region}"
																				},
																				on: [
																					{
																						name: "instances-completed",
																						handler: {body: "model.addressCHN[0].region=args[0];"}
																					}],
																				children: [
																					{
																						nodeType: "span",
																						innerHTML: "{\" \"+(model.addressCHN[0].region[0].name||\"\")}"
																					}]
																			},
																			{
																				nodeType: "y-link-scope",
																				props: {
																					links: "{detailData.personal[0]._links}",
																					linkKey: "self.addresses.addressCHN.city",
																					data: "{model.addressCHN[0].city}"
																				},
																				on: [
																					{
																						name: "instances-completed",
																						handler: {body: "model.addressCHN[0].city=args[0];"}
																					}],
																				children: [
																					{
																						nodeType: "span",
																						innerHTML: "{\" \"+(model.addressCHN[0].city[0].name||\"\")}"
																					}]
																			},
																			{
																				nodeType: "y-link-scope",
																				props: {
																					links: "{detailData.personal[0]._links}",
																					linkKey: "self.addresses.addressCHN.district",
																					data: "{model.addressCHN[0].district}"
																				},
																				on: [
																					{
																						name: "instances-completed",
																						handler: {body: "model.addressCHN[0].district=args[0];"}
																					}],
																				children: [
																					{
																						nodeType: "span",
																						innerHTML: "{\" \"+(model.addressCHN[0].district[0].name||\"\")}"
																					}]
																			},
																			{
																				nodeType: "y-link-scope",
																				props: {
																					links: "{detailData.personal[0]._links}",
																					linkKey: "self.addresses.addressCHN.subDistrict",
																					data: "{model.addressCHN[0].subDistrict}"
																				},
																				on: [
																					{
																						name: "instances-completed",
																						handler: {body: "model.addressCHN[0].subDistrict=args[0];"}
																					}],
																				children: [
																					{
																						nodeType: "span",
																						innerHTML: "{\" \"+(model.addressCHN[0].subDistrict[0].name||\"\")}"
																					}]
																			},
																			{
																				nodeType: "span",
																				innerHTML: "{\" \"+(model.addressCHN[0].address1||\"\")}"
																			}]
																	}]
															}]
													}
												]
											},
											// 电话
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "电话"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {
													margin: "0 40px",
													width: "auto"
												},
												props: {data: "{detailData.personal[0].phones}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.type}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "PHONE.type"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "国家地区"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {
																	row: "row",
																	index: "$index"
																},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.locale[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "显示电话",
															prop: "phoneNumber"
														}
													}
												]
											},
											// 邮箱
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "邮箱"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {
													margin: "0 40px",
													width: "auto"
												},
												props: {data: "{detailData.personal[0].emails}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.type}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "EMAIL.type"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "邮箱",
															prop: "email"
														}
													}
												]
											},
											// 紧急联系人
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "紧急联系人"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {
													margin: "0 40px",
													width: "auto"
												},
												props: {data: "{detailData.personal[0].emergencyContacts}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "关系"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.relationship}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "PERSON.emergencyContacts.relationship"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "紧急联系人"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		"nodeType": "y-select",
																		"props": {
																			"displayOnly": true,
																			"optionsPath": "PERSON",
																			"labelKey": "$.names[?((@.locale[0]==\"{locale.CHN.instanceId}\"||@.locale[0].instanceId==\"{locale.CHN.instanceId}\")&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																			"remoteFilterKey": "instanceId",
																			"filter": {"params": {"asOfDate": "{detailData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			"v-model": "{row.emergencyContactPerson[0]}"
																		}
																	}]
															}]
													}]
											},
											// 其他联系方式
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "其他联系方式"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {
													margin: "0 40px",
													width: "auto"
												},
												props: {data: "{detailData.personal[0].otherContacts}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.otherContactType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "OTHER_CONTACT.otherContactType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "其他联系方式ID",
															prop: "otherContactId"
														}
													}]
											}
										
										]
									},
									// 雇佣关系
									{
										nodeType: "el-tab-pane",
										props: {label: "雇佣关系"},
										children: [
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "雇佣信息"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {
													span: 2,
													model: "{detailData.employment[0]}",
													inline: true
												},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "雇佣工号"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.employment[0].employeeId}",
																	"displayOnly": true
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														props: {label: "雇佣类型"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.employment[0].employmentType}",
																	"displayOnly": true,
																	filter: {params: {asOfDate: "{asOfDate}"}},
																	optionsPath: "EMPLOYMENT.employmentType"
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														props: {label: "雇佣生效状态"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.employment[0].employmentStatus}",
																	"displayOnly": true,
																	filter: {params: {asOfDate: "{asOfDate}"}},
																	optionsPath: "EMPLOYMENT.employmentStatus"
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														props: {label: "最初入职日期"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.employment[0].originalHireDate}",
																	"displayOnly": true
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														props: {label: "最终离职日期"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.employment[0].finalTerminationDate}",
																	"displayOnly": true
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														props: {label: "最终最后工作日"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.employment[0].finalLastWorkDate}",
																	"displayOnly": true
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														props: {label: "司龄起算日"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.employment[0].enterpriseSeniorityDate}",
																	"displayOnly": true
																}
															}
														]
													}
												]
											},
											// 劳动关系
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "劳动关系"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.workRelationships}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "分配类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.assignmentType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "WORK_RELATIONSHIPS.assignmentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "劳动关系ID",
															prop: "workRelationshipId"
														}
													},
													{
														nodeType: "el-table-column",
														props: {label: "劳动关系类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.workRelationshipType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "WORK_RELATIONSHIPS.workRelationshipType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "劳动关系状态"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.workRelationshipStatus}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "WORK_RELATIONSHIPS.workRelationshipStatus"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "入职日期"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{row.hireDate}",
																			displayOnly: true
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "离职日期"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{row.terminationDate}",
																			displayOnly: true
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "最后工作日"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{row.lastWorkDate}",
																			displayOnly: true
																		}
																	}]
															}]
													}
												]
												
											},
											// 劳动关系
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "劳动合同"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.contracts}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.type}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "CONTRACTS.type"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "开始日期"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{row.startDate}",
																			displayOnly: true
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "结束日期"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-date-picker",
																		props: {
																			"v-model": "{row.endDate}",
																			displayOnly: true
																		}
																	}]
															}]
													}
												]
											}
										]
									},
									// 工作信息
									{
										nodeType: "el-tab-pane",
										props: {label: "工作信息"},
										children: [
											// 职位
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "职位"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.positions}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "分配类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.assignmentType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "POSITIONS.assignmentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "职位"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.position[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "POSITION"
																		}
																	}]
															}]
													}
												]
											},
											// 职务
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "职务"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.jobs}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "分配类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.assignmentType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "JOBS.assignmentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "职务"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.job[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "JOB"
																		}
																	}]
															}]
													}
												]
												
											},
											// 职级
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "职级"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.managementLevels}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "分配类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.assignmentType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "MANAGEMENT_LEVELS.assignmentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "职级"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.managementLevel[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "MANAGEMENT_LEVEL"
																		}
																	}]
															}]
													}
												]
											}
										]
									},
									// 组织信息
									{
										nodeType: "el-tab-pane",
										props: {label: "组织信息"},
										children: [
											// 组织信息
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "组织信息"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.organizations}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "组织类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.type}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "ORGANIZATIONS.type"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "分配类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.assignmentType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "ORGANIZATIONS.assignmentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "组织"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.organization[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "ORGANIZATION"
																		}
																	}]
															}]
													}
												]
											}
										]
									},
									// 自定义信息
									{
										nodeType: "el-tab-pane",
										props: {label: "自定义信息"},
										children: [
											// 自定义信息
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "员工拓展信息"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "y-list",
												props: {
													forList: "{extList}",
													tag: {
														name: "y-pre-form",
														style: {margin: "0 40px"},
														props: {
															span: 2,
															inline: true
														}
													},
													itemTag: {
														name: "el-form-item",
														class: " "
													}
												},
												scopedSlots: [
													{
														name: "default",
														scopeMapping: {
															itemModel: "item",
															index: "index"
														},
														nodes: [
															{
																nodeType: "label",
																"v-if": "{itemModel.type=='Text'}",
																innerHTML: "{'自定义文本字段'+(index+1)}",
																slot: "label",
																class: "el-form-item__label",
																style: {width: "180px"}
															},
															{
																nodeType: "label",
																"v-if": "{itemModel.type=='Number'}",
																innerHTML: "{'自定义数字字段'+(index+1)}",
																slot: "label",
																class: "el-form-item__label",
																style: {width: "180px"}
															},
															{
																nodeType: "label",
																"v-if": "{itemModel.type=='List'}",
																innerHTML: "{'自定义下拉框字段'+(index+1)}",
																slot: "label",
																class: "el-form-item__label",
																style: {width: "180px"}
															},
															
															{
																"v-if": "{itemModel.type=='Text'}",
																nodeType: "y-input",
																props: {
																	"v-model": "{itemModel.value}",
																	"displayOnly": true
																}
															},
															{
																"v-if": "{itemModel.type=='Number'}",
																nodeType: "y-input-number",
																props: {
																	"v-model": "{itemModel.value}",
																	"displayOnly": true
																}
															},
															{
																"v-if": "{itemModel.type=='List'}",
																nodeType: "y-select",
																props: {
																	"v-model": "{itemModel.value}",
																	"displayOnly": true,
																	filter: {params: {asOfDate: "{asOfDate}"}},
																	optionsPath: "{\"EMPLOYEE_EXTENSIBLE_INFO.\"+itemModel.name}"
																}
															}]
													}]
											}
										]
									},
									// 汇报关系
									{
										nodeType: "el-tab-pane",
										props: {label: "汇报关系"},
										children: [
											// 汇报关系
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "汇报关系"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.managers}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.type}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "MANAGERS.type"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "主管"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-link-scope",
																		props: {
																			tag: "el-row",
																			links: "{detailData._links}",
																			linkKey: "self.managers.manager",
																			data: "{row.manager}"
																		},
																		on: [
																			{
																				name: "instances-completed",
																				handler: {body: "row.manager=args[0];"}
																			}],
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"displayOnly": true,
																					"optionsPath": "PERSON",
																					"labelKey": "$.names[?((@.locale[0]==\"{locale.CHN.instanceId}\"||@.locale[0].instanceId==\"{locale.CHN.instanceId}\")&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																					"remoteFilterKey": "instanceId",
																					"filter": {"params": {"asOfDate": "{detailData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																					"v-model": "{row.manager[0].personal[0]}"
																				}
																			}]
																	}]
															}]
													}
												]
											}
										]
									},
									// 薪酬信息
									{
										nodeType: "el-tab-pane",
										props: {label: "薪酬信息"},
										children: [
											//薪酬信息
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "薪酬信息"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {
													model: "{detailData.compensation[0]}",
													span: 2,
													inline: true
												},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "薪等"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.compensation[0].grade[0]}",
																	displayOnly: true,
																	filter: {params: {asOfDate: "{asOfDate}"}},
																	optionsPath: "COMPENSATION.grade"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "薪级"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.compensation[0].step[0]}",
																	displayOnly: true,
																	filter: {params: {asOfDate: "{asOfDate}"}},
																	optionsPath: "COMPENSATION.step"
																}
															}]
													}
												
												]
											},
											// 薪酬项
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "薪酬项"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.payComponents}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "薪酬项"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.payComponent[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "PAY_COMPONENT"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "货币"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.currency[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "CURRENCY"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "值"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{row.payRate}",
																			displayOnly: true
																		}
																	}]
															}]
													}]
											}]
									},
									// 薪资信息
									{
										nodeType: "el-tab-pane",
										props: {label: "薪资信息"},
										children: [
											// 支付信息
											{
												nodeType: "div",
												class: "detail-label-title",
												children: [
													{
														nodeType: "div",
														class: "begin-tag main-color-bg"
													},
													{
														nodeType: "div",
														class: "content",
														innerHTML: "支付信息"
													},
													{
														nodeType: "div",
														class: "end-tag"
													}
												]
											},
											{
												nodeType: "el-table",
												style: {margin: "0 40px"},
												props: {data: "{detailData.payments}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {label: "支付类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.paymentType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "PAYMENTS.paymentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "国家地区"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.locale[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "LOCALE"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "银行卡号"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-link-scope",
																		props: {
																			tag: "el-row",
																			links: "{detailData._links}",
																			linkKey: "self.payments.bankAccount",
																			data: "{row.bankAccount}"
																		},
																		on: [
																			{
																				name: "instances-completed",
																				handler: {body: "row.bankAccount=args[0];"}
																			}],
																		children: [
																			{
																				nodeType: "y-input",
																				props: {
																					"v-model": "{row.bankAccount[0].accountNumber}",
																					displayOnly: true
																				}
																			}]
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "货币"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.currency[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "PAYMENTS.currency"
																		}
																	}]
															}]
													}
												]
											}
										]
									}
								]
							}]
					}
				]
			}
		]
	}
})
