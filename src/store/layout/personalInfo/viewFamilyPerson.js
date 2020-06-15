export default () => ({
	path: "/corehr/personalInfo/index/viewFamilyPerson",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		style: {padding: "20px"},
		scope: {
			data: {
				locale: {CHN: {}},
				detailData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
								self.apiRequest({url: "/biz/LOCALE/search",type: "POST",headers: {},data: {"code": "CHN"}}).then(function(response){
									self.locale.CHN=response.data.instances[0];
									self.getData();
								});`
					}
				},
				{
					methodName: "getData",
					handler: {
						body: `
								self.apiRequest({
									url: "/biz/PERSON/"+self.instanceId,type: "GET",headers: {},
									params: {depth: 6}}).then(function(response){
									self.detailData=response.data;
								});`
					}
				},
				{
					methodName: "toView",
					handler: {
						body: `self.$router.replace({name: "CorehrPersonalInfoView"});`
					}
				},
				{
					methodName: "back",
					handler: {
						body: `self.$router.back();`
					}
				}]
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
					}, {
						nodeType: "el-breadcrumb-item",
						children: [
							{
								nodeType: "span",
								innerHTML: "查看家庭成员"
							}]
					}
				]
			},
			{
				nodeType: "el-card",
				style: {
					"margin": "20px 0",
					height: "100px"
				},
				
				props: {"body-style": {padding: "0 40px"}},
				children: [
					{
						nodeType: "el-container",
						class: "familyPersonInfo-bg",
						style: {
							height: "100px",
							display: "flex",
							"align-items": "center"
						},
						children: [
							{
								nodeType: "y-input",
								style: {
									"font-size": "20px",
									"font-weight": "bolder"
								},
								props: {
									"v-model": "{$.detailData.names[?(@.locale[0]=={locale.CHN.instanceId}&&@.type==\"PREFERRED\")].nameCHN[0].displayName}",
									displayOnly: true
								}
							}]
					}]
			},
			{
				nodeType: "el-card",
				props: {"body-style": {padding: "20px 40px"}},
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
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "档案资料"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "y-pre-form",
										style: {margin: "0 40px"},
										props: {
											model: "{detailData.biographical[0]}",
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
															"v-model": "{detailData.biographical[0].dateOfBirth}",
															"displayOnly": true
														}
													}]
											}]
									},
									{
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "本地信息(中国)"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "y-pre-form",
										style: {margin: "0 40px"},
										props: {
											model: "{detailData.personRegional[0].personRegionalCHN[0]}",
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
															"v-model": "{detailData.personRegional[0].personRegionalCHN[0].nationalityRegion}",
															displayOnly: true,
															optionsPath: "PERSON_REGIONAL_CHN.nationalityRegion",
															filter: {params: {asOfDate: "{asOfDate}"}}
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "性别"},
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{detailData.personRegional[0].personRegionalCHN[0].gender}",
															displayOnly: true,
															optionsPath: "PERSON_REGIONAL_CHN.gender",
															filter: {params: {asOfDate: "{asOfDate}"}}
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "婚姻状态"},
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{detailData.personRegional[0].personRegionalCHN[0].maritalStatus}",
															displayOnly: true,
															optionsPath: "PERSON_REGIONAL_CHN.maritalStatus",
															filter: {params: {asOfDate: "{asOfDate}"}}
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "户口"},
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{detailData.personRegional[0].personRegionalCHN[0].huKou}",
															displayOnly: true,
															optionsPath: "PERSON_REGIONAL_CHN.huKou",
															filter: {params: {asOfDate: "{asOfDate}"}}
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "民族"},
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{detailData.personRegional[0].personRegionalCHN[0].ethnicity}",
															displayOnly: true,
															filter: {params: {asOfDate: "{asOfDate}"}},
															optionsPath: "PERSON_REGIONAL_CHN.ethnicity"
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "政治面貌"},
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{detailData.personRegional[0].personRegionalCHN[0].politicsStatus}",
															displayOnly: true,
															filter: {params: {asOfDate: "{asOfDate}"}},
															optionsPath: "PERSON_REGIONAL_CHN.politicsStatus"
														}
													}]
											}
										]
									},
									{
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "姓名"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.names}"},
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
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "个人身份标识号"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.identifiers}"},
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
											}]
									}]
							},
							// 联系方式
							{
								nodeType: "el-tab-pane",
								props: {label: "联系方式"},
								children: [
									// 地址
									{
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "地址"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.addresses}"},
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
																		style:{"margin-right":"5px"},
																		props: {
																			"v-model": "{model.locale[0]}",
																			displayOnly: true,
																			filter: {params: {asOfDate: "{asOfDate}"}},
																			optionsPath: "LOCALE"
																		}
																	},
																	{
																		nodeType: "y-select",
																		style:{"margin-right":"5px"},
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
																		style:{"margin-right":"5px"},
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
																		style:{"margin-right":"5px"},
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
																		style:{"margin-right":"5px"},
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
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "电话"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.phones}"},
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
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "邮箱"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.emails}"},
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
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "其他联系方式"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.otherContacts}"},
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
										nodeType: "div",
										class: "display-flex align-center",
										style: {margin: "20px 0"},
										children: [
											{
												nodeType: "div",
												style: {"background-color": "#FFD00F"}
											},
											{
												nodeType: "div",
												class: "bolder",
												style: {margin: "0 10px"},
												innerHTML: "银行账号"
											},
											{
												nodeType: "div",
												class: "line-grey-dashed"
											}
										]
									},
									{
										nodeType: "el-table",
										style: {
											margin: "0 40px",
											width: "auto"
										},
										props: {data: "{detailData.bankAccounts}"},
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
	}
})
