export default () => ({
	layout: {
		nodeType: "corehr-base",
		class: "corehr-main-container",
		props: {direction: "vertical"},
		scope: {
			data: {},
			methods: []
		},
		children: [
			
			{
				nodeType: "el-container",
				props: {direction: "vertical"},
				children: [
					{
						nodeType: "i",
						class: "no-permission",
						style: {
							width: "360px",
							height: "360px",
							display: "block",
							margin: "auto",
							"margin-top": "135px",
							"margin-bottom": "30px"
						}
					},
					{
						nodeType: "span",
						innerHTML: "没有权限访问",
						style: {
							"text-align": "center"
						}
					}]
			}
		
		]
	}
});
