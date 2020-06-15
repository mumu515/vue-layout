export default () => ({
	layout: {
		nodeType: "corehr-base",
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
										innerHTML: "职级",
										style: {margin: "0 !important"}
									}]
							}]
					},
					{
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
								props: {
									label: "查询",
									name: "list"
								}
							}]
					}
				]
			}]
	}
});
