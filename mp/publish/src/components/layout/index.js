export default {
  name: "YLayout",
  functional: true,
  inheritAttrs: false,
  props: {
    layout: {
      type: Object,
      default: () => ({})
    }
  },
  inject: {
    parent: {
      from: "scope",
      default: () => ""
    },
    getScopes: {default: () => []}
  },
  render(h, context) {
    const createNode = (layout) => {
      let scope = {};
      if (layout) {
        if (layout.scopeId) {//利用 YScope 生成新的scope
          scope = context.injections.getScopes().find((item) => item.scopeId === layout.scopeId);
          if (!scope) {
            throw `未找到scopeId为${layout.scopeId}对应的scope`;
          }
        } else {
          if (context.injections.parent !== "") {
            scope = context.injections.parent;
          }
        }
        return h("y-scope", {
          props: {
            layout: {
              ...layout,
              scopeId: undefined
            },
            scope: scope
          }
        });
      } else {
        console.log("layout 不存在");
        return undefined;
      }
    };
    return createNode(context.props.layout);
    
  }
};
