<template>
	<y-node-page
			:layout="layout"
			v-if="isReloaded"></y-node-page>
</template>
<script>
	export default {
		name: "CorehrMetaObjectLayout",
		props: {
			"layoutCode": {default: ""},
			"configParams": {default: false},
		},
		data() {
			return {
				isReloaded: false,
				// scopes: [],
				layout: {},
				test: ""
			};
		},
		watch: {
			layoutCode: function(n, o) {
				if (n !== o) {
					this.getLayoutConfig();
				}
			},
		},
		beforeRouteUpdate(to, from, next) {
			console.log("beforeRouteUpdate");
			console.log(this);
			next();
			console.log(this.layoutCode);
			//路由后的操作

		},
		beforeRouteLeave(to, from, next) {
			console.log("beforeRouteLeave");
			console.log(this);
			next();
			console.log(this.layoutCode);
			//路由后的操作
		},
		async created() {
			// console.log("created");
			// console.log(this.configParams);
			await this.getLayoutConfig();
		},
		// <keep-alive>包裹需要缓存组件
		// 页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。
		// 当再次进入（前进或者后退）时，只触发activated
		activated() {
			console.log("activated 调用了");
		},
		methods: {
			reload() {
				this.isReloaded = false;
				this.$nextTick(() => {
					this.isReloaded = true;
				});
			},
			async getLayoutConfig() {
				let layoutConfig = {};
				if (this.configParams) {
					layoutConfig = (await this.$store.dispatch("corehr/layout/getProcessConfig",
							{
								layoutCode: this.layoutCode,
								configParams: this.configParams
							}));
				} else {
					layoutConfig = (await this.$store.dispatch("corehr/layout/getProcessConfig",
							{
								layoutCode: this.layoutCode,
								configParams: {
									payload: {
										...this.$route.params,
										...this.$route.query,
										pageName: this.$route.name
									}
								}
							}));
				}
				this.layout = layoutConfig.layout;
				this.reload();
			}
		},
	}
	;
</script>
<style
		lang="scss"
		scoped
		type="text/scss">
	/deep/ {
		.el-card__header {
			font-weight: bolder;
			font-size: 16px;
		}

	}
</style>
