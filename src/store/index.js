import Cookies from "js-cookie";
import {layout} from "@/store/layout/index";

export default {
	namespaced: true,
	state: {
		base: {
			skin: Cookies.get("skin") || "default",
			httpHeaders: {},
			metaDataCodes: [],
			metaDatas: {},
			choices: {},
			instances: {},
			refs: {}
		}
	},
	modules: {
		layout
	},
	getters: {
		instance: (state) => ({field, key}) => {
			return key ? state.base[field][key] : state.base[field];
		},
		httpHeaders: (state) => () => {
			// return state.base.httpHeaders;
			// return {
			//   appendUrl: "api/ecosaas/corehr",
			//
			//   Frontend: 1,
			//   TenantId: getCookieByQuery("tenantId"),
			//   Authorization: `Bearer ` + getCookieByQuery("tenantToken")
			// };
			return {
				API: "https://api-test.ecosaas.com/",
				appendUrl: "api/ecosaas/corehr",
				
				Frontend: 1,
				TenantId: "371e9130-0e44-4c30-ada7-a5fc2d1b7767",
				Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJlbWFpbFwiOlwiSWtlLkxpQUBjZHBncm91cGx0ZC5jb21cIixcImlkTnVtYmVyXCI6XCI2MTA1ODExOTk4MTAxMDAzMTFcIixcImxvY2FsZVwiOlwiemhfQ05cIixcInBlcnNvbklkXCI6XCI1ZGI5MmM5NjEyNjlkMmJjZjg0YTJiMGNcIixcInBob25lXCI6XCIxMzY0MzQ3MzU5NlwiLFwidGVuYW50Q29kZVwiOlwiYmF5ZXJ0ZXN0XCIsXCJ0ZW5hbnRJZFwiOlwiMzcxZTkxMzAtMGU0NC00YzMwLWFkYTctYTVmYzJkMWI3NzY3XCIsXCJ1c2VySWRcIjpcIjVkYjkyYzk2MTI2OWQyYmNmODRhMmIwY1wiLFwidXNlcm5hbWVcIjpcIkdMSUpFXCJ9IiwiYXV0aCI6IlJPTEVfRU1QLFJPTEVfSFIiLCJleHAiOjE1NzU2MTI2Nzh9.7X3Pxzc9DtV-Zf-ibC-onybHPu1a1zHJmeA_JumiXMFqZsmQfFoQfXjmM8EmuVvc2-lLks4raiCdNDNS_VVxeQ"
			};
			return {
				API: "https://api-dev.ecosaas.com/",
				appendUrl: "api/ecosaas/corehr",
				
				Frontend: 1,
				TenantId: "test",
				Authorization: `Bearer ` + "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJlbWFpbFwiOlwiMUAxLmNvbVwiLFwiaWROdW1iZXJcIjpcIjExMTExMTExMTExMTExMTExMVwiLFwibG9jYWxlXCI6XCJ6aF9DTlwiLFwicGVyc29uSWRcIjpcIjVjMjQ4YmVlMzU0YjAxM2IzNDk1MDVhZFwiLFwicGhvbmVcIjpcIjExMTExMTExMTExXCIsXCJ1c2VySWRcIjpcIjMzYmI3OGUwLTA5YmEtMTFlOS1hYjY1LTAwMGMyOWNhYTRmYVwiLFwidXNlcm5hbWVcIjpcImFkbWluXCJ9IiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTU3MzcyNTIyNX0.edh1nIodTD8TFXbQCGzbrEfNEj-7LhPz0l7irg6cYMK_kQ5xAbKF5bllSua5jd9cUPWMv89Ia_PQbFTCI0jGLg"
			};
		}
	},
	
	mutations: {
		update(state, {field, data}) {
			state.base[field] = {...state.base[field], ...data};
		}
	}
}
