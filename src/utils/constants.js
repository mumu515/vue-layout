export const CONSTANTS = {
  URLS: {
    get: {
      biz: "/biz/${objectCode}/${instanceId}", // 获取
      biz_choiceList: "/biz/choiceList/${listInstanceId}", // 获取选择枚举列表
      biz_tree: "/biz/tree/${objectCode}/${guid}", // 获取
      meta_codes: "/meta/codes",
      meta_object: "/meta/object/${objectCode}",
      meta_Reload: "/meta/reload"
    },
    post: {
      biz_child: "/biz/${childObjectCode}/for/${parentObjectCode}", // 创建子对象实例
      biz: "/biz/${objectCode}", // 新建
      biz_search: "/biz/${objectCode}/search", // search
      biz_list: "/biz/list/${objectCode}", // 列表
      biz_tree_child: "/biz/tree/${childObjectCode}/for/${parentObjectCode}", // 创建子对象实例
      biz_tree: "/biz/tree/${objectCode}"// 新建
    },
    put: {
      biz: "/biz/${objectCode}", // 更新,
      biz_tree: "/biz/tree/${objectCode}"// 更新
    },
    delete: {
      biz_child: "/biz/${childObjectCode}/for/${parentObjectCode}", // 删除子对象实例
      biz: "/biz/${objectCode}/${instanceId}", // 删除(暂不删除关联数据)
      biz_tree_child: "/biz/tree/${childObjectCode}/for/${parentObjectCode}", // 删除子对象实例
      biz_tree: "/biz/tree/${objectCode}/${guid}" // 删除（删除关联数据）
    }
  }
};
