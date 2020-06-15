export default () => ({
	path: "/corehr/personalInfo/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		style: {padding: "20px"},
		scope: {
			data: {
				// empId: "EMP-SS-003-HR",
				locale: {CHN: {}},
				detailData: {},
				detailDataInstanceId: "",
				errorInstanceId: "",
				familyPersonInstanceId: "",
				familyDependentPersons: []
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
								self.apiRequest({url: "/biz/LOCALE/search",type: "POST",headers: {},data: {"code": "CHN"}}).then(function(response){
									self.locale.CHN=response.data.instances[0];
									self.apiRequest({url: "/biz/EMPLOYEE/search",type: "POST",headers: {},params: {depth: 3},data: {"externalId": self.empId}}).then(function(response){
										self.detailDataInstanceId=response.data.instances[0].instanceId;
										if(self.detailDataInstanceId){
											self.getData();
										}else{
											self.$router.replace("/404")
										}
									});
								});`
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
             					"data":[{"payload":{"query":{"instanceId":self.detailDataInstanceId},asOfDate:self.today.mFormat("yyyyMMdd")}}]
             				}]
             			}
             		}
              }).then(function(response){
                self.detailData=response.data[0].transaction.steps[0].results[0].instances[0];
              });`
					}
				},
				{
					methodName: "toFamilyPersonDetail",
					handler: {
						args: "familyPersonInstanceId",
						body: `
								self.familyPersonInstanceId = familyPersonInstanceId
								self.$router.push({name:"CorehrPersonalInfoViewFamilyPerson",query:{instanceId:self.familyPersonInstanceId}});`
					}
				},
				{
					methodName: "toEdit",
					handler: {
						body: `self.$router.replace({name: "CorehrPersonalInfoEdit"});`
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
						children: [
							{
								nodeType: "span",
								innerHTML: "我的档案"
							}]
					}
				]
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
						nodeType: "el-card",
						style: {"margin": "20px 0"},
						props: {"body-style": {"padding": "40px 50px 0 50px"}},
						children: [
							{
								nodeType: "el-container",
								class: "personalInfo-bg",
								children: [
									{
										nodeType: "el-container",
										style: {
											flex: "auto",
											"margin-bottom": "20px"
										},
										props: {direction: "vertical"},
										children: [
											{
												nodeType: "y-input",
												style: {
													"font-size": "20px",
													"font-weight": "bolder",
													"margin-bottom": "32px"
												},
												props: {
													"v-model": "{$.detailData.personal[0].names[?(@.locale[0]=={locale.CHN.instanceId}&&@.type==\"PREFERRED\")].nameCHN[0].displayName}",
													displayOnly: true
												}
											},
											{
												nodeType: "span",
												style: {
													"line-height": "14px",
													"font-size": "14px",
													"margin-bottom": "20px"
												},
												children: [
													{
														nodeType: "span",
														style: {
															color: "#999999",
															"margin-right": "14px"
														},
														innerHTML: "员工号"
													},
													{
														nodeType: "y-input",
														props: {
															"v-model": "{detailData.employment[0].employeeId}",
															displayOnly: true
														}
													}]
											}]
									},
									{
										nodeType: "el-container",
										style: {
											flex: "none",
											width: "50%",
											display: "flex",
											"justify-content": "flex-end",
											"align-items": "flex-start"
										},
										children: [
											// {
											// 	nodeType: "el-button",
											// 	props: {
											// 		type: "primary",
											// 		size: "mini"
											// 	},
											// 	innerHTML: "修正员工个人信息",
											// 	on: [
											// 		{
											// 			name: "click",
											// 			handler: {name: "toEdit"}
											// 		}]
											// }
											// {
											// 	nodeType: "el-button",
											// 	props: {
											// 		type: "primary",
											// 		size: "mini"
											// 	},
											// 	innerHTML: "修正员工个人信息",
											// 	on: [
											// 		{
											// 			name: "click",
											// 			handler: {name: "toEdit"}
											// 		}]
											// }
										]
									}]
							}]
					},
					{
						nodeType: "el-card",
						props: {"body-style": {"padding": "40px 50px"}},
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
												nodeType: "y-portal-item-header",
												props: {
													title: "个人档案",
													iconClass: "personal-info"
												}
											},
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {
													model: "{detailData.personal[0].biographical[0]}",
													span: 3,
													inline: true,
													"label-position": "top"
												},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "出生日期"},
														children: [
															{
																nodeType: "y-date-picker",
																props: {
																	"displayOnly": true,
																	"v-model": "{detailData.personal[0].biographical[0].dateOfBirth}"
																}
															}]
													}]
											},
											
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "本地信息(中国)",
													iconClass: "local-info"
												}
											},
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {
													model: "{detailData.personal[0].personRegional[0].personRegionalCHN[0]}",
													span: 3,
													inline: true,
													"label-position": "top"
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
																	prop: "gender",
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
													}]
											},
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "姓名",
													iconClass: "name"
												}
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
														props: {
															label: "显示姓名",
															prop: "nameCHN[0].displayName"
														}
													}
												]
											},
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "个人身份标识号",
													iconClass: "id-card"
												}
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
														props: {label: "类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.identificationType}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "IDENTIFIER.identificationType"
																		}
																	}]
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
											},
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "家庭成员以及社会关系",
													iconClass: "family-dependent"
												}
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
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.relationship}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "FAMILY_DEPENDENT.relationship"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "家庭成员以及社会关系人"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {
																	row: "row",
																	index: "$index"
																},
																nodes: [
																	{
																		nodeType: "y-input",
																		props: {
																			"v-model": "{$.familyDependentPersons[{index}].names[?(@.locale[0]=={locale.CHN.instanceId}&&@.type==\"PREFERRED\")].nameCHN[0].displayName}",
																			displayOnly: true
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "操作",
															align: "center",
															width: "220px"
														},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {
																	row: "row",
																	index: "$index"
																},
																nodes: [
																	{
																		nodeType: "el-button",
																		innerHTML: "查看",
																		props: {type: "text"},
																		
																		style: {color: "#189CFF"},
																		on: [
																			{
																				name: "click",
																				handler: {
																					name: "toFamilyPersonDetail",
																					args: "{detailData.personal[0].familyDependents[index].familyDependentPerson[0]}"
																				}
																			}]
																	}
																]
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
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "地址",
													iconClass: "location"
												}
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
																nodes: {
																	nodeType: "y-select",
																	props: {
																		"v-model": "{row.type}",
																		displayOnly: true,
																		filter: {params: {asOfDate: "{asOfDate}"}},
																		optionsPath: "ADDRESS.type"
																	}
																}
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "国家地区"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: {
																	nodeType: "y-select",
																	props: {
																		"v-model": "{row.locale[0]}",
																		displayOnly: true,
																		filter: {params: {asOfDate: "{asOfDate}"}},
																		optionsPath: "LOCALE"
																	}
																}
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
																				nodeType: "y-select",
																				style: {"margin-right": "5px"},
																				props: {
																					"v-model": "{model.locale[0]}",
																					displayOnly: true,
																					filter: {params: {asOfDate: "{asOfDate}"}},
																					optionsPath: "LOCALE"
																				}
																			},
																			{
																				nodeType: "y-select",
																				style: {"margin-right": "5px"},
																				props: {
																					"v-model": "{model.addressCHN[0].region[0]}",
																					displayOnly: true,
																					filter: {
																						data: {
																							type: "CHN_PROVINCE"
																						}
																					},
																					optionsPath: "REGION"
																				}
																			},
																			{
																				nodeType: "y-select",
																				style: {"margin-right": "5px"},
																				props: {
																					"v-model": "{model.addressCHN[0].city[0]}",
																					displayOnly: true,
																					filter: {
																						data: {
																							type: "CHN_CITY"
																						}
																					},
																					optionsPath: "REGION"
																				}
																			},
																			{
																				nodeType: "y-select",
																				style: {"margin-right": "5px"},
																				props: {
																					"v-model": "{model.addressCHN[0].district[0]}",
																					displayOnly: true,
																					filter: {
																						data: {type: "CHN_AREA"}
																					},
																					optionsPath: "REGION"
																				}
																			},
																			{
																				nodeType: "y-select",
																				style: {"margin-right": "5px"},
																				props: {
																					"v-model": "{model.addressCHN[0].subDistrict[0]}",
																					displayOnly: true,
																					filter: {
																						data: {
																							type: "CHN_TOWN"
																						}
																					},
																					optionsPath: "REGION"
																				}
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
												nodeType: "y-portal-item-header",
												props: {
													title: "电话",
													iconClass: "mobile"
												}
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
														props: {
															label: "显示电话",
															prop: "phoneNumber"
														}
													}
												]
											},
											// 邮箱
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "邮箱",
													iconClass: "mail"
												}
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
											// 其他联系方式
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "其他联系方式",
													iconClass: "other-contract"
												}
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
									{
										nodeType: "el-tab-pane",
										props: {label: "银行账号"},
										children: [
											{
												nodeType: "y-portal-item-header",
												props: {
													title: "银行账号",
													iconClass: "bank-card"
												}
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
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.bank[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "BANK"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "支行"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{row.bankBranch[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "BANK_BRANCH"
																		}
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
									}
								]
							}
						]
					}]
			}]
	}
})

