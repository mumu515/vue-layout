export default () => ({
	path: "/corehr/MANAGEMENT_LEVEL/index/add",
	layout: {
		nodeType: "el-container",
		
		props: {direction: "vertical"},
		scope: {
			data: {
				formData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `self.formData.effectiveDate = new Date().mFormat('yyyyMMdd')`
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
                  url: "/biz/api",type: "POST",headers: {},
                  data: {
                    events: [{
                        eventCode: "New_ManagementLevel",
                        effectiveDate: self.formData.effectiveDate,
                        data: [{payload: {
                          "code": self.formData.code,"name": self.formData.name,
                          "status": self.formData.status,"description": self.formData.description
                        }}]
                      }]
                }}).then(function(response){
                  if(response.bizCode==="0"){
                    self.toList();
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
										innerHTML: "新建职级",
										style: {flex: "auto"}
									}
								]
							}]
					}]
			},
			{
				nodeType: "el-container",
				style: {
					//header:60px,
					// 二级标题:4.29em,
					// tabs:0.3rem,
					// 三级标题:4.29em,
					// actionbutton:0.28rem,
					// buttonmargin:上下各20px,
					// footer:2.86em,
					// cardmarginbottom:20px
					height: "calc(100vh - 60px - 4.29em - 0.3rem - 15px - 4.29em - 0.28rem - 40px - 2.86em)"
				},
				props: {direction: "vertical"},
				children: [
					{
						nodeType: "el-scrollbar",
						style: {height: "100%"},
						children: [
							{
								"nodeType": "el-card",
								style: {
									margin: "20px",
									"min-height": "calc(100vh - 60px - 4.29em - 0.3rem - 15px - 4.29em - 0.28rem - 40px - 2.86em - 40px - 2px)"
								},
								"props": {
									"header": "职级",
									"body-style": {"padding": "0"}
								},
								"children": [
									{
										"nodeType": "y-pre-form",
										"style": {"padding": "40px 20px 30px 20px"},
										"props": {
											"model": "{formData}",
											"labelPosition": "top",
											"span": 2,
											"inline": true
										},
										"children": [
											{
												"nodeType": "el-form-item",
												"children": [
													{
														"nodeType": "y-date-picker",
														"props": {
															"defaultValue": "",
															"valueFormat": "yyyyMMdd",
															"v-model": "{formData.effectiveDate}"
														}
													}],
												"props": {
													"label": "生效日期",
													"prop": "effectiveDate",
													"required": true
												}
											},
											{
												"nodeType": "el-form-item",
												"children": [
													{
														"nodeType": "y-input",
														"props": {
															"defaultValue": "",
															"v-model": "{formData.code}"
														}
													}],
												"props": {
													"label": "编码",
													"prop": "code",
													"required": true
												}
											},
											{
												"nodeType": "el-form-item",
												"children": [
													{
														"nodeType": "y-input",
														"props": {
															"defaultValue": "",
															"v-model": "{formData.name}"
														}
													}],
												"props": {
													"label": "名称",
													"prop": "name",
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
															"optionsPath": "MANAGEMENT_LEVEL.status",
															"filter": {"params": {"asOfDate": "{formData.effectiveDate}"}},
															"v-model": "{formData.status}"
														}
													}],
												"props": {
													"label": "生效状态",
													"prop": "status",
													"required": true
												}
											},
											{
												"nodeType": "el-form-item",
												"children": [
													{
														"nodeType": "y-input",
														"props": {
															"type": "text",
															"defaultValue": "",
															"v-model": "{formData.description}"
														}
													}],
												"props": {"label": "描述"}
											}]
									}]
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
					right: 0
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
																handler: {name: "toList"}
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
