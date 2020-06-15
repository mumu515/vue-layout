export default () => ({
	key: "/corehr/personalInfo/index/edit",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		style: {padding: "20px"},
		scope: {
			data: {
				submitEvents: [],
				familyDependentPersonLength: 1000,
				detailDataWithSchema: {}
			},
			methods: [
				{
					methodName: "addFamilyPerson",
					handler: {
						body: `
						self.getFromTree("getAutoId")().then(function(response){
							self.calFamilyDependentPersonLength();
							self.getFromTree("detailData").personal[0].familyDependents.splice(self.familyDependentPersonLength,0,
							{id:response,isNew:true});
							self.calFamilyDependentPersonLength();
							console.log(self.getFromTree("detailData").personal[0].familyDependents);
						});`
					}
				},
				{
					methodName: "calFamilyDependentPersonLength",
					handler: {
						body: `
						self.familyDependentPersonLength=0;
						var num=0;
						var temp=self.getFromTree("detailData").personal[0].familyDependents;
						for(var i=0;i<temp.length;i++){
							if(!temp[i].isDeleted){
								num++;
							}
						}
						self.familyDependentPersonLength=num;`
					}
				},
				{
					methodName: "deleteFamilyPerson",
					handler: {
						args: "lastEditFamilyPersonIndex",
						body: `
						var temp=self.getFromTree("detailData").personal[0].familyDependents;
						if(temp[lastEditFamilyPersonIndex].isNew){
						temp.splice(lastEditFamilyPersonIndex,1);
						}else{
							temp[lastEditFamilyPersonIndex].isDeleted=true;
							var a=temp[lastEditFamilyPersonIndex];
							temp[lastEditFamilyPersonIndex]=temp[temp.length-1];
							temp[temp.length-1]=a;
						}
						self.calFamilyDependentPersonLength();
						`
					}
				},
				{
					methodName: "toFamilyPersonEdit",
					handler: {
						args: "lastEditFamilyPersonIndex",
						body: `
						self.$router.push({
							name: "CorehrPersonalInfoEdit_EditFamilyPerson",
							params: {personIndex: lastEditFamilyPersonIndex}
						});`
					}
				},
				{
					methodName: "tableRowClassName",
					handler: {
						args: "row,index",
						body: `
						var r="";
						if(row.isDeleted){
							r="display-none";
						}`,
						result: "r"
					}
				},
				{
					methodName: "toView",
					handler: {
						body: `self.$router.replace({name: "CorehrPersonalInfoView"});`
					}
				},
				{
					methodName: "generateDetailData",
					handler: {
						body: `
						var detailData=self.getFromTree("detailData");
						self.detailDataWithSchema.instanceId=detailData.instanceId;
						self.detailDataWithSchema.names=[];
						for(var i=0;i<detailData.names.length;i++){
							var temp=detailData.names[i];
							self.detailDataWithSchema.names.push({type:temp.type,});
						}
						self.detailDataWithSchema.biographical=[];
						for(var i=0;i<detailData.biographical.length;i++){
							var temp=detailData.biographical[i];
							self.detailDataWithSchema.biographical.push({type:temp.type,});
						}
						self.detailDataWithSchema.personRegional=[];
						for(var i=0;i<detailData.personRegional.length;i++){
							var temp=detailData.personRegional[i];
							self.detailDataWithSchema.personRegional.push({type:temp.type,});
						}
						self.detailDataWithSchema.identifiers=[];
						for(var i=0;i<detailData.identifiers.length;i++){
							var temp=detailData.identifiers[i];
							self.detailDataWithSchema.identifiers.push({type:temp.type,});
						}
						self.detailDataWithSchema.bankAccounts=[];
						for(var i=0;i<detailData.bankAccounts.length;i++){
							var temp=detailData.bankAccounts[i];
							self.detailDataWithSchema.bankAccounts.push({type:temp.type,});
						}
						self.detailDataWithSchema.addresses=[];
						for(var i=0;i<detailData.addresses.length;i++){
							var temp=detailData.addresses[i];
							self.detailDataWithSchema.addresses.push({type:temp.type,});
						}
						self.detailDataWithSchema.phones=[];
						for(var i=0;i<detailData.phones.length;i++){
							var temp=detailData.phones[i];
							self.detailDataWithSchema.phones.push({type:temp.type,});
						}
						self.detailDataWithSchema.emails=[];
						for(var i=0;i<detailData.emails.length;i++){
							var temp=detailData.emails[i];
							self.detailDataWithSchema.emails.push({type:temp.type,});
						}
						`
					}
				},
				{
					methodName: "submit",
					handler: {
						body: `
						var employeeData=JSON.parse(JSON.stringify(self.getFromTree("detailData")));
						employeeData.personal[0]={
							instanceId: employeeData.personal[0].instanceId,
							bankAccounts: employeeData.personal[0].bankAccounts,
							addresses: employeeData.personal[0].addresses,
							phones: employeeData.personal[0].phones,
							emails: employeeData.personal[0].emails,
							familyDependents: employeeData.personal[0].familyDependents,
						}
						console.log(employeeData);
						var fPs=employeeData.personal[0].familyDependents;
						var employeePerson =self.generateData(
							JSON.parse(JSON.stringify(employeeData.personal[0], function(key, val) {
								if (key === "familyDependentPerson") {
									if(!val||!val.length){
										return val;
									}
									if(val[0].instanceId){
										return [val[0].instanceId];
									}else{
										return [{PERSON_ID_UNIQUE:val[0].id}];
									}
								}
								if(key==="_links"){
									return;
								}
								return val;
							}))
						);
						var steps=[
							{
							code: "Correct_Employee_Person",
							data: [{payload: employeePerson}],
							effectiveDate: "19000101"
							}
						];
						var newFs=[],correctFs=[],deleteFs=[];
						for(var  i=0;i<fPs.length;i++){
							if(fPs[i].isDeleted){
								delete fPs[i].isDeleted;
								deleteFs.push({payload:{instanceId:{PERSON_ID_UNIQUE:fPs[i].familyDependentPerson[0].id}}});
							}else if(fPs[i].isNew){
								delete fPs[i].isNew;
								newFs.push({payload: fPs[i].familyDependentPerson[0]});
							}else{
								correctFs.push({payload: fPs[i].familyDependentPerson[0]});
							}
						}
						if(newFs.length){
							steps.push({
    	      	 code: "New_Family_Person",
    	      	 data: newFs,
    	      	 effectiveDate: "19000102"
    	      	});
						}
						if(correctFs.length){
							steps.push({
    	      	 code: "Correct_Family_Person",
    	      	 data: correctFs,
    	      	 effectiveDate: "19000102"
    	      	});
						}
						if(deleteFs.length){
							steps.push({
    	      	 code: "Delete_Family_Person",
    	      	 data: deleteFs,
    	      	 effectiveDate: "19000102"
    	      	});
						}
						console.log(fPs);
						console.log("steps",steps);
						
						self.apiRequest({
							url: "/v2.4/transaction/api",
							type: "POST",
							headers: {},
							data: {
								"transaction": {
									"code": "ESS_Change_MyEmpData",
									"steps": steps
								}
							}
						}).then(function(response) {
							if (response.bizCode === "0") {
								self.toList();
							} else {
								//self.$message({message:response.message,type:"error"});
							}
						});`
					}
				}]
		},
		children: [
			{
				nodeType: "el-breadcrumb",
				props: {"separator-class": "el-icon-arrow-right"},
				children: [
					{
						nodeType: "el-breadcrumb-item",
						props: {to: {path: "/index"}},
						children: [
							{
								nodeType: "span",
								innerHTML: "首页"
							}]
					},
					{
						nodeType: "el-breadcrumb-item",
						props: {
							replace: true,
							to: {name: "CorehrPersonalInfoView"}
						},
						children: [
							{
								nodeType: "span",
								innerHTML: "我的档案"
							}]
					},
					{
						nodeType: "el-breadcrumb-item",
						children: [
							{
								nodeType: "span",
								innerHTML: "修改我的档案"
							}]
					}
				]
			},
			{
				nodeType: "el-container",
				props: {},
				children: [
					{
						nodeType: "y-anchor",
						style: {"margin": "20px 0"},
						props: {
							anchors: [
								{
									anchorName: "location",
									title: "地址"
								},
								{
									anchorName: "mobile",
									title: "电话"
								},
								{
									anchorName: "mail",
									title: "邮箱"
								},
								{
									anchorName: "familyDependent",
									title: "家庭成员以及社会联系人"
								},
								{
									anchorName: "bank",
									title: "银行账号"
								}
							]
						},
						children: [
							{
								nodeType: "y-link-scope",
								slot: "default",
								props: {
									links: "{detailData._links}",
									linkKey: "self.personal",
									data: "{detailData.personal}"
								},
								on: [
									{
										name: "instances-completed",
										handler: {body: "detailData.personal=args[0];generateDetailData();"}
									}],
								children: [
									{
										nodeType: "el-card",
										style: {
											flex: "auto",
											"margin-left": "20px"
										},
										"v-if": "{!typeJudge.isString(detailData.personal[0])}",
										children: [
											{
												nodeType: "el-container",
												props: {direction: "vertical"},
												children: [
													{
														nodeType: "y-portal-item-header",
														attrs: {id: "anchor-location"},
														props: {
															title: "地址",
															iconClass: "location"
														},
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.personal[0].addresses"
															}],
														children: [
															{
																slot: "footer",
																nodeType: "i",
																class: "el-icon-plus",
																style: {margin: "0 20px"},
																on: [
																	{
																		name: "click",
																		handler: {body: "{detailData.personal[0].addresses.push({locale:[locale.CHN.instanceId]})}"}
																	}]
															}]
													},
													{
														nodeType: "y-list",
														style: {padding: "10px 20px 30px 20px"},
														"v-if": "{detailData.personal[0].addresses.length}",
														props: {forList: "{detailData.personal[0].addresses}"},
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
																		props: {type: "flex"},
																		style: {
																			height: "30px",
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
																						handler: {body: "{detailData.personal[0].addresses.splice(index,1)}"}
																					}]
																			}]
																	},
																	{
																		nodeType: "y-pre-form",
																		props: {
																			model: "{itemModel}",
																			labelPosition: "top",
																			span: 3,
																			maxLine: 2,
																			inline: true
																		},
																		defaultValueMap: [
																			{
																				value: "[\"\"]",
																				valueType: "Array",
																				key: "itemModel.locale"
																			},
																			{
																				value: "",
																				valueType: "String",
																				key: "itemModel.locale[0]"
																			},
																			{
																				value: "[{}]",
																				valueType: "Array",
																				key: "itemModel.addressCHN"
																			}],
																		children: [
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "类型",
																					required: true
																				},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.type"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.type}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "ADDRESS.type"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "国家地区",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.locale[0]}",
																							displayOnly: true,
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				props: {label: "省市"},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].region"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].region[0]"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].region[0]}",
																							filter: {
																								data: {
																									type: "CHN_PROVINCE"
																								},
																								params: {
																									asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {label: "城市"},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].city"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].city[0]"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].city[0]}",
																							filter: {
																								data: {
																									type: "CHN_CITY"
																								},
																								params: {
																									asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				props: {label: "地区"},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].district"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].district[0]"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].district[0]}",
																							filter: {
																								data: {type: "CHN_AREA"},
																								params: {
																									asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				props: {label: "子地区"},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.addressCHN[0].subDistrict"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].subDistrict[0]"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].subDistrict[0]}",
																							filter: {
																								data: {
																									type: "CHN_TOWN"
																								},
																								params: {
																									asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"
																								}
																							},
																							optionsPath: "REGION"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				props: {label: "地址"},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].address1"
																					}],
																				children: [
																					{
																						nodeType: "y-input",
																						type: "text",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].address1}"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				"v-if": "{!locale.CHN.instanceId||!itemModel.locale||(locale.CHN.instanceId===itemModel.locale[0])}",
																				props: {label: "邮政"},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.addressCHN[0].postal"
																					}],
																				children: [
																					{
																						nodeType: "y-input",
																						props: {
																							"v-model": "{itemModel.addressCHN[0].postal}"
																						}
																					}]
																			}]
																	}]
															}]
													},
													{
														nodeType: "y-portal-item-header",
														attrs: {id: "anchor-mobile"},
														props: {
															title: "电话",
															iconClass: "mobile"
														},
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.personal[0].phones"
															}],
														children: [
															{
																slot: "footer",
																nodeType: "i",
																class: "el-icon-plus",
																style: {margin: "0 20px"},
																on: [
																	{
																		name: "click",
																		handler: {body: "{detailData.personal[0].phones.push({})}"}
																	}]
															}]
													},
													{
														nodeType: "y-list",
														style: {padding: "10px 20px 30px 20px"},
														"v-if": "{detailData.personal[0].phones.length}",
														props: {forList: "{detailData.personal[0].phones}"},
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
																		
																		props: {type: "flex"},
																		style: {
																			height: "30px",
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
																						handler: {body: "{detailData.personal[0].phones.splice(index,1)}"}
																					}]
																			}]
																	},
																	{
																		nodeType: "y-pre-form",
																		props: {
																			model: "{itemModel}",
																			labelPosition: "top",
																			span: 3,
																			maxLine: 2,
																			inline: true
																		},
																		children: [
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "类型",
																					required: true
																				},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.type"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.type}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "PHONE.type"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "国家地区",
																					required: true
																				},
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.locale"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.locale[0]"
																					}],
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							defaultValue: "",
																							"v-model": "{itemModel.locale[0]}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {label: "国际冠码"},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.interPrefix"
																					}],
																				children: [
																					{
																						nodeType: "y-input",
																						props: {
																							"v-model": "{itemModel.interPrefix}"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {label: "长途字冠"},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.trunkPrefix"
																					}],
																				children: [
																					{
																						nodeType: "y-input",
																						props: {
																							"v-model": "{itemModel.trunkPrefix}"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "号码",
																					required: true
																				},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.phoneNumber"
																					}],
																				children: [
																					{
																						nodeType: "y-input",
																						props: {
																							"v-model": "{itemModel.phoneNumber}"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {label: "分机"},
																				defaultValueMap: [
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.extension"
																					}],
																				children: [
																					{
																						nodeType: "y-input",
																						props: {
																							"v-model": "{itemModel.extension}"
																						}
																					}]
																			}]
																	}
																]
															}]
													},
													{
														nodeType: "y-portal-item-header",
														attrs: {id: "anchor-mail"},
														props: {
															title: "邮箱",
															iconClass: "mail"
														},
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.personal[0].emails"
															}],
														children: [
															{
																slot: "footer",
																nodeType: "i",
																class: "el-icon-plus",
																style: {margin: "0 20px"},
																on: [
																	{
																		name: "click",
																		handler: {body: "{detailData.personal[0].emails.push({})}"}
																	}]
															}]
													},
													{
														nodeType: "y-list",
														style: {padding: "10px 20px 30px 20px"},
														"v-if": "{detailData.personal[0].emails.length}",
														props: {forList: "{detailData.personal[0].emails}"},
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
																		
																		props: {type: "flex"},
																		style: {
																			height: "30px",
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
																						handler: {body: "{detailData.personal[0].emails.splice(index,1)}"}
																					}]
																			}]
																	},
																	{
																		nodeType: "y-pre-form",
																		props: {
																			model: "{itemModel}",
																			labelPosition: "top",
																			span: 3,
																			maxLine: 2,
																			inline: true
																		},
																		children: [
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "类型",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						props: {
																							"v-model": "{itemModel.type}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "EMAIL.type"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "邮箱",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.email"
																							}],
																						props: {
																							"v-model": "{itemModel.email}"
																						}
																					}]
																			}]
																	}]
															}]
													},
													{
														nodeType: "y-portal-item-header",
														attrs: {id: "anchor-familyDependent"},
														props: {
															title: "家庭成员以及社会关系",
															iconClass: "family-dependent"
														},
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.personal[0].familyDependents"
															}],
														children: [
															{
																slot: "footer",
																nodeType: "i",
																class: "el-icon-plus",
																style: {margin: "0 20px"},
																on: [
																	{
																		name: "click",
																		handler: {name: "addFamilyPerson"}
																	}]
															}]
													},
													{
														nodeType: "el-table",
														style: {
															margin: "0 40px",
															width: "auto",
															size: "mini",
															"row-class-name": "{tableRowClassName}"
														},
														props: {data: "{detailData.personal[0].familyDependents.slice(0,familyDependentPersonLength)}"},
														children: [
															{
																nodeType: "el-table-column",
																props: {label: "关系"},
																scopedSlots: [
																	{
																		name: "default",
																		scopeMapping: {
																			row: "row",
																			index: "$index"
																		},
																		nodes: [
																			{
																				
																				nodeType: "y-select",
																				props: {
																					"v-model": "{row.relationship}",
																					filter: {params: {asOfDate: "{asOfDate}"}},
																					optionsPath: "FAMILY_DEPENDENT.relationship"
																				}
																			}]
																	}]
															},
															{
																nodeType: "el-table-column",
																props: {label: "家庭成员以及社会关系人"},
																scopedSlots: [
																	{
																		name: "default",
																		scopeMapping: {
																			row: "row",
																			index: "$index"
																		},
																		nodes: [
																			{
																				nodeType: "y-link-scope",
																				slot: "default",
																				props: {
																					links: "{detailData.personal[0]._links}",
																					linkKey: "self.familyDependents.familyDependentPerson",
																					data: "{row.familyDependentPerson}"
																				},
																				on: [
																					{
																						name: "instances-completed",
																						handler: {body: "row.familyDependentPerson=args[0];"}
																					}],
																				children: [
																					{
																						
																						nodeType: "y-select",
																						defaultValueMap: [
																							{
																								value: "[{}]",
																								valueType: "Array",
																								key: "row.familyDependentPerson"
																							},
																							{
																								value: "{}",
																								valueType: "Object",
																								key: "row.familyDependentPerson[0]"
																							}],
																						props: {
																							"labelKey": "$.names[?((@.locale[0]==\"{locale.CHN.instanceId}\"||@.locale[0].code==\"CHN\")&&@.type==\"PREFERRED\")].nameCHN[0].displayName",
																							"v-model": "{row.familyDependentPerson[0]}",
																							displayOnly: "true"
																						}
																					}]
																			}
																		]
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
																		scopeMapping: {
																			row: "row",
																			index: "$index"
																		},
																		nodes: [
																			{
																				nodeType: "el-button",
																				innerHTML: "编辑",
																				props: {type: "text"},
																				style: {color: "#189CFF"},
																				on: [
																					{
																						name: "click",
																						handler: {
																							name: "toFamilyPersonEdit",
																							args: "{index}"
																						}
																					}]
																				
																			},
																			{
																				nodeType: "el-button",
																				innerHTML: "删除",
																				props: {type: "text"},
																				style: {color: "#189CFF"},
																				on: [
																					{
																						name: "click",
																						handler: {
																							name: "deleteFamilyPerson",
																							args: "{index}"
																						}
																					}]
																			}
																		]
																	}]
															}
														]
													},
													{
														nodeType: "y-portal-item-header",
														attrs: {id: "anchor-bank"},
														props: {
															title: "银行账号",
															iconClass: "bank-card"
														},
														defaultValueMap: [
															{
																value: "[]",
																valueType: "Array",
																key: "detailData.personal[0].bankAccounts"
															}],
														children: [
															{
																slot: "footer",
																nodeType: "i",
																class: "el-icon-plus",
																style: {margin: "0 20px"},
																on: [
																	{
																		name: "click",
																		handler: {body: "{detailData.personal[0].bankAccounts.push({locale:[''],bank:[''],bankBranch:['']})}"}
																	}]
															}]
													},
													{
														nodeType: "y-list",
														"v-if": "{detailData.personal[0].bankAccounts.length}",
														style: {padding: "10px 20px 30px 20px"},
														props: {forList: "{detailData.personal[0].bankAccounts}"},
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
																		props: {type: "flex"},
																		style: {
																			height: "30px",
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
																						handler: {body: "{detailData.personal[0].bankAccounts.splice(index,1)}"}
																					}]
																			}]
																	},
																	{
																		nodeType: "y-pre-form",
																		props: {
																			model: "{itemModel}",
																			labelPosition: "top",
																			span: 3,
																			maxLine: 2,
																			inline: true
																		},
																		children: [
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "国家地区",
																					required: true,
																					defaultValueMap: [
																						{
																							value: "[\"\"]",
																							valueType: "Array",
																							key: "itemModel.locale"
																						},
																						{
																							value: "",
																							valueType: "String",
																							key: "itemModel.locale[0]"
																						}]
																				},
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.locale[0]}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "LOCALE"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "类型",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-select",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.type"
																							}],
																						props: {
																							"v-model": "{itemModel.type}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "BANK_ACCOUNT.type"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.bank"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.bank[0]"
																					}],
																				props: {
																					label: "银行",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.bank[0]}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "BANK"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				defaultValueMap: [
																					{
																						value: "[\"\"]",
																						valueType: "Array",
																						key: "itemModel.bankBranch"
																					},
																					{
																						value: "",
																						valueType: "String",
																						key: "itemModel.bankBranch[0]"
																					}],
																				props: {
																					label: "支行"
																				},
																				children: [
																					{
																						nodeType: "y-select",
																						props: {
																							"v-model": "{itemModel.bankBranch[0]}",
																							filter: {params: {asOfDate: "{employeeData.workRelationships[0].hireDate.replace(/-/g,\"\")}"}},
																							optionsPath: "BANK_BRANCH"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "账户名",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.accountName"
																							}],
																						props: {
																							"v-model": "{itemModel.accountName}"
																						}
																					}]
																			},
																			{
																				nodeType: "el-form-item",
																				props: {
																					label: "账户",
																					required: true
																				},
																				children: [
																					{
																						nodeType: "y-input",
																						defaultValueMap: [
																							{
																								value: "",
																								valueType: "String",
																								key: "itemModel.accountNumber"
																							}],
																						props: {
																							"v-model": "{itemModel.accountNumber}"
																						}
																					}]
																			}]
																	}]
															}]
													},
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
																		innerHTML: "取消",
																		on: [
																			{
																				name: "click",
																				handler: {name: "toView"}
																			}]
																	},
																	{
																		nodeType: "el-button",
																		props: {
																			size: "mini",
																			type: "primary"
																		},
																		innerHTML: "保存",
																		on: [
																			{
																				name: "click",
																				handler: {name: "submit"}
																			}]
																	}]
															}]
													}
												]
											}
										]
									}]
							}
						]
					}
				]
			}]
	}
})
