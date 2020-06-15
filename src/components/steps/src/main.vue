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
	import commonMixins from "@/components/utils/mixins-common";

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
			width: 0; // GCH-1083 ie11 兼容性问题 没有按照屏幕的尺寸去展示，页面展示过大
			flex: auto;
		}

		.y-steps-steps {
			flex: none;
			$stepColor: #D6313A;

			/deep/ {
				.el-step.is-vertical {
					.is-finish, .is-process {

						&.el-step__head {
							color: white;
							border-color: $stepColor;

							.el-step__line {
								background-color: $stepColor;
							}

							.el-step__icon {
								background-color: $stepColor;
							}
						}
					}

					.is-success {
						&.el-step__title {
							color: $stepColor;

						}

						&.el-step__head {
							border-color: $stepColor;
							color: $stepColor;

							.el-step__line {
								background-color: $stepColor;
							}

						}
					}

					.el-step__line {
						top: 34px;
						bottom: 10px;
					}
				}
			}
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

