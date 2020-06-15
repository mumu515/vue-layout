<template>
  <el-tabs
    :class="directionClass"
    @tab-click="tabClick"
    class="y-tabs"
    ref="tabs"
    v-bind="_props"
  >
    <slot></slot>
  </el-tabs>
</template>
<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/utils/mixins-common";

	export default {
		name: "YTabs",
		mixins: [commonMixins],
		props: [
			"type", //	风格类型	string	card/border-card	—
			"closable", //	标签是否可关闭	boolean	—	false
			"addable", //	标签是否可增加	boolean	—	false
			"editable", //	标签是否同时可增加和关闭	boolean	—	false
			"value", //	绑定值，选中选项卡的 name	string	—	第一个选项卡的 name
			"tab-position" //	选项卡所在位置	string	top/right/bottom/left	top
		],
		data() {
			return {directionClass: "direction-next"};
		},
		mounted() {
			this.$watch(() => {
				return this.$refs.tabs.currentName;
			}, {
				handler(n, o) {
					// console.log(o);
					// console.log(n);
					this.directionClass = n > o ? "direction-next" : "direction-pre";
				},
				immediate: true
			});
		},
		methods: {
			tabClick(selected) {
				// console.log(selected);
				// console.log(this.$refs.tabs.currentName);
			}
		}
	};
</script>
<style
  lang="scss"
  scoped
  type="text/scss">
  .y-tabs {
    &.el-tabs.el-tabs--right {
      /deep/ .el-tabs__header.is-right {
        width: 150px;
        position: absolute;
        right: 0;
      }

      /deep/ .el-tabs__content {
        .el-tab-pane {
          margin-right: 150px;
        }
      }
    }
  }
</style>

