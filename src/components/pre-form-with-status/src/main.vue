<script type="text/babel">
	import {setValue} from "@/components/node/page/layoutUtils";
	import NodeUtils from "@/components/node/page/NodeUtils";
/*
* form-item的prop不要放类似于a[0]形式,否则在reset执行过程中还会无法触发fieldValue的重新计算,导致重置按钮显示状态异常
*
* */
	export default {
		name: "YPreFormWithStatus",
		inheritAttrs: false,
		props: {
			formConfig: {
				type: Object,
				default: () => ({})
			},
			initialEditStatus: {
				type: Boolean,
				default: false
			}
		},
		provide() {
			return {};
		},
		inject: {
			pageNode: {
				from: "pageNode",
				default: () => ({})
			}
		},
		data() {
			return {
				currentEditStatus: !!this.initialEditStatus,
				currentResetStatus: false
			};
		},
		computed: {},
		methods: {
			isShowReset() {
				let form = (this.$refs.preForm || {}).form || {};
				let result = false;
				result = (form.fields || []).reduce((r, field) => {
					return r || !deepEquals(field.initialValue, field.fieldValue);
				}, false);
				if (this.currentResetStatus !== result) {
					this.$emit("reset-status-change", result);
				}
				this.currentResetStatus = result;
				return this.currentResetStatus;
			},
			reset() {
				try { (this.$refs.preForm || {}).reset();} catch (e) { }
				this.currentEditStatus = !!this.initialEditStatus;
				// this.$nextTick(() => {
					// this.pageNode.$forceUpdate();
				// });
			},
			saveStatus() {
				this.currentEditStatus = !this.currentEditStatus;

			},
			editForm() {
				this.currentEditStatus = !this.currentEditStatus;

			}

		},
		mounted() {
		},

		render(h) {
			return <el-container style="align-items: flex-start">
				<y-pre-form
						ref="preForm"
						style="flex:auto"
						{...{
							props: {
								...this.formConfig,
								displayOnly: !this.currentEditStatus
							}
						}}>
					{this.$slots.default}
				</y-pre-form>
				{this.currentEditStatus ?
						<el-button
								style="float:right"
								onClick={this.saveStatus}
								size="mini"
								type="text"><i class="el-icon-saveedit"></i></el-button> :
						<el-button
								style="float:right"
								onClick={this.editForm}
								size="mini"
								type="text"><i class="el-icon-save"></i></el-button>}
				{this.isShowReset() ? <el-button
						style="float:right"
						onClick={this.reset}
						size="mini"
						type="text"><i class="el-icon-reset"></i></el-button> : ""}
			</el-container>;
		}
	};
</script>
<style
		lang="scss"
		scoped
		type="text/scss">
	@mixin padding {
		padding: 0 20px !important;
	}

	@each $span in 2, 3 {
		.el-form--inline {
			&.span-#{$span} {
				/*&.el-form--label-top*/
				/deep/ {
					.el-form-item__label {
						@include padding;
					}

					.el-form-item__content {
						@include padding;

					}

					.el-form-item__content {
						> * {
							width: 100%;
						}
					}

					> .el-form-item {
						width: 100%/$span;
						margin-right: 0;
					}
				}

				.el-container.action-group {
					justify-content: flex-end;
					@include padding;
				}

			}
		}
	}

	/*.el-form-item:last-child {*/
	/*  margin-bottom: 0;*/
	/*}*/
</style>

