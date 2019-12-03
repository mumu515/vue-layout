import Vue from "vue";
import App from "./App.vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

import components from "../../dist/vueLayout";

Vue.use(components);

new Vue({
	render: h => h(App)
}).$mount("#app");
