<script type="text/babel">
	let functionalInputNumber = {
		name: "YFunctionalInputNumber",
		functional: true,
		inject: {
			elForm: {default: ""}
		},
		render: function(h, context) {
			// 完全透传任何特性、事件监听器、子节点等。
			// console.log("YFunctionalInputNumber=>context:");
			// console.log(context);
			if (context.props.displayOnly) {
				let v = (context.data.props || {}).value;
				if (typeJudge.isObject(v)) {
					v = JSON.stringify(v);
				}
				return <span
						class={context.data.class}
						style={context.data.style}>
          {v}
          </span>;
			} else {
				return h("el-input-number", context.data, context.children);
			}
		}
	};
	export default {
		name: "YInputNumber",
		inject: {
			elForm: {default: ""}
		},
		components: {"y-functional-input-number": functionalInputNumber},
		props: {
			displayOnly: {},
			"value": {},
			"disabled": {},
			"controls": {},
			"precision": {}
		},
		render: function(h) {
			// 完全透传任何特性、事件监听器、子节点等。
			let displayOnly;
			if (this.elForm) {displayOnly = this.elForm.displayOnly || this.elForm.$attrs.displayOnly;}
			return h("y-functional-input-number", {
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
		width: 200px;

		&.el-input--mini {
			width: 182px;
		}
	}
</style>

