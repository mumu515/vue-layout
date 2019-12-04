// import components from "../../dist/vueLayout";
import Vue from "vue";
import components from "@/plugin/index";
import {CONSTANTS} from "@/utils/constants";

import request from "@/service/gatewayRequest";

Vue.use(components, {
	CONSTANTS,
	request,
});
