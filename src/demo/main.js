import Vue from "vue";
import "@/plugin/json-layout";

import App from "./App.vue";
import "@/plugin/element";
import store from "@/store/index";

new Vue({
	store,
	render: h => h(App)
}).$mount("#app");
