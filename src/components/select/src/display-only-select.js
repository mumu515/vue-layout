import Utils from "@/components/utils";
import {ApiOptions} from "@/service/apiOptions";
import commonMixins from "@/components/mixins-common";

export default {
  name: "YDisplayOnlySelect",
  mixins: [commonMixins],
  props: {
    "objectCode": {},
    "listId": {},
    "model": {},
    "prop": {},
    "displayOnly": {},
    "options": {},
    "optionsPath": {},
    "valueKey": {},
    "labelKey": {},
    "filter": {default: () => ({})}
  },
  data() {
    return {
      selectedObject: {},
      mOptions: [],
      total: 0,
      isLoading: false,
      pageSize: 10
    };
  },
  async created() {
    await this.init();
  },
  computed: {
    vModel() {
      return this.model || (this.elForm ? this.elForm.model : {});
    },
    optionValueKey() {
      return (this.listId ? "code" : "instanceId");
    },
    optionLabelKey() {
      return this.labelKey || "name";
    }
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
    async init() {
      this.mOptions = [];
      if (this.options) {
        let options = this.options || [];
        this.total = options.length;
        this.mOptions.push(...options);
        return;
      }
      let value = this.valueKey ? Utils.getEvalResult(this.getValue(), this.optionValueKey) : this.getValue();
      if (this.objectCode) {
        let {data} = await ApiOptions.post.biz_search(this.objectCode,
          {[this.optionValueKey]: value, ...(this.filter.data || {})},
          {
            depth: 3,
            page: 1,
            pageSize: this.pageSize,
            asOfDate: new Date().mFormat("yyyyMMdd"),
            ...(this.filter.params || {})
          });
        this.mOptions = data.instances;
      } else if (this.listId) {
        const data = (await ApiOptions.get.biz_choiceList({listInstanceId: this.listId},
          {asOfDate: (this.filter.params || {}).asOfDate || new Date().mFormat("yyyyMMdd")})).data;
        this.mOptions.push(...data.choiceItems);
      }
    },
    getValue() {return this.vModel ? Utils.getEvalResult(this.vModel, this.prop) : "";},
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
    }
  },
  render(h) {
    this.getSelectedObject();
    return <span
      class={this.$attrs.class}
      style={this.$attrs.style}>{
      Utils.getEvalResult(this.selectedObject || {}, this.optionLabelKey) || ""
    }</span>;
  }
};
