<!--<template>-->
<!--	<div>-->
<!--		<div-->
<!--				class="list-item"-->
<!--				v-for="(item,index) in forList">-->
<!--			<slot-->
<!--					:index="index"-->
<!--					:item="item"-->
<!--					:list="forList"></slot>-->
<!--		</div>-->
<!--	</div>-->
<!--</template>-->
<script type="text/babel">
	export default {
		name: "YList",
		inheritAttrs: false,
		props: {
			tag: {
				type: Object,
				default: () => ({name: "div"})
			},
			itemTag: {
				type: Object,
				default: () => ({name: "div"})
			},
			forList: {
				type: Array,
				default: () => []
			}
		},
		render(h) {
			return h(this.tag.name, {...this.tag},//这里不可以直接使用this.tag, 否则会因为observe原因导致不断重绘
					this.forList.map((item, index) => {
						return h(this.itemTag.name,
								{
									key: index,
									class: this.itemTag.class || "list-item",
									...this.itemTag
								},
								[
									this.$scopedSlots.default({
										index: index,
										item: item,
										list: this.forList
									})]);
					}));
		}
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

