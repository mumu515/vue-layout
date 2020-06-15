export default () => ({
	path: "/corehr/EMPLOYEE/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			scopeId: 1,
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
						var payload={	"instanceId": self.detailData.instanceId};
						var positions=[];
						for(var i=0;i<self.detailData.positions.length;i++){
							var temp= self.detailData.positions[i];
							if(temp.resetStatus){
								positions.push({
									"instanceId":temp.instanceId,
									"position":temp.position,
									"assignmentType":temp.assignmentType,
								});
								payload.positions=positions;
							}
						}
						
						var managementLevels=[];
						for(var i=0;i<self.detailData.managementLevels.length;i++){
							var temp= self.detailData.managementLevels[i];
							if(temp.resetStatus){
								managementLevels.push({
									"instanceId":temp.instanceId,
									"managementLevel":temp.managementLevel,
									"assignmentType":temp.assignmentType,
								});
								payload.managementLevels=managementLevels;
							}
						}
						
						var jobs=[];
						for(var i=0;i<self.detailData.jobs.length;i++){
							var temp= self.detailData.jobs[i];
							if(temp.resetStatus){
								jobs.push({
									"instanceId":temp.instanceId,
									"job":temp.job,
									"assignmentType":temp.assignmentType,
								});
								payload.jobs=jobs;
							}
						}
						
						var organizations=[];
						for(var i=0;i<self.detailData.organizations.length;i++){
							var temp= self.detailData.organizations[i];
							if(temp.resetStatus){
								organizations.push({
									"instanceId":temp.instanceId,
									"type":temp.type,
									"organization":temp.organization,
									"assignmentType":temp.assignmentType,
								});
								payload.organizations=organizations;
							}
						}
						
						var managers=[];
						for(var i=0;i<self.detailData.managers.length;i++){
							var temp= self.detailData.managers[i];
							if(temp.resetStatus){
								managers.push({
									"instanceId":temp.instanceId,
									"manager":temp.manager,
									"type":temp.type,
									"assignmentType":temp.assignmentType,
								});
								payload.managers=managers;
							}
						}
						if(positions.length===0&&managementLevels.length===0&&jobs.length===0&&organizations.length===0&&managers.length===0){
							self.$message({message:"没有更改任何数据",type:"error"});
						}else{
							self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
            	 	data:{
            	 		"transaction": {
            	 			"code": "Change_Job",
            	 			"steps": [
            	 				{
									      "code": "New_Update_Employee",
									      "effectiveDate": self.info.effectiveDate,
									      "data": [
									      	{
									        	"payload": payload
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
						innerHTML: "调整工作",
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
														innerHTML: "职位"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.positions"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "detailData.positions.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												props: {forList: "{detailData.positions}"},
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
																				handler: {body: "detailData.positions.splice(index,1)"}
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
																			label: "分配类型",
																			prop: "assignmentType"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					displayOnly: "{itemModel.id}",
																					"defaultValue": "",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "POSITIONS.assignmentType",
																					"v-model": "{itemModel.assignmentType}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "职位",
																			prop: "position"
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.position"
																			}],
																		children: [
																			{
																				nodeType: "y-select",
																				props: {
																					defaultValue: "",
																					filter: {params: {asOfDate: "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					optionsPath: "POSITION",
																					"v-model": "{itemModel.position[0]}"
																				}
																			}]
																	}]
															}
														]
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
														innerHTML: "职务"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.jobs"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "detailData.jobs.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												"props": {"forList": "{detailData.jobs}"},
												"scopedSlots": [
													{
														"name": "default",
														"scopeMapping": {
															"itemModel": "item",
															index: "index"
														},
														"nodes": [
															{
																nodeType: "el-row",
																"v-if": "{!itemModel.id}",
																props: {"type": "flex"},
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
																				handler: {body: "detailData.jobs.splice(index,1)"}
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
																			label: "分配类型",
																			prop: "assignmentType"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"defaultValue": "",
																					displayOnly: "{itemModel.id}",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "JOBS.assignmentType",
																					"v-model": "{itemModel.assignmentType}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "职务",
																			prop: "job"
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.job"
																			}],
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"defaultValue": "",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "JOB",
																					"v-model": "{itemModel.job[0]}"
																				}
																			}]
																	}]
															}
														]
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
														innerHTML: "职级"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.managementLevels"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "detailData.managementLevels.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												"props": {"forList": "{detailData.managementLevels}"},
												"scopedSlots": [
													{
														"name": "default",
														"scopeMapping": {
															"itemModel": "item",
															index: "index"
														},
														"nodes": [
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
																				handler: {body: "detailData.managementLevels.splice(index,1)"}
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
																style: {"margin-top": "20px"},
																on: [
																	{
																		name: "reset-status-change",
																		handler: {body: "itemModel.resetStatus=args[0];"}
																	}],
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "分配类型",
																			prop: "assignmentType"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"defaultValue": "",
																					displayOnly: "{itemModel.id}",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "MANAGEMENT_LEVELS.assignmentType",
																					"v-model": "{itemModel.assignmentType}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "职级",
																			prop: "managementLevel"
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.managementLevel"
																			}],
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"defaultValue": "",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "MANAGEMENT_LEVEL",
																					"v-model": "{itemModel.managementLevel[0]}"
																				}
																			}]
																	}]
															}
														]
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
														innerHTML: "组织"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.organizations"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "detailData.organizations.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												"props": {"forList": "{detailData.organizations}"},
												"scopedSlots": [
													{
														"name": "default",
														"scopeMapping": {
															"itemModel": "item",
															index: "index"
														},
														"nodes": [
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
																				handler: {body: "detailData.organizations.splice(index,1)"}
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
																style: {"margin-top": "20px"},
																on: [
																	{
																		name: "reset-status-change",
																		handler: {body: "itemModel.resetStatus=args[0];"}
																	}],
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "分配类型",
																			prop: "assignmentType"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"defaultValue": "",
																					displayOnly: "{itemModel.id}",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "ORGANIZATIONS.assignmentType",
																					"v-model": "{itemModel.assignmentType}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "组织类型",
																			prop: "type"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					displayOnly: "{itemModel.id}",
																					"defaultValue": "",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "ORGANIZATIONS.type",
																					"v-model": "{itemModel.type}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "组织",
																			prop: "organization"
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.organization"
																			}],
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"defaultValue": "",
																					"filter": {
																						"data": {"type": "{itemModel.type}"},
																						"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}
																					},
																					"optionsPath": "ORGANIZATION",
																					"v-model": "{itemModel.organization[0]}"
																				}
																			}]
																	}]
															}
														]
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
														innerHTML: "汇报关系"
													},
													{
														nodeType: "i",
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.managers"
															}],
														class: "el-icon-plus",
														on: [
															{
																name: "click",
																handler: {
																	body: "detailData.managers.push({})"
																}
															}]
													}]
											},
											{
												nodeType: "y-list",
												"props": {"forList": "{detailData.managers}"},
												"scopedSlots": [
													{
														"name": "default",
														"scopeMapping": {
															"itemModel": "item",
															index: "index"
														},
														"nodes": [
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
																				handler: {body: "detailData.managers.splice(index,1)"}
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
																style: {"margin-top": "20px"},
																on: [
																	{
																		name: "reset-status-change",
																		handler: {body: "itemModel.resetStatus=args[0];"}
																	}],
																children: [
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "汇报类型",
																			prop: "type"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					displayOnly: "{itemModel.id}",
																					"defaultValue": "",
																					"filter": {"params": {"asOfDate": "{detailData.effectiveDate.replace(/-/g,\"\")}"}},
																					"optionsPath": "MANAGERS.type",
																					"v-model": "{itemModel.type}"
																				}
																			}]
																	},
																	{
																		nodeType: "el-form-item",
																		props: {
																			label: "经理",
																			prop: "manager"
																		},
																		children: [
																			{
																				"nodeType": "y-select",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.manager"
																					}],
																				"props": {
																					"defaultValue": "",
																					"optionsPath": "EMPLOYEE",
																					"labelKey": "$.personal[0].names[?(@.locale[0].code==\"CHN\"&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																					"remoteFilterKey": "personal.names.nameCHN.displayName",
																					"filter": {
																						"params": {"asOfDate": "{formData.employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"},
																						"data": {"personal.names.type": "PREFERRED"}
																					},
																					"v-model": "{itemModel.manager[0]}"
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
