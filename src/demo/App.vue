<template>
	<div id="app">
		<router-view>
		</router-view>
	</div>
</template>
<script>
	export default {
		name: "app",
		data() {
			return {};
		}
	};
</script>
<style>
	* {
		font-family: Calibri, Segoe, "Segoe UI", Optima, "Helvetica Neue", Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif !important;
	}
	html {
		font-size: 100px;
	}

	body {
		margin: 0;
		line-height: 1.5;
		color: #515A6E;
		font-size: 0.14rem;
	}

	.page-header {
		background-color: #FFFFFF;
		height: 4.29em !important;
		padding-left: 1.43em;
		margin: 0 !important;
	}

	h2 {
		font-size: 0.20rem;
		font-weight: 600;
		color: #333333;
		line-height: 0.26rem;
	}

	.el-main {
		padding: 0;
	}

	.tab-page .el-tabs__item {
		height: 0.3rem;
		line-height: normal;
	}
</style>
