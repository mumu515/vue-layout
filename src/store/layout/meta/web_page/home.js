export default () => ({
	path: "/corehr/WEB_PAGE/index",
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
              self.$router.push({name:"CorehrMetaObjectLayout",params: {pageType: tab.name}});`
					}
				}]
		},
		children: [
			{
				nodeType: "CorehrBase",
				children: [
					{
						slot: "header",
						nodeType: "el-container",
						props: {direction: "vertical"},
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
												innerHTML: "界面管理",
												style: {margin: "0 !important"}
											}]
									}]
							}, {
								nodeType: "el-tabs",
								class: "tab-page",
								props: {value: "{currentTab}"},
								on: [
									{
										name: "tab-click",
										handler: {name: "clickTab"}
									}],
								children: [
									{
										nodeType: "el-tab-pane",
										"v-if": false,
										props: {
											label: "新增",
											name: "add"
										}
									},
									{
										nodeType: "el-tab-pane",
										"v-if": false,
										props: {
											label: "预置新增",
											name: "pre_add"
										}
									},
									{
										nodeType: "el-tab-pane",
										"v-if": false,
										props: {
											label: "预置更新",
											name: "pre_update"
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
