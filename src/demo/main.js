import Vue from "vue";
import App from "./App.vue";
import "../plugins/element-ui";
import VueLayout from "../../index"

new Vue({
	render: h => h(App)
}).$mount("#app");
