<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/utils/mixins-common";

	let functionalPicker = {
		name: "YFunctionalPicker",
		functional: true,
		render: function(h, context) {
			// console.log(context);
			if (context.props.displayOnly) {
				// console.log(context);
				context.data.props.disabled = true;
				context.data.class = context.data.class || "";
				context.data.class += " display-only";
				return h("el-date-picker", context.data, context.children);
			} else {
				context.data.props.valueFormat = context.data.props.valueFormat || "yyyy-MM-dd";
				return h("el-date-picker", context.data, context.children);
			}
		}
	};
	export default {
		name: "YDatePicker",
		inject: {
			elForm: {default: ""}
		},
		components: {"y-functional-picker": functionalPicker},
		props: {
			displayOnly:{},
			format: {},
			valueFormat: {},
			clearable: {},
			value: {}
		},
		render: function(h) {
			let displayOnly;
			if (this.elForm) {displayOnly = this.elForm.displayOnly || this.elForm.$attrs.displayOnly;}
			return h("y-functional-picker", {
				props: {
					...this.$props,
					displayOnly: (this.$props.displayOnly === undefined && displayOnly !== undefined) ? displayOnly : this.$props.displayOnly
				},
				on: this.$listeners
			});
		}
	};
</script>
<style
		lang="scss"
		scoped
		type="text/scss">
	.el-input {
		&.el-date-editor.el-date-editor--date {
			width: 200px;

			&.el-input--mini {
				width: 180px;
			}
		}

		&.display-only {
			width: auto;

			/deep/ {
				.el-input__inner {
					width: auto;
					background-color: #FFFFFF;
					padding: 0;
					border: 0;
					cursor: unset;
				}

				.el-input__prefix {
					display: none;
				}
			}
		}
	}
</style>

