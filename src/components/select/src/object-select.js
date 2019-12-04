import Utils from "@/components/utils";
import {ApiOptions} from "@/service/apiOptions";
import commonMixins from "@/components/mixins-common";

export default {
  name: "YObjectSelect",
  mixins: [commonMixins],
  props: {
    "objectCode": {},
    "model": {},
    "prop": {},
    "optionsPath": {},
    "valueKey": {},
    "remoteFilterKey": {},
    "filter": {default: () => ({})},
    // "optionValueKey":{},
    "labelKey": {},
    "defaultValue": {},
    
    "multiple": {}, //	是否多选	boolean	—	false
    "disabled": {}, //	是否禁用	boolean	—	false
    "size": {}, //	输入框尺寸	string	large/small/mini	—
    "clearable": {}, //	单选时是否可以清空选项	boolean	—	false
    "collapse-tags": {}, //	多选时是否将选中值按文字的形式展示	boolean	—	false
    "multiple-limit": {}, //	多选时用户最多可以选择的项目数，为 0 则不限制	number	—	0
    "name": {}, // input 的 name 属性	string	—	—
    "placeholder": {}, //	占位符	string	—	请选择
    "filterable": {}, //	是否可搜索	boolean	—	false
    "allow-create": {}, //	是否允许用户创建新条目，需配合 filterable 使用	boolean	—	false
    "filter-method": {}, //	自定义搜索方法	function	—	—
    "loading": {}, //	是否正在从远程获取数据	boolean	—	false
    "loading-text": {}, //	远程加载时显示的文字	string	—	加载中
    "no-match-text": {}, //	搜索条件无匹配时显示的文字	string	—	无匹配数据
    "no-data-text": {}, //	选项为空时显示的文字	string	—	无数据
    "popper-class": {}, //	Select 下拉框的类名	string	—	—
    "reserve-keyword": {} //	多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词	boolean	—	false
  },
  data() {
    return {
      selectedObject: {},
      remoteList: [],
      loadList: [],
      isRemote: false,
      isLoading: false,
      isLoadingMore: false,
      optionValueKey: "instanceId",
      total: 0
    };
  },
  async created() {
    await this.init();
  },
  computed: {
    optionLabelKey() {return this.labelKey || "name";},
    mOptions() {return this.isRemote ? this.remoteList : this.loadList;},
    nextPage() {return Math.ceil(this.loadList.length / 10) === this.loadList.length / 10 ? this.loadList.length / 10 + 1 : 0;}
  },
  watch: {
    filter: {
      handler: function(n, o) {
        if (this.getValue()) {
          this.getListByValue();
        }
        this.loadList = [];
        this.loadMore();
      },
      deep: true
    }
  },
  methods: {
    async init() {
      if (this.getValue()) {
        await this.getListByValue();
      } else {
        this.loadList = [];
        await this.loadMore();
      }
    },
    /**
     * 根据当前选中值,获取选中option
     * @returns {Promise<void>}
     */
    async getListByValue() {
      try {
        this.isLoading = true;
        let data = await this.apiSearch({[this.optionValueKey]: this.getValueString()}, 1, 100);
        this.remoteList = data.instances || [];
        this.isRemote = true;
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 懒加载模式下,加载下一页
     */
    async loadMore() {
      if (this.nextPage) {
        try {
          this.isLoadingMore = true;
          let data = await this.apiSearch({}, this.nextPage);
          this.loadList.push(...(data.instances || []));
          this.total = data.total || 0;
          this.isRemote = false;
        } finally {
          this.isLoadingMore = false;
        }
      }
    },
    /**
     * 根据objectCode 以及相关搜索项,获取下拉列表
     * @param requestData
     * @param page
     * @param pageSize
     * @returns {Promise<void>}
     */
    async apiSearch(requestData, page, pageSize) {
      let data = {};
      try {
        data = (await ApiOptions.post.biz_search(this.objectCode,
          {...(this.filter.data || {}), ...requestData},
          {
            depth: 3,
            page: page || 1,
            pageSize: pageSize || 10,
            asOfDate: new Date().mFormat("yyyyMMdd"),
            ...(this.filter.params || {})
          })).data;
      } catch (e) {
      } finally {
      }
      return data;
    },
    /**
     * 清空select选中时,将下拉搜索结果删除,显示懒加载列表
     */
    onClear() {
      this.isRemote = false;
    },
    /**
     * 获取焦点时,检查是否上一次获取焦点搜索后没有选中任何值,导致下拉列表\与当前选中项不符
     */
    async onFocus() {
      if (this.isRemote) {
        if (this.getValue()) {
          if (!this.mOptions.find((option) => {
            return option && (this.valueKey ? option : Utils.getEvalResult(option, this.optionValueKey)) === this.getValue();
          })) {
            await this.getListByValue();
          }
        } else {
          this.isRemote = false;
        }
      } else {
      }
    },
    mRemoteMethod(query) {
      if (query) {
        this.isRemote = true;
        this.isLoading = true;
        this.apiSearch({[this.remoteFilterKey || this.optionLabelKey]: query}).then((data) => {
          this.isLoading = false;
          try {
            this.remoteList = data.instances || [];
          } catch (e) {
            this.remoteList = [];
          }
        }).catch(() => {
          this.isLoading = false;
        });
      } else {
        this.apiSearch({}).then((data) => {
          this.isLoading = false;
          try {
            this.remoteList = data.instances || [];
            this.total = data.total || 0;
          } catch (e) {
            this.remoteList = [];
          }
        }).catch(() => {
          this.isLoading = false;
        });
      }
    },
    /**
     * 获取select绑定的model值
     * @returns {string|object}
     */
    getValue() {return this.vModel ? Utils.getEvalResult(this.vModel, this.prop) : "";},
    /**
     * select绑定的model值是string则直接返回,是object时则根据optionValueKey返回对应标识
     * @returns {string}
     */
    getValueString() { return this.valueKey ? this.getValue()[this.optionValueKey] : this.getValue();},
    handleChange(v) {
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
    return <el-select
      class={this.$attrs.class}
      style={this.$attrs.style}
      {...{
        props: {
          ...this._props,
          filterable: true,
          remote: true,
          "remote-method": this.mRemoteMethod,
          value: this.getValue(),
          clearable: true,
          loading: this.isLoading
        }
      }} {...{attrs: this.attrs}}
      onClear={this.onClear}
      onChange={this.handleChange}
      onFocus={this.onFocus}>
      {
        this.mOptions.filter(i => i).map((option, index) => {
          let value = this.valueKey ? option : Utils.getEvalResult(option, this.optionValueKey);
          let label = Utils.getEvalResult(option, this.optionLabelKey);
          return <el-option
            key={index}
            label={label}
            value={value}></el-option>;
        })}
      {((!this.isRemote) && this.total > this.mOptions.length) ? <el-button
        type="text"
        loading={this.isLoadingMore}
        onClick={this.loadMore}>加载更多</el-button> : undefined}
    </el-select>;
  }
};
