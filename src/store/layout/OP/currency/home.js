export default () => ({
	path: "/corehr/CURRENCY/index",
	layout: {
		nodeType: "el-container",
		class: "corehr-main-container",
		props: {direction: "vertical"},
		scope: {
			data: {
				currentTab: "-1"
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `self.currentTab=self.$route.params.pageType`
					}
				},
				{
					methodName: "clickTab",
					handler: {
						args: "tab",
						body: `
              console.log(tab);
              self.$router.push({name:"OPCorehrMetaObjectLayout",params: {pageType: tab.name}});`
					}
				}]
		},
		children: [
			{
				nodeType: "CorehrBase",
				children: [
					{
						nodeType: "el-container",
						props: {direction: "vertical"},
						children: [
							{
								nodeType: "el-tabs",class: "tab-page",
								props: {value: "{currentTab}"},
								on: [
									{
										name: "tab-click",
										handler: {name: "clickTab"}
									}],
								children: [
									{
										nodeType: "el-tab-pane",
										props: {
											label: "新增",
											name: "add"
										}
									},
									{
										nodeType: "el-tab-pane",
										props: {
											label: "查询",
											name: "list"
										}
									}]
							}
						]
					}]
			}
		]
	}
});
