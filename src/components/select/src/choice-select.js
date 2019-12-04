import Utils from "@/components/utils";
import {ApiOptions} from "@/service/apiOptions";
import commonMixins from "@/components/mixins-common";

export default {
  name: "YChoiceSelect",
  mixins: [commonMixins],
  props: {
    "listId": {},
    "model": {},
    "prop": {},
    "displayOnly": {},
    "options": {},
    "optionsPath": {},
    "valueKey": {},
    "remoteFilterKey": {},
    // "optionValueKey":{},
    "defaultValue": {},
    "filter": {default: () => ({})},
    
    "labelKey": {},
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
    "remote": {}, //	是否为远程搜索	boolean	—	false
    // "remote-method":{}, //	远程搜索方法	function	—	—
    "loading": {}, //	是否正在从远程获取数据	boolean	—	false
    "loading-text": {}, //	远程加载时显示的文字	string	—	加载中
    "no-match-text": {}, //	搜索条件无匹配时显示的文字	string	—	无匹配数据
    "no-data-text": {}, //	选项为空时显示的文字	string	—	无数据
    "popper-class": {}, //	Select 下拉框的类名	string	—	—
    "reserve-keyword": {}, //	多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词	boolean	—	false
    "default-first-option": {} //	在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用	boolean	-	false
  },
  data() {
    return {
      selectedObject: {},
      mOptions: [],
      isLoading: false,
      localFilter: JSON.stringify(this.filter)
    };
  },
  async created() {
    await this.init();
  },
  computed: {
    optionValueKey() {return "code";},
    optionLabelKey() {return this.labelKey || "name";}
  },
  watch: {
    filter: {
      handler: function(n, o) {
        this.init();
      },
      deep: true
    }
  },
  methods: {
    /**
     * 在传入了options时,试用options作为下拉列表,否则根据listId获取choiceList选值列表
     * @returns {Promise<void>}
     */
    async init() {
      if (this.options) {
        let options = this.options || [];
        this.total = options.length;
        this.mOptions.push(...options);
        return;
      }
      const data = (await ApiOptions.get.biz_choiceList({listInstanceId: this.listId},
        {asOfDate: (this.filter.params || {}).asOfDate || new Date().mFormat("yyyyMMdd")})).data;
      this.mOptions = [];
      this.mOptions.push(...data.choiceItems);
    },
    async getSelectedObject() {
      let result;
      let value = this.getValue();
      if (!value) {
        this.selectedObject = {};
        return;
      }
      if (this.valueKey && !Utils.getEvalResult(value, this.optionValueKey)) {return;}
      result = this.mOptions.find((item) => {
        return Utils.getEvalResult(item, this.optionValueKey) === (this.valueKey ? Utils.getEvalResult(value, this.optionValueKey) : value);
      });
      this.selectedObject = result;
      return result;
    },
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
    this.getSelectedObject();
    // 若该组件model绑定至对象上 则 optionValueKey应为 undefined,托绑定到对象某一属性上,则optionValueKey应为属性名
    // optionLabelKey为要显示的label属性名,若没有设置,则直接显示model值
    let [optionValueKey, optionLabelKey] = [this.optionValueKey, this.optionLabelKey];
    return <el-select
      class={this.$attrs.class}
      style={this.$attrs.style}
      {...{
        props: {
          ...this._props,
          filterable: true,
          "default-first-option": true,
          value: this.getValue(),
          "value-key": this.valueKey,
          clearable: true
        }
      }}
      {...{attrs: this.attrs}}
      onChange={this.handleChange}>
      {this.mOptions.map((option, index) => {
        let value = this.valueKey ? option : Utils.getEvalResult(option, optionValueKey);
        let label = Utils.getEvalResult(option, optionLabelKey);
        return <el-option
          key={index}
          label={label}
          value={value}></el-option>;
      })}
    </el-select>;
  }
};
