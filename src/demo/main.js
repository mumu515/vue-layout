
import Vue from "vue";

import App from "./App.vue";
import "@/demo/plugin/element";
import store from "@/demo/store";
import router from "@/demo/router";
import "@/demo/plugin/json-layout";


new Vue({
	store,
	router,
	render: h => h(App)
}).$mount("#app");
