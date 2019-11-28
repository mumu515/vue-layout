<script type="text/babel">
	import Utils from "@/components/utils";
	import commonMixins from "@/components/mixins-common";

	export default {
		name: "YDatePicker",
		mixins: [commonMixins],
		props: [
			"model",
			"prop",
			"displayOnly",
			"defaultValue",
			"readonly", //	完全只读	boolean	—	false
			"disabled", //	禁用	boolean	—	false
			"editable", //	文本框可输入	boolean	—	true
			"clearable", //	是否显示清除按钮	boolean	—	true
			"size", //	输入框尺寸	string	large, small, mini	—
			"placeholder", //	非范围选择时的占位内容	string	—	—
			"start-placeholder", //	范围选择时开始日期的占位内容	string	—	—
			"end-placeholder", //	范围选择时结束日期的占位内容	string	—	—
			"type", //	显示类型	string	year/month/date/week/ datetime/datetimerange/daterange	date
			"format", //	显示在输入框中的格式	string	年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss，AM/PM A	yyyy-MM-dd
			"align", //	对齐方式	string	left, center, right	left
			"popper-class", //	DatePicker 下拉框的类名	string	—	—
			"picker-options", //	当前时间日期选择器特有的选项参考下表	object	—	{}
			"range-separator", //	选择范围时的分隔符	string	—	'-'
			"default-value", //	可选，选择器打开时默认显示的时间	Date	可被new Date()解析	—
			"valueFormat", //	可选，绑定值的格式。不指定则绑定值为 Date 对象	string	年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss，AM/PM A	—
			"name", //	原生属性	string	—	—
			"unlink-panels" //	在范围选择器里取消两个日期面板之间的联动	boolean	—	false
		],
		methods: {
			handleInput(v) {
				Utils.setEvalData(this.vModel, this.prop, v);
				if (this.elForm) {
					this.elForm.clearValidate();
				}
			}
		},
		render(h) {
			if (this.defaultValue !== undefined && this.getValue() === undefined) {
				Utils.setEvalData(this.vModel, this.prop, this.defaultValue);
			}
			if (this.displayOnly) {
				return <el-date-picker
						class={(this.$attrs.class || "") + " display-only"}
						style={this.$attrs.style}
						{...{
							props: {
								...this._props,
								disabled: true
							}
						}}
						{...{attrs: this.attrs}}
						value={this.getValue()}
						onInput={this.handleInput}>
				</el-date-picker>;
			} else {
				return <el-date-picker
						class={this.$attrs.class}
						style={this.$attrs.style}
						{...{
							props: {
								...this._props,
								"valueFormat": (this._props["valueFormat"] || "yyyy-MM-dd")
							}
						}}
						{...{attrs: this.attrs}}
						value={this.getValue()}
						onInput={(v) => Utils.setEvalData(this.vModel, this.prop, v)}>
				</el-date-picker>;
			}
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

