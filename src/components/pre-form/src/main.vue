<script type="text/babel">
	export default {
		name: "YPreForm",
		inheritAttrs: false,
		props: {
			model: {
				type: Object,
				default: () => ({})
			},
			rules: {type: Object},
			displayOnly: {},
			inline: {
				type: Boolean,
				default: false
			},
			labelPosition: {
				type: String,
				default: "left"
			},
			labelWidth: {
				type: String,
				default: "140px"
			},
			hideLabel: {
				type: Boolean,
				default: false
			},
			span: {
				type: Number,
				default: 0
			},
			maxLine: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				isShowAllItems: false
			};
		},
		computed: {
			defaultItemCount() {
				if (this.maxLine === 0) {
					return (this.$slots.default || []).length;
				}
				if (!this.inline) {
					return this.maxLine;
				}
				if (this.span !== 0) {
					return this.maxLine * this.span;
				}
				return 0;
			},
			form() {
				return this.$refs.mFrom || {};
			}
		},
		created() {
			// console.log("created");
			// console.log(this);
		},
		mounted() {
			// console.log("mounted");
			// console.log(this);
			this.isShowAllItems = this.defaultItemCount === 0;
		},
		methods: {
			isShowItem(itemIndex) {
				if (this.defaultItemCount === 0) {
					return true;
				}
				if (this.isShowAllItems) {
					return true;
				}
				return this.defaultItemCount > itemIndex;
			},
			changeShowItems() {
				this.isShowAllItems = !this.isShowAllItems;
				this.$emit("eventEmit", "changeHandler", {isShowAllItems: this.isShowAllItems});
			},
			reset() {
				try { this.form.resetFields();} catch (e) { }

			}
		},
		watch: {
			rules: function(n, o) {
				if (!deepEquals(n, o)) {
					console.log("rules changes");
					console.log(n);
					console.log(o);

					this.$nextTick(() => {
						this.form.validate(() => {});
					});
				}
			}
		},
		render(h) {
			//					validate-on-rule-change={false}
			return <el-form
					ref="mFrom"
					rules={this.rules}
					model={this.model}
					inline={this.inline}
					displayOnly={this.displayOnly}
					validate-on-rule-change={false}
					size="mini"
					class={`span-${this.span || "default"}`}
					label-position={this.labelPosition}
					label-width={this.hideLabel ? "" : this.labelWidth}>
				{(this.$slots.default || []).map((item, index) => {
					if (this.isShowItem(index)) {
						return item;
					} else {
						return <el-form-item style={{display: "none"}}>{item}</el-form-item>;
					}
				})}
				<el-container
						class="action-group"
						style={(this.defaultItemCount && this.defaultItemCount < (this.$slots.default || []).length) ? {} : {display: "none !important"}}>
					<el-button onClick={this.changeShowItems}>{this.isShowAllItems ? "收起" : "展开"}</el-button>
				</el-container>
			</el-form>;
		}
	};
</script>
<style
		lang="scss"
		scoped
		type="text/scss">

	@mixin padding020 {
		padding: 0 20px !important;
	}

	@each $spanSize in 2, 3, 4, 5 {
		.el-form--inline {
			&.span-#{$spanSize} {
				/deep/ {
					.el-form-item__label, .el-form-item__content, .el-form-item__error {
						@include padding020;

					}

					.el-form-item__content {
						> * {
							width: 100%;
						}
					}

					> .el-form-item {
						width: 100%/$spanSize;
						margin-right: 0;
					}
				}

				.el-container.action-group {
					justify-content: flex-end;
					@include padding020;
				}

			}
		}
	}

	/*.el-form-item:last-child {*/
	/*  margin-bottom: 0;*/
	/*}*/
</style>

