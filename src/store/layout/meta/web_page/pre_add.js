export default () => ({
	path: "/corehr/WEB_PAGE/index/pre_add",
	layout: {
		nodeType: "el-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				pageList: []
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `
						self.pageList=self.$store.state.corehr.layout.layoutCodes`
					}
				},
				{
					methodName: "itemClick",
					handler: {
						args: "templateName",
						body: `
						var result=[];
							for(var i=0;i<self.pageList.length;i++){
								result.push({
            		 	id:self.pageList[i],
            		 	externalId:self.pageList[i],
            		 	node:self.$store.getters["corehr/layout/template"](self.pageList[i]).getTemplate().layout,
            		});
							}
							console.log(JSON.stringify({data:result}));
							console.log(self.pageList);
							self.apiRequest({url: "/layout/LAYOUT_PAGE",type: "POST",headers: {},params: {},
								data:{
            		 	id:templateName,
            		 	externalId:templateName,
            		 	node:self.$store.getters["corehr/layout/template"](templateName).getTemplate().layout,
            		}}).then(function(response){
            	 		if(response.bizCode==="0"){
            	    	self.toList();
            	    }
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
										innerHTML: "预置新增",
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
								props: {header: "界面"},
								children: [
									{
										"nodeType": "y-list",
										"props": {
											"forList": "{pageList}",
											tag: {name: "el-row"},
											itemTag: {
												name: "el-col",
												props: {span: 6}
											}
										},
										"scopedSlots": [
											{
												"name": "default",
												"nodes": [
													{
														nodeType: "y-button",
														innerHTML: "{item}",
														style: {margin: "10px 20px"},
														on: [
															{
																name: "click",
																handler: {
																	name: "itemClick",
																	args: "{item}"
																}
															}]
													}],
												"scopeMapping": {"item": "item"}
											}]
									}]
							}
						]
					}
				]
			}]
	}
})
