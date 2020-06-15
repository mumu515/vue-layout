export default () => ({
	path: "/corehr/EMPLOYEE/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				isReset: true,
				info: {effectiveDate: ""},
				locale: {},
				detailData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
						  self.info.effectiveDate=self.asOfDate;
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
             			"code":"Web_Get_Employee",
             			"steps":[
             				{
             					"code":"Web_Get_Employee",
             					"data":[{"payload":{"query":{"instanceId":self.instanceId},"asOfDate":self.info.effectiveDate}}]
             				}]
             			}
             		}
              }).then(function(response){
                self.detailData=response.data[0].transaction.steps[0].results[0].instances[0];
                self.isReset=false;
								self.$nextTick(function(){self.isReset = true;});
              });`
						
					}
				},
				{
					methodName: "changeDate",
					handler: {
						body: `
							self.$msgbox({
                message: "是否需要重新加载数据",
                title: "确认",
                type: "warning",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }).then(function(){
                 self.getData();
              })
						`
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"CorehrMetaObjectLayout",params: {pageType: "list"}});`}
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
						console.log(self.detailData);
						var payComponents=[];
						for(var i=0;i<self.detailData.payComponents.length;i++){
							var temp= self.detailData.payComponents[i];
							if(temp.resetStatus){
								payComponents.push({
									"instanceId":temp.instanceId,
									"currency":temp.currency,
									"payComponent":temp.payComponent,
									"payRate": temp.payRate
								});
							}
						}
						if(payComponents.length===0){
							self.$message({message:"没有更改任何数据",type:"error"});
						}else{
							self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
            	 	data:{
            	 		"transaction": {
            	 			"code": "Adjust_Salary",
            	 			"steps": [
            	 				{
									      "code": "New_Update_Employee",
									      "effectiveDate": self.info.effectiveDate,
									      "data": [
									      	{
									        	"payload": {
									        		"instanceId": self.detailData.instanceId,
									        		"payComponents":payComponents
									          }
									        }]
									    }]
									}
								}
            	  }).then(function(response){
            	  	if(response.bizCode==="0"){
            	  		self.routerBack();
            	  	}
              });
						}
						`
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
								handler: {name: "toDetail"}
							}]
					},
					{
						nodeType: "h2",
						innerHTML: "调整薪酬",
						style: {flex: "auto"}
					}
				]
			},
			{
				nodeType: "el-container",
				props: {direction: "vertical"},
				"v-if": "{isReset}",
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
												slot: "header",
												props: {type: "flex"},
												style: {"align-items": "center"},
												children: [
													{
														nodeType: "div",
														style: {flex: "auto"},
														innerHTML: "操作信息"
													},
													{
														nodeType: "i"
													}]
											},
											{
												nodeType: "y-pre-form",
												props: {span: 3},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "生效日期"},
														children: [
															{
																nodeType: "y-date-picker",
																props: {
																	"value-format": "yyyyMMdd",
																	format: "yyyy-MM-dd",
																	"v-model": "{info.effectiveDate}"
																},
																on: [
																	{
																		name: "change",
																		handler: {
																			name: "changeDate"
																		}
																	}]
															}]
													}]
											}
										]
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
														innerHTML: "调整薪酬项"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.payComponents"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "detailData.payComponents.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												props: {forList: "{detailData.payComponents}"},
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
																				handler: {body: "detailData.payComponents.splice(index,1)"}
																			}]
																	}]
															},
															{
																nodeType: "y-pre-form-with-status",
																props: {
																	formConfig: {
																		span: 3,
																		inline: true,
																		model: "{itemModel}"
																	},
																	initialEditStatus: false
																},
																on: [
																	{
																		name: "reset-status-change",
																		handler: {body: "itemModel.resetStatus=args[0];"}
																	}],
																style: {"margin-top": "20px"},
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "薪酬项",
																			prop: "payComponent"
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.payComponent"
																			}],
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					displayOnly: "{itemModel.id}",
																					defaultValue: "",
																					filter: {params: {asOfDate: "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					optionsPath: "PAY_COMPONENTS.payComponent",
																					"v-model": "{itemModel.payComponent[0]}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "货币",
																			prop: "currency"
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.currency"
																			}],
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					defaultValue: "",
																					filter: {params: {asOfDate: "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					optionsPath: "CURRENCY",
																					"v-model": "{itemModel.currency[0]}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "金额",
																			prop: "payRate"
																		},
																		children: [
																			{
																				nodeType: "y-input-number",
																				props: {
																					defaultValue: "",
																					"v-model": "{itemModel.payRate}"
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
