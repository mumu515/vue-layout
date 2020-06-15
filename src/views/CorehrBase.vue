<template>
	<el-main
			v-if="isReloaded"
			style="display: flex;flex-direction: column">
		<el-container style="flex:none">
			<slot name="header"></slot>
		</el-container>
		<el-main
				style="flex:auto"
				ref="mainContent">
			<el-scrollbar
					style="height: 100%"
					ref="myScrollbar">
				<el-container
						v-if="(percentageForReload||isShowReloadLayout)&&!pReload"
						direction="vertical">
					<el-button
							@click="reloadLayout"
							v-if="isShowReloadLayout&&!pReload">更新layout
					</el-button>
					<el-progress
							:text-inside="true"
							:stroke-width="20"
							:percentage="percentageForReload"
							status="success"></el-progress>
				</el-container>
				<slot></slot>
				<router-view></router-view>
			</el-scrollbar>
		</el-main>
	</el-main>
</template>
<script>
	import {ApiOptions} from "@/service/apiOptions";
	import {getCookieByQuery, setCookieByQuery} from "@/utils/auth";
	import {post, put} from "@/service/myHttp";

	export default {
		name: "CorehrBase",
		provide() {
			return {
				reload: this.reload,
				scrollToTop: this.scrollToTop
			}
		},
		inject: {
			pReload: {
				from: "reload",
				default: ""
			}
		},
		props: [],
		data() {
			return {
				isReloaded: true,
				isShowReloadLayout: false,
				percentageForReload: 0
			};
		},
		computed: {
			mainContentHeight() {
				console.log("计算mainContentHeight");
				try { return this.$refs.mainContent.$el.clientHeight} catch (e) {
					return 100;
				}
			}
		},
		methods: {
			scrollToTop() {
				this.$refs.myScrollbar.wrap.scrollTop = 0;
			},
			async reloadLayout() {
				let pageList = this.$store.state.corehr.layout.layoutCodes;
				this.$message({
					message: "开始更新",
					type: "info"
				});
				this.percentageForReload = 0;
				this.isShowReloadLayout = false;
				for (var i = 0; i < pageList.length; i++) {
					let layoutCode = pageList[i];
					let a = await post("/layout/LAYOUT_PAGE", undefined, {
						params: {},
						headers: {},
						data: {
							id: layoutCode,
							externalId: layoutCode,
							node: this.$store.getters["corehr/layout/template"](layoutCode).getTemplate().layout
						}
					});
					console.log(a);
					if (a.bizCode !== "0") {
						await put("/layout/LAYOUT_PAGE/" + layoutCode, undefined, {
							params: {uniqueKey: "WEB_PAGE_ID_UNIQUE"},
							headers: {},
							data: {
								id: layoutCode,
								externalId: layoutCode,
								node: this.$store.getters["corehr/layout/template"](layoutCode).getTemplate().layout
							}
						});
					}
					this.percentageForReload = i * 100 / pageList.length;
				}
				this.$alert("更新完毕", "弹出框", {
					type: "info",
					showConfirmButton: true,
					showClose: false,
					showCancelButton: false,
					confirmButtonText: "确定",
				}).then(function() {
					setCookieByQuery("COREHR_IS_SHOW_RELOAD_LAYOUT", "");
					location.reload();
				});
			},
			reload() {
				if (this.pReload) {
					this.pReload();
				} else {
					this.isReloaded = false;
					this.$nextTick(() => {
						this.isReloaded = true;
					});
				}

			}

		},
		async mounted() {
			this.isShowReloadLayout = getCookieByQuery("COREHR_IS_SHOW_RELOAD_LAYOUT") || false;
			try {
				const mList = (await ApiOptions.custom.updateMetaDataTypes()).filter(i => (!i.startsWith("log_")));
				let isUpDate = false;
				for (let item of mList) {
					await ApiOptions.custom.updateMetaData(item, (a) => {isUpDate = isUpDate || a;});
				}
				if (isUpDate) {
					window.location.reload();
				}
			} catch (e) {

			}
		},

	};
</script>
<style
		lang="scss"
		scoped
		type="text/scss">
</style>
