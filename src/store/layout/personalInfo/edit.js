export default () => ({
	path: "/corehr/personalInfo/index/edit",
	layout: {
		nodeType: "router-view",
		scope: {
			scopeId: 1,
			data: {
				detailData: {},
				locale: {CHN: {}},
				lastAutoId: "",
				detailDataInstanceId: "",
				errorInstanceId: "",
				// personData: {},
				// employeeData: {},
				familyDependentPersons: []
			},
			methods: [
				{
					methodName: "init",
					handler: {
						body: `self.apiRequest({url: "/biz/LOCALE/search",type: "POST",data: {"code": "CHN"}}).then(function(response){
											self.locale.CHN=response.data.instances[0];
											self.apiRequest({url: "/biz/EMPLOYEE/search",type: "POST",headers: {},params: {depth: 3},
												data: {"externalId": self.empId}}).then(function(response1){
													self.detailDataInstanceId=response1.data.instances[0].instanceId;
													if(self.detailDataInstanceId){
														self.getData();
													}else{
														self.$router.replace("/404");
													}
											});
								});`
					}
				},
				{
					methodName: "getData",
					handler: {
						body: `
						 self.apiRequest({url: "/v2.4/transaction/api",type: "POST",headers: {},params: {},
             	data:{
             		"transaction":{
             			"code":"Web_Get_Employee",
             			"steps":[
             				{
             					"code":"Web_Get_Employee",
             					"data":[{"payload":{"query":{"instanceId":self.detailDataInstanceId},"asOfDate":self.today.mFormat("yyyyMMdd")}}]
             				}]
             			}
             		}
              }).then(function(response){
                self.detailData=response.data[0].transaction.steps[0].results[0].instances[0];
              });`
					}
				},
				{
					methodName: "getAutoId",
					handler: {
						body: `var r=self.apiRequest({url: "/system/tools/getAutoId/1",type: "GET"}).then(function(response){
											self.lastAutoId = response.data.list[0];
											return self.lastAutoId;
								});`,
						result: `r`
					}
				},
				{
					methodName: "toEdit",
					handler: {
						body: `self.$router.push({name:"CorehrPersonalInfoEdit"});`
					}
				},
				{
					methodName: "back",
					handler: {
						body: `self.$router.back();`
					}
				}]
		},
		props: {name: "corehr"}
	}
})
