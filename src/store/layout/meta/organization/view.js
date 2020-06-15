export default () => ({
	path: "/corehr/ORGANIZATION/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				locale: {},
				detailData: {}
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
             			"code":"Web_Get_Organization",
             			"steps":[
             				{
             					"code":"Web_Get_Organization",
             					"data":[{"payload":{"query":{"instanceId":self.instanceId},"asOfDate":self.asOfDate}}]
             				}]
             			}
             		}
              }).then(function(response){
                self.detailData=response.data[0].transaction.steps[0].results[0].instances[0];
              });`
						
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"CorehrMetaObjectLayout",params: {pageType: "list"}});`}
				}]
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
						innerHTML: "{detailData.name}",
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
														innerHTML: "类型",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-select",
														props: {
															displayOnly: true,
															"v-model": "{detailData.type}",
															optionsPath: "ORGANIZATION.type",
															filter: {params: {asOfDate: "{asOfDate}"}}
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
						children: [
							{
								nodeType: "el-tabs",
								children: [
									{
										nodeType: "el-tab-pane",
										props: {label: "详情"},
										children: [
											{
												"nodeType": "y-pre-form",
												"style": {"margin": "0 40px"},
												"props": {"model": "{detailData}"},
												"children": [
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-input",
																"props": {
																	"displayOnly": true,
																	"v-model": "{detailData.code}"
																}
															}],
														"props": {"label": "编码"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-input",
																"props": {
																	"displayOnly": true,
																	"v-model": "{detailData.name}"
																}
															}],
														"props": {"label": "名称"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-select",
																"props": {
																	"displayOnly": true,
																	"optionsPath": "ORGANIZATION.status",
																	"filter": {"params": {"asOfDate": "{asOfDate}"}},
																	"v-model": "{detailData.status}"
																}
															}],
														"props": {"label": "生效状态"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-select",
																"props": {
																	"displayOnly": true,
																	"optionsPath": "ORGANIZATION.type",
																	"filter": {"params": {"asOfDate": "{asOfDate}"}},
																	"v-model": "{detailData.type}"
																}
															}],
														"props": {"label": "类型"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-select",
																"props": {
																	"displayOnly": true,
																	"optionsPath": "ORGANIZATION.subType",
																	"filter": {"params": {"asOfDate": "{asOfDate}"}},
																	"v-model": "{detailData.subType}"
																}
															}],
														"props": {"label": "子类型"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-input",
																"props": {
																	"displayOnly": true,
																	"v-model": "{detailData.description}"
																}
															}],
														"props": {"label": "描述"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																"nodeType": "y-select",
																"props": {
																	"displayOnly": true,
																	"optionsPath": "ORGANIZATION.superior",
																	"filter": {"params": {"asOfDate": "{asOfDate}"}},
																	"v-model": "{detailData.superior[0]}"
																}
															}],
														"props": {"label": "上级"}
													},
													{
														"nodeType": "el-form-item",
														"children": [
															{
																nodeType: "y-link-scope",
																props: {
																	tag: "el-row",
																	links: "{detailData._links}",
																	linkKey: "self.manager",
																	data: "{detailData.manager}"
																},
																on: [
																	{
																		name: "instances-completed",
																		handler: {body: "detailData.manager=args[0];"}
																	}],
																children: [
																	{
																		"nodeType": "y-select",
																		"props": {
																			"displayOnly": true,
																			"optionsPath": "ORGANIZATION.manager.personal",
																			"filter": {"params": {"asOfDate": "{asOfDate}"}},
																			"labelKey": "$.names[?((@.locale[0]==\"{locale.CHN.instanceId}\"||@.locale[0].instanceId==\"{locale.CHN.instanceId}\")&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																			"v-model": "{detailData.manager[0].personal[0]}"
																		}
																	}]
															}],
														"props": {"label": "管理者"}
													}]
											}]
									}]
							}]
					}
				]
			}
		]
	}
})
