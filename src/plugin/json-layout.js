// import components from "../../dist/vueJsonLayout";
import Vue from "vue";
import components from "@/plugin/index";
// import components from "../../dist/vueJsonLayout";
import {CONSTANTS} from "@/utils/constants";

import request from "@/service/gatewayRequest";

Vue.use(components, {
	CONSTANTS,
	request,
});
