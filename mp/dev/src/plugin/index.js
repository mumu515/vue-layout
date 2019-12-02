// import "./plugins/element-ui";
// import components from "./utils/components/index";
import YButton from '../components/button/index'

let VueLayout = {}
VueLayout.install = function (Vue, options) {
  Vue.component(YButton.name, YButton)
}
export default VueLayout
