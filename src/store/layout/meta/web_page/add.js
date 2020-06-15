export default () => ({
	path: "/corehr/WEB_PAGE/index/add",
	layout: {
		nodeType: "el-container",
		
		props: {direction: "vertical"},
		scope: {
			data: {
				currentData: {}
			},
			methods: [
				{
					methodName: "init",
					handler: {body: ``}
				},
				{
					methodName: "submit",
					handler: {body: `
						var node='';
						try{
							eval('node='+self.currentData.node);
							self.apiRequest({url: "/layout/LAYOUT_PAGE",type: "POST",
            	 	headers: {},params: {},data:{
            	 		id:self.currentData.id,
            	 		externalId:self.currentData.externalId,
            	 		node:node,
            	 	}}).then(function(response){
            	 		if(response.bizCode==="0"){
            	    	self.toList();
            	    }
             	});
						}catch(e){
							self.$message('node不合规')
						}`}
				},
				{
					methodName: "toList",
					handler: {body: `self.$router.replace({name:"CorehrMetaObjectLayout",params: {pageType: "list"}});`}
				}]
		},
		children: [
			{
				nodeType: "el-row",
				children: [
					{
						nodeType: "el-col",
						props: {
							tag: "div",
							span: 24
						},
						children: [
							{
								nodeType: "el-container",
								class: "header-part page-header",
								style: {"align-items": "center"},
								children: [
									{
										nodeType: "i",
										"v-if": false,
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
										innerHTML: "新增界面",
										style: {flex: "auto"}
									}
								]
							}]
					}]
			},
			{
				nodeType: "el-scrollbar",
				children: [
					{
						nodeType: "el-container",
						style: {"margin-bottom": "20px"},
						props: {direction: "vertical"},
						children: [
							{
								nodeType: "el-card",
								style: {margin: "20px 20px 0 20px"},
								props: {
									header: "界面",
									"body-style": {"padding": "0"}
								},
								children: [
									{
										nodeType: "y-pre-form",
										style: {margin: "20px 40px"},
										props: {model: "{detailData}"},
										children: [
											{
												nodeType: "el-form-item",
												props: {label: "ID"},
												children: [
													{
														nodeType: "y-input",
														props: {"v-model": "{currentData.id}"}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "ExternalId"},
												children: [
													{
														nodeType: "y-input",
														props: {"v-model": "{currentData.externalId}"}
													}]
											},
											{
												nodeType: "el-form-item",
												props: {label: "Node"},
												children: [
													{
														nodeType: "y-input",
														props: {
															"v-model": "{currentData.node}",
															type: "textarea",
															autosize: {minRows: 4}
														}
													}]
											}
										
										]
									}]
							}
						]
					}
				]
			},
			
			{
				nodeType: "el-row",
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
														props: {
															size: "mini",
															type: "primary"/* "formSubmit": true*/
														},
														innerHTML: "提交保存",
														on: [
															{
																name: "click",
																handler: {name: "submit"}
															}]
													},
													{
														nodeType: "el-button",
														props: {size: "mini"},
														innerHTML: "取消",
														on: [
															{
																name: "click",
																handler: {name: "toList"}
															}]
													}]
											}]
									}]
							}]
					}]
			}
		]
	}
})
