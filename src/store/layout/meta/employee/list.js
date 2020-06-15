export default () => ({
	path: "/corehr/EMPLOYEE/index/list",
	layout: {
		nodeType: "el-container",
		
		props: {direction: "vertical"},
		scope: {
			data: {
				locale: {},
				inProgress: false,
				searchParams: {
					search: {},
					current: {}
				},
				pagination: {
					page: 1,
					pageSize: 10,
					total: 0
				},
				list: []
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
							self.searchParams.current.asOfDate=self.today.mFormat("yyyyMMdd");
							self.apiRequest({url: "/biz/LOCALE/search",type: "POST",headers: {},data: {"code": "CHN"}})
								.then(function(response){
									self.locale.CHN=response.data.instances[0];
									// self.search();
							});`
					}
				},
				{
					methodName: "getData",
					handler: {
						body: `
						 self.inProgress=true;
             self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
             	data:{
             		"transaction":{
             			"code":"Web_Search_Employee",
             			"steps":[
             				{
             					"code":"Web_Search_Employee",
             					"data":[{"payload":{
             						"query":{
             							"employment.employeeId": self.searchParams.search.employeeId||undefined,
                					"personal.names.nameCHN.displayName": self.searchParams.search.displayName||undefined,
                					"personal.names.type": self.searchParams.search.displayName?"PREFERRED":undefined,
                					"personal.names.locale.instanceId": self.searchParams.search.displayName?self.locale.CHN.instanceId:undefined,
                					"employment.employmentType": self.searchParams.search.employmentType||undefined,
                					"employment.employmentStatus": self.searchParams.search.employmentStatus||undefined,
                					"organizations.organization.instanceId": self.searchParams.search.organization||undefined,
                					"organizations.type": self.searchParams.search.organization?"MANAGEMENT":undefined,
                					"organizations.assignmentType": self.searchParams.search.organization?"HR":undefined
             						},
             						page:self.pagination.page||1,
             						pageSize:self.pagination.pageSize,
             						"asOfDate":self.searchParams.search.asOfDate
             					}}]
             				}]
             			}
             		}
              }).then(function(response){
						 		self.inProgress=false;
                var result = response.data[0].transaction.steps[0].results[0];
                self.list=result.instances;
                self.pagination.page=result.page;
						  	self.pagination.pageSize=result.pageSize;
						  	self.pagination.total=result.total;
              },function(){
              	self.inProgress=false;
              });`
						
					}
				},
				{
					methodName: "changePage",
					handler: {
						args: "page",
						body: `
              self.pagination.page=page;
              self.searchParamsConfirm();
              self.getData();`
					}
				},
				{
					methodName: "search",
					handler: {
						body: `
              self.pagination.page=1;
              self.changePage();`
					}
				},
				{
					methodName: "searchParamsConfirm",
					handler: {
						body: `self.searchParams.search=JSON.parse(JSON.stringify(self.searchParams.current));`
					}
				},
				{
					methodName: "toAdd",
					handler: {
						body: `self.$router.push({
              name:"CorehrMetaObjectLayout",
              params: {pageType: "add"},
              query: {asOfDate: self.searchParams.search.asOfDate}
            });`
					}
				},
				{
					methodName: "toDetail",
					handler: {
						args: "instanceId",
						body: `
            self.$router.push({
              name:"CorehrMetaObjectLayout",
              params: {pageType: "view"},
              query: {instanceId: instanceId,asOfDate: self.searchParams.search.asOfDate}
            });`
					}
				}
			]
		},
		children: [
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
					height: "calc(100vh - 60px - 4.29em - 0.3rem - 15px - 2.86em)"
				},
				props: {direction: "vertical"},
				children: [
					{
						nodeType: "el-card",
						style: {
							margin: "5px 20px 20px 20px",
							flex: "auto",
							display: "flex"
						},
						props: {
							"body-style": {
								flex: "auto",
								padding: 0
							}
						},
						children: [
							{
								nodeType: "el-scrollbar",
								style: {height: "100%"},
								children: [
									{
										nodeType: "el-main",
										style: {padding: "20px"},
										children: [
											{
												nodeType: "y-pre-form",
												props: {
													model: "{searchParams.current}",
													rules: {
														employeeId: {
															required: "{!searchParams.current.displayName}",
															message: "员工号和显示姓名必须选填一个"
														},
														displayName: {
															required: "{!searchParams.current.employeeId}",
															message: "员工号和显示姓名必须选填一个"
														}
													},
													inline: true,
													labelPosition: "top"
												},
												children: [
													{
														nodeType: "el-form-item",
														props: {
															label: "员工号",
															prop: "employeeId"
														},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{searchParams.current.employeeId}"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {
															label: "显示姓名",
															prop: "displayName"
														},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{searchParams.current.displayName}"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {
															label: "员工类型",
															prop: "employmentType"
														},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{searchParams.current.employmentType}",
																	optionsPath: "EMPLOYMENT.employmentType",
																	filter: {params: {asOfDate: "{searchParams.current.asOfDate}"}}
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {
															label: "在职状态",
															prop: "employmentStatus"
														},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{searchParams.current.employmentStatus}",
																	optionsPath: "EMPLOYMENT.employmentStatus",
																	filter: {params: {asOfDate: "{searchParams.current.asOfDate}"}}
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {
															label: "管理组织",
															prop: "organization"
														},
														children: [
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{searchParams.current.organization}",
																	optionsPath: "ORGANIZATION",
																	filter: {
																		data: {type: "MANAGEMENT"},
																		params: {asOfDate: "{searchParams.current.asOfDate}"}
																	}
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {
															label: "截止日期",
															prop: "asOfDate"
														},
														children: [
															{
																nodeType: "y-date-picker",
																props: {
																	"v-model": "{searchParams.current.asOfDate}",
																	"valueFormat": "yyyyMMdd"
																}
															}]
													},
													{
														nodeType: "el-form-item",
														children: [
															{
																nodeType: "div",
																innerHTML: "操作",
																slot: "label",
																class: "transparent"
															},
															{
																nodeType: "y-button",
																props: {
																	size: "mini",
																	type: "primary",
																	"formSubmit": true
																},
																innerHTML: "搜索",
																on: [
																	{
																		name: "click",
																		handler: {name: "search"}
																	}]
															}]
													}]
											},
											//列表操作
											{
												nodeType: "el-container",
												style: {"padding-bottom": "10px"},
												children: [
													{
														nodeType: "el-button",
														"v-if": false,
														props: {
															size: "mini",
															type: "primary"
														},
														innerHTML: "入职新员工",
														on: [
															{
																name: "click",
																handler: {name: "toAdd"}
															}]
													}]
											},
											//列表
											{
												nodeType: "el-table",
												props: {data: "{list}"},
												directives: [
													{
														name: "loading",
														value: "{{inProgress}}"
													}
												],
												children: [
													{
														nodeType: "el-table-column",
														props: {
															label: "员工号",
															prop: "employment[0].employeeId"
														}
													},
													{
														nodeType: "el-table-column",
														props: {label: "显示姓名"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-link-scope",
																		props: {
																			tag: "el-row",
																			links: "{row._links}",
																			linkKey: "self.personal",
																			data: "{row.personal}"
																		},
																		on: [
																			{
																				name: "instances-completed",
																				handler: {body: "row.personal=args[0];"}
																			}],
																		children: [
																			{
																				"nodeType": "y-select",
																				"props": {
																					"displayOnly": true,
																					"optionsPath": "PERSON",
																					"labelKey": "$.names[?((@.locale[0]==\"{locale.CHN.instanceId}\"||@.locale[0].instanceId==\"{locale.CHN.instanceId}\")&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																					"remoteFilterKey": "instanceId",
																					"filter": {
																						"params": {"asOfDate": "{row.workRelationships[0].hireDate.replace(/-/g,\"\")}"}
																					},
																					"v-model": "{row.personal[0].instanceId}"
																				}
																			}]
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "员工类型"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			displayOnly: true,
																			"v-model": "{row.employment[0].employmentType}",
																			filter: {params: {asOfDate: "{searchParams.search.asOfDate}"}},
																			optionsPath: "EMPLOYMENT.employmentType"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "在职状态"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			displayOnly: true,
																			"v-model": "{row.employment[0].employmentStatus}",
																			filter: {params: {asOfDate: "{searchParams.search.asOfDate}"}},
																			optionsPath: "EMPLOYMENT.employmentStatus"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {label: "管理组织"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: [
																	{
																		nodeType: "y-select",
																		props: {
																			displayOnly: true,
																			optionsPath: "ORGANIZATION",
																			filter: {params: {asOfDate: "{searchParams.search.asOfDate}"}},
																			"v-model": "{$.row.organizations[?(@.assignmentType==\"HR\"&&@.type==\"MANAGEMENT\")].organization[0]}"
																		}
																	}]
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "操作",
															align: "center"
														},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: {
																	nodeType: "el-button",
																	innerHTML: "查看",
																	props: {type: "text"},
																	scopeMapping: {
																		row: "row",
																		index: "index"
																	},
																	style: {color: "#189CFF"},
																	on: [
																		{
																			name: "click",
																			handler: {
																				name: "toDetail",
																				args: "{row.instanceId}"
																			}
																		}]
																}
															}
														]
													}]
											},
											//分页
											{
												nodeType: "el-pagination",
												"v-if": "{list.length}",
												class: "pagination",
												props: {
													background: true,
													layout: "prev, pager, next, jumper",
													"current-page": "{pagination.page}",
													"total": "{pagination.total}",
													"page-size": "{pagination.pageSize}"
												},
												on: [
													{
														name: "current-change",
														handler: {
															name: "changePage"
														}
													}]
											}]
									}]
							}]
					}]
			}
		]
	}
});
