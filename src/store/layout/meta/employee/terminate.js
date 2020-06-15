export default () => ({
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
						body: `
              self.apiRequest({
                  url: "/biz/"+self.objectCode+"/"+self.instanceId,type: "GET",headers: {},
                  params: {depth: 3, asOfDate:self.asOfDate}
              }).then(function(response){
                  if(response.bizCode==="0"){
                    self.formData = response.data;
                  }
								});`
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace("/corehr/EMPLOYEE/index/list");`}
				},
				{
					methodName: "toDetail",
					handler: {
						args: "instanceId",
						body: `
            self.$router.replace({
              name:"CorehrMetaObjectLayout",
              params: {pageType: "view"},
              query: {instanceId: self.instanceId,asOfDate: self.asOfDate}
            });`
					}
				},
				{
					methodName: "submit",
					handler: {
						body: `
              var workRelationships = [];
              for(var i=0;i<self.formData.workRelationships.length;i++){
                workRelationships.push({
															                 "instanceId": self.formData.workRelationships[i].instanceId,
															                 "terminationDate": self.formData.workRelationships[i].terminationDate,
															                 "lastWorkDate": self.formData.workRelationships[i].lastWorkDate,
															                 "reason": self.formData.workRelationships[i].reason
															             });
              }
              self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},
              	data: {
												"transaction": {
													"code": "Terminate_Employee",
													"steps": [
														{
															"code": "Terminate_Employee",
															"effectiveDate": "20200529",
															"data": [
															    {
															      "payload": {
															         "instanceId": self.formData.instanceId,
															         "workRelationships": workRelationships,
															      	"employment": [{"instanceId": self.formData.employment[0].instanceId}]
															      }
															    }]
														}]
												}
											}
							}
              ).then(function(response){
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
										class: "el-icon-arrow-left icon-back",
										style: {"margin-right": "40px"},
										on: [
											{
												name: "click",
												handler: {name: "toDetail"}
											}]
									},
									{
										nodeType: "h2",
										style: {flex: "auto"},
										children: [
											{
												nodeType: "span",
												innerHTML: "离职员工:"
											},
											{
												nodeType: "span",
												innerHTML: "{formData.employment[0].employeeId}"
											},
											{
												nodeType: "span",
												innerHTML: "-"
											},
											{
												nodeType: "span",
												innerHTML: "{formData.personal[0].names[0].nameCHN[0].displayName}"
											}
										]
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
					//tabsmarginbottom:15px,
					// 三级标题:4.29em,
					// actionbutton:0.28rem,
					// buttonmargin:上下各20px,
					// footer:2.86em,
					height: "calc(100vh - 60px - 4.29em - 0.3rem - 15px - 4.29em - 0.28rem - 40px - 2.86em)"
				},
				props: {direction: "vertical"},
				children: [
					{
						nodeType: "el-scrollbar",
						style: {height: "100%"},
						children: [
							{
								nodeType: "el-card",
								style: {
									margin: "20px",
									"min-height": "calc(100vh - 60px - 4.29em - 0.3rem - 15px - 4.29em - 0.28rem - 40px - 2.86em - 40px - 2px)"
								},
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
											}]
									},
									{
										"nodeType": "y-list",
										"style": {"padding": "10px 20px 30px 20px"},
										"props": {"forList": "{formData.workRelationships}"},
										"scopedSlots": [
											{
												"name": "default",
												"nodes": [
													{
														"nodeType": "y-pre-form",
														"props": {
															"model": "{itemModel}",
															"labelPosition": "top",
															"span": 3,
															"inline": true
														},
														"children": [
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-select",
																		"props": {
																			"defaultValue": "",
																			"displayOnly": true,
																			"optionsPath": "WORK_RELATIONSHIPS.assignmentType",
																			"v-model": "{itemModel.assignmentType}"
																		}
																	}],
																"props": {"label": "分配类型"}
															},
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-input",
																		"props": {
																			"defaultValue": "",
																			"displayOnly": true,
																			"v-model": "{itemModel.workRelationshipId}"
																		}
																	}],
																"props": {"label": "劳动关系ID"}
															},
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-select",
																		"props": {
																			"defaultValue": "",
																			"displayOnly": true,
																			"optionsPath": "WORK_RELATIONSHIPS.workRelationshipType",
																			"v-model": "{itemModel.workRelationshipType}"
																		}
																	}],
																"props": {"label": "劳动关系类型"}
															},
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-date-picker",
																		"props": {
																			"defaultValue": "",
																			"v-model": "{itemModel.terminationDate}"
																		}
																	}],
																"props": {
																	"label": "离职日期",
																	"prop": "terminationDate",
																	"required": true
																}
															},
															{
																"nodeType": "el-form-item",
																"children": [
																	{
																		"nodeType": "y-date-picker",
																		"props": {
																			"defaultValue": "",
																			"v-model": "{itemModel.lastWorkDate}"
																		}
																	}],
																"props": {
																	"label": "最后工作日",
																	"prop": "lastWorkDate",
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
																				key: "itemModel.reason"
																			}],
																		"props": {
																			"defaultValue": "",
																			"filter": {"params": {"asOfDate": "{formData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																			"optionsPath": "WORK_RELATIONSHIPS.reason",
																			"v-model": "{itemModel.reason}"
																		}
																	}],
																"props": {
																	"label": "原因",
																	"prop": "reason",
																	"required": true
																}
															}]
													}],
												"scopeMapping": {"itemModel": "item"}
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
																handler: {name: "toDetail"}
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
