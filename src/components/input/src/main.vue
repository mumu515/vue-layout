<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/mixins-common";

	export default {
		name: "YInput",
		mixins: [commonMixins],
		props: [
			"model",
			"prop",
			"displayOnly",
			"defaultValue",

			"type", //	类型	string	text / textarea	text
			// "value", //	绑定值	string / number	—	—
			"maxlength", //	最大输入长度	number	—	—
			"minlength", //	最小输入长度	number	—	—
			"placeholder", //	输入框占位文本	string	—	—
			"clearable", //	是否可清空	boolean	—	false
			"disabled", //	禁用	boolean	—	false
			"size", //	输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
			"prefix-icon", //	输入框头部图标	string	—	—
			"suffix-icon", //	输入框尾部图标	string	—	—
			"rows", //	输入框行数，只对 type="textarea" 有效	number	—	2
			"autosize", //	自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
			"auto-complete", //	原生属性，自动补全	string	on, off	off
			"name", //	原生属性	string	—	—
			"readonly", //	原生属性，是否只读	boolean	—	false
			"max", //	原生属性，设置最大值	—	—	—
			"min", //	原生属性，设置最小值	—	—	—
			"step", //	原生属性，设置输入字段的合法数字间隔	—	—	—
			"resize", //	控制是否能被用户缩放	string	none, both, horizontal, vertical	—
			"autofocus", //	原生属性，自动获取焦点	boolean	true, false	false
			"form", //	原生属性	string	—	—
			"label", //	输入框关联的label文字	string	—	—
			"tabindex" //	输入框的tabindex	string	-	-

		],
		methods: {
			handleBlur(e) {
				let v = Utils.getEvalResult(this.vModel, this.prop);
				if (v && v.trim() !== v) {
					Utils.setEvalData(this.vModel, this.prop, v.trim());
				}
			},
			handleInput(v) {
				Utils.setEvalData(this.vModel, this.prop, v);
				if (this.elForm) {
					this.elForm.clearValidate();
				}
			}
		},
		render(h) {
			if (this.displayOnly) {
				return <span
						class={this.$attrs.class}
						style={this.$attrs.style}>
          {this.getValue()}
          </span>;
			} else {

				// if (this.prop === "code") {
				// 	debugger;
				// }
				if (this.defaultValue !== undefined && this.getValue() === undefined) {
					// if (this.prop === "name") {
					// 	debugger;
					// }
					Utils.setEvalData(this.vModel, this.prop, this.defaultValue);
				}
				return <el-input
						class={this.$attrs.class}
						style={this.$attrs.style}
						{...{props: this._props}}
						{...{attrs: this.attrs}}
						value={this.getValue("")}
						onInput={this.handleInput}
						onBlur={this.handleBlur}
				>
				</el-input>;
			}
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

