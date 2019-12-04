<script type="text/babel">
	export default {
		name: "YPreForm",
		inheritAttrs: false,
		props: {
			isShowReset: false,
			items: {
				type: Array,
				default: () => []
			}, // {label,prop,displayType,displayOnly,valueKey, optionsPath,remote,filterable
				 //,value-format}
			model: {
				type: Object,
				default: () => ({})
			},
			rules: {type: Object},
			displayOnly: {type: Boolean},
			inline: {
				type: Boolean,
				default: false
			},
			labelPosition: {
				type: String,
				default: "left"
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
			return {isShowAllItems: this.defaultItemCount === 0};
		},
		computed: {
			defaultItemCount() {
				if (this.maxLine === 0) {
					return this.items.length;
				}
				if (!this.inline) {
					return this.maxLine;
				}
				if (this.span !== 0) {
					return this.maxLine * this.span;
				}
				return 0;
			}
		},
		inject: {
			parent: {
				from: "scope",
				default: () => ({})
			}
		},
		// mounted() {
		// 	console.log(this);
		// },
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
			},
			reset() {
				console.log("reset");
				this.$refs.preForm.resetFields();
			}
		},
		render(creatElement) {

			const createItemContentNode = (item) => {
				switch (item.type) {
					case "text":
						return <y-input {...{props: item.itemProps}}></y-input>;
					case "number":
						return <y-input-number {...{props: item.itemProps}}></y-input-number>;
					case "select":
						return <y-select {...{props: item.itemProps}}></y-select>;
					case "date":
						return <y-date-picker {...{props: item.itemProps}}></y-date-picker>;
				}
			};
			const createNode = () => {
				return <el-form
						ref="preForm"
						rules={this.rules}
						model={this.model}
						inline={this.inline}
						size="mini"
						class={`span-${this.span || "default"}`}
						label-position={this.labelPosition}
						label-width={this.hideLabel ? "" : "140px"}>{
					this.items.map((item, index) => {
						return <el-form-item
								style={this.isShowItem(index) ? {} : {display: "none"}}
								{...{
									props: {
										...item.props,
										prop: item.props.prop || item.itemProps.prop
									}
								}}>{createItemContentNode(item)}</el-form-item>;
					})
				}
					{this.$slots.default}
					{this.isShowReset ? <el-button onClick={this.reset}><i className="el-icon-arrow-right"></i></el-button> : undefined}
					{
						this.defaultItemCount && this.defaultItemCount !== this.items.length ?
								<el-container class="action-group">{this.isShowAllItems ?
										<el-button onClick={this.changeShowItems}>收起</el-button> :
										<el-button onClick={this.changeShowItems}>展开</el-button>}</el-container> :
								undefined
					}
				</el-form>;
			};
			return createNode();

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
        &.el-form--label-top /deep/ {
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
        }

        .el-container.action-group {
          justify-content: flex-end;
          @include padding;
        }

        .el-form-item {
          width: 100%/$span;
          margin-right: 0;
        }
      }
    }
  }

  /*.el-form-item:last-child {*/
  /*  margin-bottom: 0;*/
  /*}*/
</style>

