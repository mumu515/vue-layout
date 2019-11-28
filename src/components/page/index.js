//构造scope;

let getScope = function(scope, parentScope) {
  function Scope(scope, parentScope) {
    this.scopeId = scope.scopeId;
    this.parentScopeId = parentScope.scopeId;
  }
  
  let result = new Scope(scope, parentScope);
  Object.setPrototypeOf(result, {scopeId: scope.scopeId});
  
  function Data(scope) {
    let self = this;
    Object.keys(scope.data || {}).forEach((key) => {
      self[key] = scope.data[key];
    });
  }
  
  result.data = new Data(scope);
  Object.setPrototypeOf(result.data, parentScope.data || {});
  
  function Action(scope) {
    let self = this;
    Object.keys(scope.action || {}).forEach((key) => {
      self[key] = scope.action[key];
    });
  }
  
  result.action = new Action(scope);
  Object.setPrototypeOf(result.action, parentScope.action || {});
  return result;
};

export default {
  name: "YPage",
  inheritAttrs: false,
  props: {
    layout: {
      type: Object,
      default: () => ({})
    },
    scopes: {
      type: Array,
      default: () => ([])
    }
  },
  provide() {
    return {getScopes: this.getScopes};
  },
  inject: {
    parent: {
      from: "scope",
      default: () => ({})
    }
  },
  methods: {
    getScopes() {// 计算原型链
      let mScopes = this.scopes;
      const generateScope = (layout, parentScope) => {
        let scope;
        if (layout.scopeId) {
          let index = 0;
          scope = mScopes.find((item, i) => {
            if (item.scopeId === layout.scopeId) {
              index = i;
              return true;
            }
            return false;
          });
          if (!scope) {
            throw `未找到scopeId为${layout.scopeId}对应的scope`;
          }
          if (!scope.__proto__.hasOwnProperty("scopeId")) {
            mScopes.splice(index, 1, getScope(scope, parentScope));
          }
        } else {
          scope = parentScope;
        }
        if (layout.children) {
          layout.children.forEach((item) => {
            generateScope(item, scope);
          });
        }
      };
      generateScope(this.layout, this.parent);
      return mScopes;
    }
  },
  render(h) {
    return h("y-layout", {props: {layout: this.layout}});
  }
};
