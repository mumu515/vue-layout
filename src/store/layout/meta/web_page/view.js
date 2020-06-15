export default () => ({
	path: "/corehr/CHOICE_LIST/index/view",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				detailData: {}
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
              self.apiRequest({url: "/layout/LAYOUT_PAGE/"+self.id,type: "GET",
              headers: {},params: {uniqueKey:"WEB_PAGE_ID_UNIQUE"}}).then(function(response){
                self.detailData=response.data;
              });`
					}
				},
				{
					methodName: "deletePage",
					handler: {
						body: `
              self.apiRequest({url: "/layout/LAYOUT_PAGE/"+self.id,type: "DELETE",
              headers: {},params: {uniqueKey:"WEB_PAGE_ID_UNIQUE"}}).then(function(response){
              	self.toList();
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
						innerHTML: "查看界面",
						style: {flex: "auto"}
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
														innerHTML: "ID",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-input",
														props: {
															displayOnly: true,
															"v-model": "{detailData.id}"
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
														innerHTML: "ExternalId",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-input",
														props: {
															displayOnly: true,
															"v-model": "{detailData.externalId}"
														}
													}
												]
											}]
									},
									{
										nodeType: "el-dropdown",
										style: {
											flex: "none",
											"align-self": "center"
										},
										children: [
											{
												nodeType: "el-button",
												props: {type: "primary"},
												children: [
													{
														nodeType: "span",
														innerHTML: "Action"
													},
													{
														nodeType: "i",
														class: "el-icon-arrow-down el-icon--right"
													}
												]
											},
											{
												nodeType: "el-dropdown-menu",
												slot: "dropdown",
												children: [
													{
														nodeType: "el-dropdown-item",
														children: [
															{
																nodeType: "el-button",
																props: {type: "text"},
																innerHTML: "删除",
																on: [
																	{
																		name: "click",
																		handler: {name: "deletePage"}
																	}]
															}]
													}
												]
											}
										]
									}
								]
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
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {model: "{detailData}"},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "ID"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.id}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "ExternalId"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.externalId}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "node"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.node}",
																	"displayOnly": true
																}
															}]
													}
												]
											}]
									},
									{
										nodeType: "el-tab-pane",
										props: {label: "值表"},
										children: [
											{
												nodeType: "el-table",
												style: {
													margin: "0 40px",
													width: "auto"
												},
												props: {data: "{detailData.choiceItems}"},
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
															label: "序号",
															prop: "seq"
														}
													},
													{
														nodeType: "el-table-column",
														props: {label: "生效状态"},
														scopedSlots: [
															{
																name: "default",
																scopeMapping: {row: "row"},
																nodes: {
																	nodeType: "y-select",
																	props: {
																		displayOnly: true,
																		"v-model": "{row.status}",
																		filter: {params: {}},
																		optionsPath: "CHOICE_ITEM.status"
																	}
																}
															}]
													},
													{
														nodeType: "el-table-column",
														props: {
															label: "描述",
															prop: "description"
														}
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
