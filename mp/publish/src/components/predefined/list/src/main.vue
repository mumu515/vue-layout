<template>
  <div>
    <div
      class="list-item"
      v-for="(item,index) in forList">
      <slot
        :index="index"
        :item="item"
        :list="forList"></slot>
    </div>
  </div>
</template>
<script type="text/babel">
	export default {
		name: "YList",
		inheritAttrs: false,
		props: {
			forList: {
				type: Array,
				default: () => []
			}
		}
		// data() {return {test: {}};}
	};
</script>
<style
  lang="scss"
  scoped
  type="text/scss">
  .list-item {
    border-bottom: 1px solid #EEEEEE;

    &:last-child {
      border-bottom: 0;
    }
  }
</style>

