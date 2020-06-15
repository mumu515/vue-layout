import commonMixins from "@/components/utils/mixins-common";

const YButton = {
  name: "YButton",
  mixins: [commonMixins],
  inheritAttrs: false,
  inject: {
    elForm: {default: ""}
  },
  props: [
    "formSubmit",
    "size", //	尺寸	string	medium / small / mini	—
    "type", //	类型	string	primary / success / warning / danger / info / text	—
    "plain", //	是否朴素按钮	boolean	—	false
    "round", //	是否圆形按钮	boolean	—	false
    "loading", //	是否加载中状态	boolean	—	false
    "disabled", //	是否禁用状态	boolean	—	false
    "icon", //	图标类名	string	—	—
    // "autofocus", //	是否默认聚焦	boolean	—	false
    // "native-type" //	原生 type 属性	string	button / submit / reset	button
  ],
  render(h) {
    return <el-button
      class={this.$attrs.class}
      style={this.$attrs.style}
      {...{props: this._props}}
      {...{attrs: this.attrs}}
      onClick={this.handleClick}>{this.$slots.default}</el-button>;
  },
  methods: {
    getChildFormList(form) {
      let formList = [];
      if (form.validate) { formList.push(form);}
      (form.$children || []).forEach((item) => {
        formList.push(...this.getChildFormList(item));
      });
      return formList;
    },
    handleClick(e) {
      if (this.formSubmit) {
        if (this.elForm) {
          let formList = this.getChildFormList(this.elForm);
          let promise;
          let index = 0;
          while (index < formList.length) {
            let item = formList[index];
            if (promise) {
              promise = promise.then((isValidate) => {
                if (isValidate !== false) {
                  return item.validate();
                }
              });
            } else {
              promise = item.validate();
            }
            index++;
          }
          promise.then((isValidate) => {
            if (isValidate !== false) {
              return this.$emit("click", e);
            }
          });
        } else {
          this.$emit("click", e);
        }
      } else {
        this.$emit("click", e);
      }
    }
  }
};
export default YButton;

