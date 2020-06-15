export default () => ({
	path: "/corehr/MANAGEMENT_LEVEL/index/view",
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
              self.apiRequest({url: "/biz/"+self.objectCode+"/"+self.instanceId,type: "GET",
              headers: {},params: {depth: 6,asOfDate: self.asOfDate}}).then(function(response){
                self.detailData=response.data;
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
						innerHTML: "查看职级",
						style: {flex: "auto"}
					},
					{
						nodeType: "span",
						innerHTML: "截止日期",
						style: {"margin-right": "20px"}
					},
					{
						nodeType: "y-date-picker",
						props: {
							
							displayOnly: true,
							"value-format": "yyyyMMdd",
							format: "yyyy-MM-dd",
							"v-model": "{asOfDate}"
						}
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
												props: {
													model: "{detailData}"
												},
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
																props: {label: "生效状态"},
																children: [
																	{
																		nodeType: "y-select",
																		props: {
																			"v-model": "{detailData.status}",
																			displayOnly: true,
																			optionsPath: "MANAGEMENT_LEVEL.status",
																			filter: {params: {asOfDate: "{asOfDate}"}}
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
											}]
									}]
							}]
					}
				]
			}
		]
	}
})
