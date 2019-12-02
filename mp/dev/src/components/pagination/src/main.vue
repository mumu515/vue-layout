<script>
	import commonMixins from "@/components/mixins-common";

	export default {
		name: "YPagination",
		inject: ["grid"],
		mixins: [commonMixins],
		inheritAttrs: false,
		props: [
			"small", //	是否使用小型分页样式	Boolean	—	false
			"background", //	是否为分页按钮添加背景色	Boolean	—	false
			"page-size", //	每页显示条目个数	Number	—	10
			"total", //	总条目数	Number	—	—
			"page-count", //	总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性	Number	—	—
			"current-page", //	当前页数，支持 .sync 修饰符	Number	—	1
			"layout", //	组件布局，子组件名用逗号分隔	String	sizes, prev, pager, next, jumper, ->, total, slot	'prev, pager, next, jumper, ->, total'
			"page-sizes", //	每页显示个数选择器的选项设置	Number[]	—	[10, 20, 30, 40, 50, 100]
			"popper-class", //	每页显示个数选择器的下拉框类名	string	—	—
			"prev-text", //	替代图标显示的上一页文字	string	—	—
			"next-text" //	替代图标显示的下一页文字	string	—	—
		],
		render(h) {
			return <el-pagination
					class={this.$attrs.class}
					style={this.$attrs.style}
					{...{props: this._props}}
					{...{attrs: this.attrs}}
					{...{
						on: {
							"size-change": this.handleSizeChange,
							"current-change": this.handleCurrentChange
						}
					}}
			></el-pagination>;
		},
		methods: {
			handleCurrentChange(currentPage) {
				this.grid.handleAction(this.$attrs["current-change"], currentPage);
			},
			handleSizeChange(size) {
				this.grid.handleAction(this.$attrs["size-change"], size);
			}
		}
	};
</script>
<style
  lang="scss"
  scoped>
</style>
