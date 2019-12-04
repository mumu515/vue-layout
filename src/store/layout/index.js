import {getProcessConfigByRequest} from "@/store/utils";

let templates = {};
const requireTemplates = require.context("./", true, /.*(\/).+(\.js)$/);
requireTemplates.keys().forEach((fileName) => {
  const template = requireTemplates(fileName);
  if (template.default && !fileName.match(/.*index\.js/)) {
    let dirName = fileName.match(/\.\/(.*)\/[^\/]*?\.js/)[1];
    templates[dirName] = templates[dirName] || {};
    let objectCode = fileName.match(/([^\/]*)\.js/)[1].toUpperCase();
    templates[dirName][objectCode] = template.default;
  }
});

export const layout = {
  namespaced: true,
  state: {
    templates
  },
  // modules: {
  //   add: {
  //     namespaced: true,
  //     state: {processCache: {}}
  //   },
  //   edit: {
  //     namespaced: true,
  //     state: {processCache: {}}
  //   },
  //   view: {
  //     namespaced: true,
  //     state: {processCache: {}}
  //   },
  //   list: {
  //     namespaced: true,
  //     state: {processCache: {}}
  //   },
  //   tree: {
  //     namespaced: true,
  //     state: {processCache: {}}
  //   }
  // },
  actions: {
    async getProcessConfig({state, getters}, {processUrl = "", payload = {}}) {
      let {objectCode, pageType} = payload, pageTypeAppend = "";
      [pageType, pageTypeAppend] = pageType.split("_");
      pageTypeAppend = (pageTypeAppend || "").toUpperCase();
      let key = objectCode + "_" + processUrl;
      return (await getProcessConfigByRequest(processUrl, payload, state.templates[pageType][pageTypeAppend || objectCode]()));
    }
  }
};

