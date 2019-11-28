<template>
  <div class="y-component-list">
    <draggable
      :list="list"
      :sort="false"
      :group="{name:groupName,pull: 'clone', put: false }"
      :clone="cloneNode">
      <div
        class="y-component-list-container"
        v-for="(item,index) in list"
        :key="index">
        <label>{{ item.label }}</label>
        <y-component-list
          class="y-component-list-item"
          :list="item.children"
          :groupName="item.groupName"></y-component-list>
      </div>
    </draggable>
  </div>
</template>
<script>
	export default {
		name: "YComponentList",
		props: {
			list: {},
			groupName: {}
		},
		data() {
			return {};
		},
		created() {},
		mounted() {},
		methods: {
			cloneNode(data) {
				let result = JSON.parse(JSON.stringify(data));
				result.children = [];
				return result;
			}
		}
	};
</script>
<style
  type="text/scss"
  lang="scss"
  scoped>
  .y-component-list-container {
    margin: 0 10px;
  }
</style>
