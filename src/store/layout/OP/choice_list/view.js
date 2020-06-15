export default () => ({
	path: "/corehr/operation/basic/CHOICE_LIST/view",
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
              self.apiRequest({url: "/biz/CHOICE_LIST"+"/"+self.instanceId,type: "GET",
              headers: {TenantId:self.tenantId},params: {depth: 6,asOfDate: self.asOfDate}}).then(function(response){
                self.detailData=response.data;
              });`
					}
				},
				{
					methodName: "changeList",
					handler: {
						body: `self.$router.push({name:"OPCorehrChoiceListLayout",
						params: {pageType: "editList"},query:{instanceId:self.detailData.instanceId,tenantId:self.tenantId}});`
					}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"OPCorehrChoiceListLayout",params: {pageType: "list"}});`}
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
						innerHTML: "查看下拉框",
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
														innerHTML: "名称",
														slot: "label",
														style: {color: "#999999"}
													},
													{
														nodeType: "y-input",
														props: {
															displayOnly: true,
															"v-model": "{detailData.name}"
														}
													}
												]
											}]
									},
									{
										nodeType: "el-container",
										style: {flex: "none"},
										children: [
											{
												nodeType: "el-row",
												children: [
													{
														nodeType: "el-dropdown",
														style: {
															flex: "none",
															"align-self": "center"
														},
														children: [
															{
																nodeType: "el-button",
																props: {
																	type: "primary",
																	size: "mini"
																},
																children: [
																	{
																		nodeType: "span",
																		innerHTML: "操作"
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
																				innerHTML: "调整列表值",
																				on: [
																					{
																						name: "click",
																						handler: {name: "changeList"}
																					}]
																			}]
																	}
																]
															}
														]
													}]
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
												nodeType: "y-pre-form",
												style: {margin: "0 40px"},
												props: {model: "{detailData}"},
												children: [
													{
														nodeType: "el-form-item",
														props: {label: "编码"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.code}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "名称"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.name}",
																	displayOnly: true
																}
															}]
													},
													{
														nodeType: "el-form-item",
														props: {label: "描述"},
														children: [
															{
																nodeType: "y-input",
																props: {
																	"v-model": "{detailData.description}",
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
																		filter: {
																			headers: {TenantId: "{tenantId}"},
																			params: {}
																		},
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
