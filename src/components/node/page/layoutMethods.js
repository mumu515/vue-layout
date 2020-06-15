import {fetch, mdelete, post, put} from "@/service/myHttp";
import {ApiOptions} from "@/service/apiOptions";
import {getCookieByQuery, setCookieByQuery} from "@/utils/auth";

export default {
	methods: {
		getCookieByQuery,
		setCookieByQuery,
		reload() {
			this.isReloaded = false;
			this.$forceUpdate();
			this.$nextTick(() => {
				this.isReloaded = true;
				this.$forceUpdate();
			});
		},
		apiRequest({type = "GET", url, params = {}, headers = {}, data = {}}) {
			if (url) {
				return {
					GET: fetch,
					DELETE: mdelete,
					POST: post,
					PUT: put
				}[type](url, undefined, {
					params: params,
					headers: headers,
					data: data
				});
			}
		},
		getMetaData(code, tenantId) {
			return ApiOptions.custom.getMetaData(code, tenantId);
		},
		async updateMetaObject(tenantId) {
			const mList = (await ApiOptions.custom.updateMetaDataTypes(tenantId)).filter(i => (!i.startsWith("log_")));
			for (let item of mList) {
				await ApiOptions.custom.updateMetaData(item, null, tenantId);
			}
		},
		fetchMetaObjects(instanceIds, objectCode) {
			if (typeJudge.isString(instanceIds)) {
				return this.apiRequest({
					url: `/biz/${objectCode}/${instanceIds}`,
					type: "GET",
					headers: {},
					params: {depth: 6}
				}).then(function(response) {return response.data;});
			} else {
				let p = new Promise((resolve, reject) => {resolve([]);});
				for (let instanceId of instanceIds) {
					p = p.then((result) => {
						return this.apiRequest({
							url: `/biz/${objectCode}/${instanceId}`,
							type: "GET",
							headers: {},
							params: {depth: 6}
						}).then(function(response) {
							result.push(response.data);
							return result;
						});
					});
				}
				return p;
			}
		},
		routerBack() {this.$router.back();},
		generateData(generateDataParam) {
			var r = lodash.mergeWith({}, generateDataParam, (obj, source) => {
				if (typeJudge.isArray(source)) {
					if (source.length === 0) {
						return null;
					} else {
						var arr = lodash.filter(lodash.map(source, (item) => {
							if (typeJudge.isObject(item)) {
								var t = this.generateData(item);
								t = lodash.pickBy(t, function(v, k) {return v !== null;});
								if (JSON.stringify(t) === "{}") {return null;}
								return t;
							} else {
								return item;
							}
						}), (item) => {
							return item !== null;
						});
						if (arr.length === 1 && arr[0] === "") {
							return [];
						} else {
							return arr;
						}
					}
				}
			});
			r = lodash.pickBy(r, function(v, k) {return v !== null;});
			return r;
		}
	}
};
