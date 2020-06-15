export default () => ({
	path: "/corehr/CURRENCY/index/list",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				inProgress: false,searchParams: {
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
						body: ``
					}
				},
				{
					methodName: "getData",
					handler: {
						body: `
             self.inProgress=true;
             self.searchParams.search.asOfDate=self.today.mFormat("yyyyMMdd");
             self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
             	data:{
             		"transaction":{
             			"code":"Web_Search_Currency",
             			"steps":[
             				{
             					"code":"Web_Search_Currency",
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
              	self.inProgress=true;
              	var result = response.data[0].transaction.steps[0].results[0];
                self.list=result.instances;
                self.pagination.page=result.page;
						  	self.pagination.pageSize=result.pageSize;
						  	self.pagination.total=result.total;
              },function(){self.inProgress=true;});`
						
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
              name:"OPCorehrMetaObjectLayout",
              params: {pageType: "add"},
              query: {asOfDate: self.searchParams.search.asOfDate,tenantId: self.getFromTree("op_meta_tenantId")}
            });`
					}
				},
				{
					methodName: "toDetail",
					handler: {
						args: "instanceId",
						body: `
            self.$router.push({
              name:"OPCorehrMetaObjectLayout",
              params: {pageType: "view"},
              query: {instanceId: instanceId,asOfDate: self.searchParams.search.asOfDate,tenantId: self.getFromTree("op_meta_tenantId")}
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
						nodeType: "el-container",
						class: "header-part page-header",
						style: {"align-items": "center"},
						children: [
							{
								nodeType: "h2",
								innerHTML: "货币管理",
								style: {margin: "0 !important"}
							}]
					}]
			},
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
										children: []
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
																			args: "{row.instanceId}"
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

