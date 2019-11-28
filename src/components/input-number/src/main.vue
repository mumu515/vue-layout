<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/mixins-common";

	export default {
		name: "YInputNumber",
		mixins: [commonMixins],
		props: [
			"model",
			"prop",
			"decimal",
			"displayOnly",
			"defaultValue",

			// "value", //	绑定值	number	—	—
			"min", //	设置计数器允许的最小值	number	—	0
			"max", //	设置计数器允许的最大值	number	—	Infinity
			"step", //	计数器步长	number	—	1
			"size", //	计数器尺寸	string	large, small	—
			"disabled", //	是否禁用计数器	boolean	—	false
			"controls", //	是否使用控制按钮	boolean	—	true
			"debounce", //	输入时的去抖延迟，毫秒	number	—	300
			"controls-position", //	控制按钮位置	string	right	-
			"name", //	原生属性	string	—	—
			"label",//	输入框关联的label文字	string	—	—
			"precision"
		],

		render(h) {
			if (this.displayOnly) {
				return <span
						class={"el-input-number " + (this.mSize ? `el-input-${this.mSize} ` : "")}
						style={{"text-align": "end"}}>
          {this.getValue()}
          </span>;
			} else {
				if (this.defaultValue !== undefined && this.getValue() === undefined) {
					Utils.setEvalData(this.vModel, this.prop, this.defaultValue);
				}
				return <el-input-number
						class={this.$attrs.class}
						style={this.$attrs.style}
						{...{
							props: {
								...this._props,
								controls: false
							}
						}}
						{...{attrs: this.attrs}}
						value={this.getValue()}
						onInput={(v) => Utils.setEvalData(this.vModel, this.prop, v)}>
				</el-input-number>;
			}
		}
	};
</script>
<style
  lang="scss"
  scoped
  type="text/scss">
  .el-input-number {
    width: 200px;

    &.el-input-number--mini {
      width: 182px;
    }

    /deep/ input {
      text-align: end;
    }
  }
</style>

