<template>
	<el-container id="demo">
		<el-main id="demo-content">
			<router-view>
			</router-view>
		</el-main>
	</el-container>
</template>
<script>
	export default {
		name: "common",
		props: {},
		data() {
			return {};
		},
		created() {},
		mounted() {},
		methods: {}
	};
</script>
<style
		type="text/scss"
		lang="scss"
		scoped>
	#demo {
		background-color: #666666;
		height: 100vh;
		width: 100vw;
		padding-top: 4.29em;
		padding-left: 226px;
		padding-bottom: 2.86em;
		box-sizing: border-box;
	}

	#demo-content {
		background-color: #F6F6F6;
	}
</style>
