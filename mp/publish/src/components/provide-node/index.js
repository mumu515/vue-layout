const YProvideNode = {
  name: "YProvideNode",
  inheritAttrs: false,
  provide() {
    return {scope: this.$attrs};
  },
  render(h) {
    // console.log(this);
    return h(this.$attrs.nodeType || "el-container", this.$slots.default);
  }
};

export default YProvideNode;
