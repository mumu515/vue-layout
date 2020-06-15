// import components from "../../dist/vueJsonLayout";
import Vue from "vue";
import request from "@/demo/service/gatewayRequest";
import store from "@/demo/store";
import router from "@/demo/router";
import c from "@/index";
// import c from "../../../dist/vueJsonLayout";
Vue.use(c, {
	request,
	store,
	router,
	ENV_NOW: process.env
});
