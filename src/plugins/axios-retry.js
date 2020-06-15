import axiosRetry from "axios-retry";

export default function mAxiosRetry(request) {
	axiosRetry(request, {
		retries: 10,  //设置自动发送请求次数
		retryDelay: (retryCount) => {
			return 1000;
		},
		shouldResetTimeout: true,
		retryCondition: (error) => {
			//true为打开自动发送请求，false为关闭自动发送请求
			//这里的意思是当请求方式为get时打开自动发送请求功能
			console.log("axiosRetry");
			console.log(error);
			console.log(JSON.stringify(error));
			return error.code === "ECONNABORTED" && error.config.url.indexOf("api/ecosaas/corehr") >= 0;
		}
	});
}
;
