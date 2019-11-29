import Vue from "vue";
import App from "./App.vue";
import components from "../utils/components/index";
import "../plugins/element-ui";

Object.keys(components).forEach((key) => {
	Vue.component(key, components[key]);
});

new Vue({
	render: h => h(App)
}).$mount("#app");
