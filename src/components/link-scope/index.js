import {fetch, mdelete, post, put} from "@/service/myHttp";

let apiRequest = ({type = "GET", url, params = {}, headers = {}, data = {}}) => {
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
};
const YLinkScope = {
	name: "YLinkScope",
	props: [
		"tag",
		"links",
		"linkKey",
		"data"//string,object,array
	],
	// functional: true,
	data() {
		return {instances: []};
	},
	render(h) {
		return this.getDefaultNode();
	},
	computed: {
		link() {
			if (this.links && this.linkKey) {
				return this.links.find((item) => {
					return this.linkKey === item.rel;
				});
			}
		}
	},
	watch: {
		data: {
			handler: function(n, o) {
				if (!deepEquals(n, o)) {
					this.initInstances();
				}
			},
			immediate: true
			// deep: true
		}
	},
	methods: {
		async initInstances() {
			let isAllReady = true;
			let mData = this.data;
			if (!this.link || !this.data) {
				return;
			}
			if (typeJudge.isObject(this.data)) {
				return;
			}
			if (typeJudge.isString(this.data)) {
				mData = [mData];
			}
			this.instances = [];
			for (let i = 0; i < mData.length; i++) {
				let item = mData[i];
				if (typeJudge.isString(item)) {
					isAllReady = false;
					this.instances.push((await apiRequest({
						url: this.link.href.replace("/api/ecosaas/corehr", "").replace(/{.*}/, item),
						type: "POST",
						headers: {},
						params: {},
						data: {}
					})).data[0].transaction.steps[0].results[0].instances[0]);
				} else {
					this.instances.push(item);
				}
			}
			if (!isAllReady) {
				if (typeJudge.isString(this.data)) {
					this.$emit("instances-completed", this.instances[0]);
				} else {
					this.$emit("instances-completed", this.instances);
				}
			}
		},
		getDefaultNode() {
			if (this.tag) {
				return this.$createElement(this.tag, this.$slots.default);
			} else {
				try {
					return this.$slots.default[0];
				} catch (e) {
				}
			}
		}
	}
};
export default YLinkScope;

