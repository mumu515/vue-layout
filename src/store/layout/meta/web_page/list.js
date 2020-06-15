import {getCookieByQuery} from "@/utils/auth";

export default () => ({
	path: "/corehr/WEB_PAGE/index/list",
	layout: {
		nodeType: "el-container",
		
		props: {direction: "vertical"},
		scope: {
			data: {
				tenantList: [],
				inProgress: false,searchParams: {
					search: {},
					current: {
					}
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
						body: `self.searchParams.current.asOfDate=self.today.mFormat("yyyyMMdd");self.getTenantList();self.search();`
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
					methodName: "getData",
					handler: {
						body: `
             self.inProgress=true;
             self.apiRequest({url: "/v2.4/transaction/api",type: "POST",
             	headers: {TenantId:self.searchParams.search.tenantId},params: {},
             	data:{
             		"transaction":{
             			"code":"Web_Search_WebPage",
             			"steps":[
             				{
             					"code":"Web_Search_WebPage",
             					"data":[{"payload":{
             						"query":{
             						 	"code": self.searchParams.search.code||undefined,
                					"name": self.searchParams.search.name||undefined
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
              },function(){self.inProgress=false;});`
						
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
						args: "detailId",
						body: `
            self.$router.push({
              name:"CorehrMetaObjectLayout",
              params: {pageType: "view"},
              query: {id: detailId,asOfDate: self.searchParams.search.asOfDate}
            });`
					}
				}
			]
		},
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
												tenantId: {required: true},
												code: {required: "{!searchParams.current.name}"},
												name: {required: "{!searchParams.current.code}"}
											},
											inline: true,
											labelPosition: "top"
										},
										children: [
											{
												nodeType: "el-form-item",
												props: {
													label: "租户",
													prop: "tenantId"
												},
												children: [
													{
														nodeType: "y-select",
														props: {
															"v-model": "{searchParams.current.tenantId}",
															options: "{self.tenantList}",
															labelKey:"tenantCode",
															valueKey:"tenantId",
															filter: {params: {}}
														}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {
													label: "编码",
													prop: "code"
												},
												children: [
													{
														nodeType: "y-input",
														props: {"v-model": "{searchParams.current.code}"}
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
														props: {"v-model": "{searchParams.current.name}"}
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
												innerHTML: "创建新下拉列表",
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
													label: "描述",
													prop: "description"
												}
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
														scopeMapping: {
															row: "row",
															index: "index"
														},
														nodes: [
															{
																nodeType: "el-button",
																innerHTML: "查看",
																props: {type: "text"},
																
																style: {color: "#189CFF"},
																on: [
																	{
																		name: "click",
																		handler: {
																			name: "toDetail",
																			args: "{row.id}"
																		}
																	}]
															}
														]
													}]
											}]
									},
									//分页
									{
										nodeType: "el-pagination",
										"v-if":"{list.length}",class: "pagination",
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
			}
		]
	}
})

