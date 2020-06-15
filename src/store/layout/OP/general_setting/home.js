export default () => ({
	path: "/corehr/GENERAL_SETTING/index",
	layout: {
		nodeType: "el-container",
		class: "corehr-main-container",
		props: {direction: "vertical"},
		scope: {
			data: {},
			methods: []
		},
		children: [
			{
				nodeType: "CorehrBase",
				children: []
			}
		]
	}
});
