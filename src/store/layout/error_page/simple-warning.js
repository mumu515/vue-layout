export default (msg = "") => ({
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
				nodeType: "el-card",
				style: {margin: "20px"},
				children: [
					{
						nodeType: "i",
						class: "el-icon-warning",
						style:{"font-size":"40px",color:"#D6313A"},
						innerHTML: msg
					}]
			}]
	}
});
