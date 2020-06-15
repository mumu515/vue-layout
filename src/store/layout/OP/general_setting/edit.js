export default () => ({
	path: "/corehr/GENERAL_SETTING/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				detailData: {},
				tenantList: []
			},
			methods: [
				{
					methodName: "init",
					handler: {body: `self.getTenantList();self.getData();`}
				},
				{
					methodName: "getData",
					handler: {
						body: `
              self.apiRequest({url: "/biz/GENERAL_SETTING"+"/"+self.instanceId,type: "GET",
              headers: {TenantId:self.tenantId},params: {depth: 6,asOfDate: self.asOfDate}}).then(function(response){
                self.detailData=response.data;
              });`
					}
				},
				{
					methodName: "getTenantList",
					handler: {
						body: `
             self.apiRequest({url: "/biz/tenant",type: "GET",headers: {},params: {},data:{}}).then(function(response){
              	self.tenantList=response.data;
              });`
						
					}
				},
				{
					methodName: "submit",
					handler: {
						body: `
            self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {TenantId:self.tenantId},params: {},
             	data:{
             		"transaction":{
             			"code":"Web_Correct_GeneralSetting",
									"steps":[{
										"code":"Web_Correct_GeneralSetting",
									  "effectiveDate": "19000101",
										"data":[{"payload":self.generateData(self.detailData)}]}]
             		}
             	}
            }).then(function(response){
              if(response.bizCode==="0"){
              	self.toView();
              }
            });`
					}
				},
				{
					methodName: "toView",
					handler: {
						body: `self.$router.replace({name:"OPCorehrGeneralSettingLayout",params: {pageType: "view"}});`
					}
				}]
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
												handler: {name: "toView"}
											}]
									},
									{
										nodeType: "h2",
										innerHTML: "修改配置",
										style: {flex: "auto"}
									}
								]
							}]
					}]
			},
			{
				nodeType: "el-scrollbar",
				children: [
					{
						nodeType: "el-container",
						style: {"margin-bottom": "20px"},
						props: {direction: "vertical"},
						children: [
							{
								nodeType: "el-card",
								style: {margin: "20px 20px 0 20px"},
								children: [
									{
										nodeType: "el-row",
										style: {color: "red"},
										innerHTML: "所有配置数据修改后，都需要进行部署租户配置来是配置生效（基本配置>基本配置>部署配置按钮）"
									}]
							},
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
																innerHTML: "租户",
																slot: "label",
																style: {color: "#999999"}
															},
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{detailData.tenantId}",
																	options: "{self.tenantList}",
																	labelKey: "tenantCode",
																	valueKey: "tenantId",
																	displayOnly: true
																}
															}
														]
													}]
											}]
									}]
							},
							{
								nodeType: "el-card",
								style: {margin: "20px 20px 0 20px"},
								props: {
									header: "修改",
									"body-style": {"padding": "0"}
								},
								children: [
									{
										nodeType: "y-pre-form",
										"v-if": "{detailData.instanceId}",
										style: {margin: "20px 40px"},
										props: {
											model: "{detailData.tenantInterSetup[0]}",
											"labelWidth": "180px"
										},
										children: [
											{
												nodeType: "el-form-item",
												props: {label: "租户默认核心组织"},
												defaultValueMap: [
													{
														value: "[\"\"]",
														valueType: "Array",
														key: "detailData.tenantDefaultSetup[0].mrgOrgTreeRoot"
													}],
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{detailData.tenantDefaultSetup[0].mrgOrgTreeRoot[0]}",
															optionsPath: "ORGANIZATION",
															filter: {
																headers: {TenantId: "{tenantId}"},
																data: {type: "MANAGEMENT"},
																params: {}
															}
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
															filter: {
																headers: {TenantId: "{tenantId}"}
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
															filter: {
																headers: {TenantId: "{tenantId}"}
															},
															optionsPath: "TENANT_INTER_SETUP.isCreateUser"
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
			{
				nodeType: "el-row",
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
														props: {
															size: "mini",
															type: "primary"/* "formSubmit": true*/
														},
														innerHTML: "提交保存",
														on: [
															{
																name: "click",
																handler: {name: "submit"}
															}]
													},
													{
														nodeType: "el-button",
														props: {size: "mini"},
														innerHTML: "取消",
														on: [
															{
																name: "click",
																handler: {name: "toView"}
															}]
													}]
											}]
									}]
							}]
					}]
			}
		]
	}
})
