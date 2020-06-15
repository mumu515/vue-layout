<template>
  <el-container :direction="containerDirection">
    <el-carousel
      class="y-carousel"
      ref="carousel"
      v-bind="_props">
      <slot></slot>
    </el-carousel>
    <slot
      name="actions"
      :carousel="getCarousel()"></slot>
  </el-container>
</template>
<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/utils/mixins-common";

	export default {
		name: "YCarousel",
		mixins: [commonMixins],
		props: [
			"containerDirection",
			"height", //	走马灯的高度	string	—	—
			"initial-index",//	初始状态激活的幻灯片的索引，从 0 开始	number	—	0
			"trigger",//	指示器的触发方式	string	click	—
			"autoplay",//	是否自动切换	boolean	—	true
			"interval",//	自动切换的时间间隔，单位为毫秒	number	—	3000
			"indicator-position",//	指示器的位置	string	outside/none	—
			"arrow",//	切换箭头的显示时机	string	always/hover/never	hover
			"type"//	走马灯的类型	string	card	—
		],
		data() {
			return {};
		},
		mounted() {
		},
		methods: {
			getCarousel() {
				let carousel = this.$refs.carousel;
				if (carousel) {
					return {
						prev: carousel.prev,
						next: carousel.next,
						setActiveItem: carousel.setActiveItem
					};
				} else {
					return {};
				}
			}
		}
	};
</script>
<style
  lang="scss"
  scoped
  type="text/scss">
  .y-carousel-no-animate {
    .y-carousel {
      /deep/ .el-carousel__item.is-animating {
        transition: transform 0s;
      }
    }
  }
</style>

