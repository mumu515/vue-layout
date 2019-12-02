import Utils from "@/components/utils";

export default {
  inject: {
    elForm: {default: ""},
    elFormItem: {default: ""}
  },
  inheritAttrs: false,
  computed: {
    attr() {
      return Object.keys(this.$attrs).reduce((result, key) => {
        if (key !== "style" && key !== "class") {
          result[key] = this.$attrs[key];
        }
        return result;
      }, {});
    },
    vModel() {return this.model || (this.elForm || {}).model || {};},
    mSize() {
      return this.size || (this.elFormItem ? this.elFormItem.size : "") || (this.elForm ? this.elForm.size : "");
    }
  },
  methods: {
    getValue(defaultValue) {
      let result = Utils.getEvalResult(this.vModel, this.prop);
      if (result === undefined) {
        return defaultValue;
      }
      return result;
    }
  }
};
