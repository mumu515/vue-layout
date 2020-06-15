export default () => ({
	layout: {
		nodeType: "corehr-root",
		class: "corehr-main-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				tenantList: [],
				op_meta_tenantId: "",
				inProgress: false,searchParams: {
					current: {tenantId: ""}
				}
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
						self.searchParams.current.tenantId=self.getCookieByQuery("op_meta_tenantId");
						self.op_meta_tenantId=self.searchParams.current.tenantId;
						self.getTenantList();`
					}
				},
				{
					methodName: "changeTenant",
					handler: {
						body: `
						console.log(self.$route);
						if(self.op_meta_tenantId!==self.searchParams.current.tenantId){
							self.inProgress=true;
							self.op_meta_tenantId=self.searchParams.current.tenantId;
							self.setCookieByQuery("op_meta_tenantId",self.op_meta_tenantId);
							if(self.searchParams.current.tenantId){
								self.updateMetaObject(self.searchParams.current.tenantId).then(function(){
									var params=self.$route.params;
									var isNeedBack=false;
									if(self.$route.meta.defaultParams){
										for(var i in self.$route.meta.defaultParams){
											if(params[i]!==self.$route.meta.defaultParams[i]){
												isNeedBack=true;
												params[i]=self.$route.meta.defaultParams[i];
											}
										}
									}
									self.inProgress=true;
									if(isNeedBack){
										self.$router.replace({name:self.$route.name,params:params});
									}else{
										self.reload();
									}
								});
							}else{
								var params=self.$route.params;
								var isNeedBack=false;
								if(self.$route.meta.defaultParams){
									for(var i in self.$route.meta.defaultParams){
										if(params[i]!==self.$route.meta.defaultParams[i]){
											isNeedBack=true;
											params[i]=self.$route.meta.defaultParams[i];
										}
									}
								}
								self.inProgress=true;
								if(isNeedBack){
									self.$router.replace({name:self.$route.name,params:params});
								}else{
									self.reload();
								}
							}
						}
						`
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
				}]
		},
		children: [
			{
				nodeType: "corehr-base",
				children: [
					{
						slot: "header",
						nodeType: "el-container",
						props: {direction: "vertical"},
						children: [
							{
								nodeType: "el-card",
								children: [
									{
										nodeType: "el-container",
										style: {margin: 0},
										children: [
											{
												nodeType: "y-pre-form",
												"v-if": "tenantList.length",
												props: {
													model: "{searchParams.current}",
													rules: {
														tenantId: {required: true}
													},
													inline: true
												},
												style: {flex: "auto"},
												children: [
													{
														nodeType: "el-form-item",
														style: {margin: 0},
														props: {prop: "tenantId"},
														children: [
															{
																nodeType: "span",
																innerHTML: "租户",
																slot: "label",
																style: {color: "#999999"}
															},
															{
																nodeType: "y-select",
																props: {
																	"v-model": "{searchParams.current.tenantId}",
																	options: "{self.tenantList}",
																	labelKey: "tenantCode",
																	valueKey: "tenantId"
																}
															}
														]
													},
													{
														nodeType: "el-form-item",
														style: {
															float: "right",
															"margin": "0"
														},
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
																innerHTML: "切换",
																on: [
																	{
																		name: "click",
																		handler: {name: "changeTenant"}
																	}]
															}]
													}]
											}]
									}]
							}
						]
					}]
			}
		]
	}
});
