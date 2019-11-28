<template>
  <el-container
    class="y-steps"
    ref="steps">
    <template v-if="stepPosition==='right'">
      <el-container class="y-steps--right">
        <div class="y-steps-content">
          <slot></slot>
        </div>
        <div class="y-steps-steps">
          <slot name="steps"></slot>
        </div>
      </el-container>
    </template>
    <template v-else>
      <slot></slot>
      <slot name="steps"></slot>
    </template>
  </el-container>
</template>
<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/mixins-common";

	export default {
		name: "YSteps",
		mixins: [commonMixins],
		props: [
			"direction",
			"stepPosition"
		],
		data() {
			return {};
		},
		mounted() {

		},
		methods: {}
	};
</script>
<style
  lang="scss"
  scoped
  type="text/scss">
  .y-steps {
    .y-steps-content {
      flex: auto;
    }

    .y-steps-steps {
      flex: none
    }

    .y-steps--right {
      .y-steps-steps {
        /deep/ .el-steps {
          width: 300px;
          padding: 50px 40px;
        }
      }
    }
  }
</style>

