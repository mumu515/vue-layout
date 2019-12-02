<template>
  <draggable
    class="container-node"
    :list="nodes"
    :group="groupName||'main'">
    <el-container
      v-for="(node,index) in nodes"
      :key="index"
      direction="vertical">
      <div
        @click="itemClick(node)"
        class="y-layout-item-label">
        {{node.label}}
        <el-button
          type="text"
          class="el-icon-close"
          @click="nodes.splice(index,1)"></el-button>
      </div>
      <y-layout-item
        v-if="node.groupName"
        :nodes="node.children"
        :groupName="node.groupName"
        @itemClick="itemClick"></y-layout-item>
    </el-container>
  </draggable>
</template>
<script>
	export default {
		name: "YLayoutItem",
		props: {
			nodes: {},
			groupName: {}
		},
		data() {
			return {};
		},
		created() {},
		mounted() {
		},
		methods: {
			itemClick(item) {
				this.$emit("itemClick", item);
			}
		}
	};
</script>
<style
  type="text/scss"
  lang="scss"
  scoped>
  .y-layout-item {
    cursor: pointer;
  }

  .container-node {
    border: 1px solid #AAAAAA;
    padding: 10px;
    min-height: 100px;
  }

  .y-layout-item-label {
    cursor: pointer;
  }
</style>
