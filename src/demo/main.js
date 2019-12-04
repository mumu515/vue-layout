import Vue from "vue";
import "@/plugin/json-layout";

import App from "./App.vue";
import "@/plugin/element";
import store from "@/demo/store";

new Vue({
	store,
	render: h => h(App)
}).$mount("#app");
