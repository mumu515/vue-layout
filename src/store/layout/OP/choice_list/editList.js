export default () => ({
	path: "/corehr/operation/basic/CHOICE_LIST/editList",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			scopeId: 1,
			data: {
				locale: {},
				detailData: {},
				submitData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {body: `self.getData();`}
				},
				{
					methodName: "getData",
					handler: {
						body: `
              self.apiRequest({url: "/biz/CHOICE_LIST"+"/"+self.instanceId,type: "GET",
              headers: {},params: {depth: 6,asOfDate: self.asOfDate}}).then(function(response){
                self.detailData=response.data;
								self.submitData=JSON.parse(JSON.stringify(self.detailData));
              });`
					}
				},
				{
					methodName: "submit",
					handler: {
						body: `
						console.log(self.detailData);
            self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
             	data:{
             		"transaction":{
             			"code":"Merge_Choice_List",
									"steps":[{
										"code":"Merge_Choice_List",
									  "effectiveDate": "19000101",
										"data":[{"payload":self.generateData(self.submitData)}]}]
             		}
             	}
            }).then(function(response){
              if(response.bizCode==="0"){
              	self.routerBack();
              }
            });`
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"OPCorehrChoiceListLayout",params: {pageType: "list"}});`}
				},
				{
					methodName: "toDetail",
					handler: {
						args: "instanceId",
						body: `
            self.$router.replace({
              name:"OPCorehrChoiceListLayout",
              params: {pageType: "view"},
              query: {instanceId: self.instanceId,asOfDate: self.asOfDate,tenantId: self.getFromTree("op_meta_tenantId")}
            });`
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
						innerHTML: "调整列表值",
						style: {flex: "auto"}
					}
				]
			},
			{
				nodeType: "el-container",
				props: {direction: "vertical"},
				children: [
					{
						nodeType: "el-container",
						style: {height: "calc(100vh - 230px)"},
						props: {direction: "vertical"},
						children: [
							{
								nodeType: "el-scrollbar",
								style: {
									flex: "auto",
									"margin-bottom": "20px"
								},
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
												nodeType: "el-row",
												slot: "header",
												props: {type: "flex"},
												style: {"align-items": "center"},
												children: [
													{
														nodeType: "div",
														style: {flex: "auto"},
														innerHTML: "调整列表值"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "submitData.choiceItems"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "submitData.choiceItems.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												props: {forList: "{submitData.choiceItems}"},
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
																props: {"type": "flex"},
																"v-if": "{!itemModel.id}",
																style: {
																	"height": "30px",
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
																				handler: {body: "submitData.choiceItems.splice(index,1)"}
																			}]
																	}]
															},
															{
																nodeType: "y-pre-form-with-status",
																props: {
																	formConfig: {
																		span: 4,
																		labelPosition: "top",
																		inline: true,
																		model: "{itemModel}"
																	},
																	initialEditStatus: false
																},
																style: {"margin-top": "20px"},
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "编号",
																			prop: "seq"
																		},
																		children: [
																			{
																				nodeType: "y-input-number",
																				props: {
																					"v-model": "{itemModel.seq}",
																					controls: false,
																					"precision": 0
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "编码",
																			prop: "code"
																		},
																		defaultValueMap: [
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.code"
																			}],
																		children: [
																			{
																				nodeType: "y-input",
																				props: {
																					displayOnly: "{itemModel.id}",
																					"v-model": "{itemModel.code}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "生效状态",
																			prop: "status"
																		},
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					defaultValue: "",
																					filter: {params: {asOfDate: "{submitData.effectiveDate.replace(/-/g,\"\")}"}},
																					optionsPath: "CHOICE_ITEM.status",
																					"v-model": "{itemModel.status}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "名称",
																			prop: "name"
																		},
																		children: [
																			{
																				nodeType: "y-input",
																				props: {
																					defaultValue: "",
																					"v-model": "{itemModel.name}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "描述",
																			prop: "description"
																		},
																		children: [
																			{
																				nodeType: "y-input",
																				props: {
																					defaultValue: "",
																					"v-model": "{itemModel.description}"
																				}
																			}]
																	}]
															}
														]
													}]
											}
										]
									}
								]
							}]
					},
					{
						nodeType: "el-row",
						style: {flex: "none"},
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
																props: {size: "mini"},
																innerHTML: "返回",
																on: [
																	{
																		name: "click",
																		handler: {name: "toDetail"}
																	}]
															},
															{
																nodeType: "el-button",
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
				
				]
			}
		]
	}
})
