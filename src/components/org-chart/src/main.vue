<template>
  <section ref="rootNode"></section>
</template>
<script>
	export default {
		name: "YOrgChart",
		props: {
			config: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				orgChart: {},
				chartConfig: this.config
			};
		},
		created() {},
		mounted() {
			console.log(this);
			this.generateChart();
		},
		methods: {
			generateChart() {
				this.orgChart = new this._OrgChart(this.$refs.rootNode, this.chartConfig);
				this.orgChart.on("click", this.clickHandler);
			},
			clickHandler(sender, node) {
				// your code goes here
				// return false; to cancel the operation
				console.log(sender, node);
				if (this.childCount(node.id) === 0) {
					sender.add({
						id: node.id + "-1",
						pid: node.id,
						name: node.id + "-1"
					});
					sender.add({
						id: node.id + "-2",
						pid: node.id,
						name: node.id + "-2"
					});
					sender.draw();
				}
				if (sender.nodes[node.id].collapsedChildrenIds.length > 0) {
					sender.expand(node.id, Object.keys(sender.nodes).filter((id) => {
						return sender.nodes[id].pid === node.id;
					}));
				}
				return false;
			},
			childCount(id) {
				let count = 0;
				for (var i = 0; i < this.orgChart.config.nodes.length; i++) {
					if (this.orgChart.config.nodes[i].pid === id) {
						count++;
						count += this.childCount(this.orgChart.config.nodes[i].id);
					}
				}

				return count;
			}
		}
	};
</script>
<style
  lang="scss"
  scoped
  type="text/scss">
</style>
