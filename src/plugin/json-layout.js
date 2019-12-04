// import components from "../../dist/vueJsonLayout";
import Vue from "vue";
import components from "@/plugin/index";
import request from "@/service/gatewayRequest";
import store from "@/demo/store";
// import components from "../../dist/vueJsonLayout";
Vue.use(components, {
	request,
	store
});
