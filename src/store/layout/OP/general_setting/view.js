export default () => ({
	path: "/corehr/GENERAL_SETTING/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				inProgress: false,searchParams: {
					search: {},
					current: {}
				},
				detailData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
						self.searchParams.search.asOfDate=self.today.mFormat("yyyyMMdd");
						self.getData();
						`
					}
				},
				{
					methodName: "getData",
					handler: {
						body: `
						 self.inProgress=true;
						 self.searchParams.search.tenantId=self.getFromTree("op_meta_tenantId");
						 if(self.searchParams.search.tenantId){
             	self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
             		data:{
             			"transaction":{
             				"code":"Web_Search_GeneralSetting",
             				"steps":[
             					{
             						"code":"Web_Search_GeneralSetting",
             						"data":[{"payload":{
             							"query":{},"asOfDate":self.searchParams.search.asOfDate
             						}}]
             					}]
             				}
             			}
             	}).then(function(response){
             	self.inProgress=true;
             		var result = response.data[0].transaction.steps[0].results[0];
             	  self.detailData=result.instances[0];
             	},function(){self.inProgress=true;});
             }`
						
					}
				},
				{
					methodName: "reloadSetting",
					handler: {
						args: "instanceId",
						body: `
						self.apiRequest({url: "/op/meta/distributedReload",type: "GET",
             	headers: {},params: {reloadTenantId:self.getFromTree("op_meta_tenantId")},
             	data:{}}).then(function(response){
             		if(response.bizCode=="0"){
             			self.$message({message:"部署完成",type:"success"});
             		}else{
             			self.$message({message:"部署失败",type:"error"});
             		}
             	});`
					}
				},
				{
					methodName: "toEdit",
					handler: {
						args: "instanceId",
						body: `self.$router.push({name:"OPCorehrGeneralSettingLayout",params: {pageType: "edit"},query: {instanceId:instanceId,tenantId:self.searchParams.search.tenantId}});`
					}
				}]
		},
		children: [
			{
				nodeType: "el-container",
				class: "header-part page-header",
				style: {"align-items": "center"},
				children: [
					{
						nodeType: "h2",
						innerHTML: "GENERAL_SETTING详情页",
						style: {flex: "auto"}
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
														innerHTML: "编码",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-input",
														props: {
															displayOnly: true,
															"v-model": "{detailData.code}"
														}
													}
												]
											},
											{
												nodeType: "el-form-item",
												style: {margin: 0},
												children: [
													{
														nodeType: "span",
														innerHTML: "名称",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-input",
														props: {
															displayOnly: true,
															"v-model": "{detailData.name}"
														}
													}
												]
											}]
									},
									{
										nodeType: "el-container",
										style: {flex: "none"},
										children: [
											{
												nodeType: "el-row",
												children: [
													{
														nodeType: "el-button",
														"v-if": "{detailData.instanceId}",
														props: {
															type: "primary",
															size: "mini"
														},
														innerHTML: "修改配置",
														on: [
															{
																name: "click",
																handler: {
																	name: "toEdit",
																	args: "{detailData.instanceId}"
																}
															}]
													},
													{
														nodeType: "el-button",
														"v-if": "{detailData.instanceId}",
														props: {
															type: "primary",
															size: "mini"
														},
														innerHTML: "部署配置",
														on: [
															{
																name: "click",
																handler: {
																	name: "reloadSetting",
																	args: "{detailData.instanceId}"
																}
															}]
													}]
											}]
									}]
							}]
					},
					{
						nodeType: "el-card",
						style: {margin: "20px 20px 0 20px"},
						children: [
							{
								nodeType: "el-tabs",
								children: [
									{
										nodeType: "el-tab-pane",
										props: {label: "详情"},
										children: [
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {model: "{detailData}"},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "ID"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.id}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "ExternalId"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.externalId}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "编码"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.code}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "名称"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.name}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "描述"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.description}",
																	"displayOnly": true
																}
															}]
													}
												]
											}]
									},
									{
										nodeType: "el-tab-pane",
										props: {label: "租户默认值设置"},
										children: [
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {model: "{detailData.tenantDefaultSetup[0]}"},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "ID"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].id}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "外部来源ID"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].externalId}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "编码"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].code}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "名称"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].name}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "租户默认值语言"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].tenantDefaultLanguage[0]}",
																	displayOnly: true,
																	filter: {
																		headers: {TenantId: "{searchParams.search.tenantId}"},
																		params: {}
																	},
																	optionsPath: "TENANT_DEFAULT_SETUP.tenantDefaultLanguage"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "租户默认国家地区"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].tenantDefaultLocale[0]}",
																	displayOnly: true,
																	filter: {
																		headers: {TenantId: "{searchParams.search.tenantId}"},
																		params: {}
																	},
																	optionsPath: "TENANT_DEFAULT_SETUP.tenantDefaultLocale"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "租户默认货币"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].tenantDefaultCurrency[0]}",
																	displayOnly: true,
																	filter: {
																		headers: {TenantId: "{searchParams.search.tenantId}"},
																		params: {}
																	},
																	optionsPath: "TENANT_DEFAULT_SETUP.tenantDefaultCurrency"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "租户默认核心组织"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantDefaultSetup[0].mrgOrgTreeRoot[0]}",
																	optionsPath: "ORGANIZATION",
																	displayOnly: true,
																	filter: {
																		headers: {TenantId: "{searchParams.search.tenantId}"},
																		data: {type: "MANAGEMENT"},
																		params: {}
																	}
																}
															}]
													}
												]
											}]
									},
									{
										nodeType: "el-tab-pane",
										props: {label: "租户集成设置"},
										children: [
											{
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {
													model: "{detailData.tenantInterSetup[0]}",
													"labelWidth": "180px"
												},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "ID"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantInterSetup[0].id}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "外部来源ID"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantInterSetup[0].externalId}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "编码"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantInterSetup[0].code}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "名称"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.tenantInterSetup[0].name}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "入职是否创建Person"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantInterSetup[0].isCreatePerson}",
																	displayOnly: true,
																	filter: {
																		headers: {TenantId: "{searchParams.search.tenantId}"},
																		params: {}
																	},
																	optionsPath: "TENANT_INTER_SETUP.isCreatePerson"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "入职是否创建User"},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantInterSetup[0].isCreateUser}",
																	displayOnly: true,
																	filter: {
																		headers: {TenantId: "{searchParams.search.tenantId}"},
																		params: {}
																	},
																	optionsPath: "TENANT_INTER_SETUP.isCreateUser"
																}
															}]
													}
												
												]
											}]
									},
									{
										nodeType: "el-tab-pane",
										props: {label: "租户BPM配置"},
										children: [
											{
												nodeType: "el-table",
												props: {data: "{detailData.bpmSetup}"},
												children: [
													{
														nodeType: "el-table-column",
														props: {
															label: "ID",
															prop: "id"
														}
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "外部来源ID",
															prop: "externalId"
														}
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "编码",
															prop: "code"
														}
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "名称",
															prop: "name"
														}
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "请求来源",
															prop: "source"
														}
													},
													{
														nodeType: "el-table-column",
														props: {label: "设置需要调用的transaction"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			displayOnly: true,
																			"v-model": "{row.transaction[0]}",
																			filter: {
																				headers: {TenantId: "{searchParams.search.tenantId}"},
																				params: {}
																			},
																			optionsPath: "BPM_SETUP.transaction"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "bpm项目启动流程type",
															prop: "processType"
														}
													}]
											}
										]
									}]
							}]
					}
				]
			}
		]
	}
})
