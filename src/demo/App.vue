<template>
	<div id="app">
		<y-page
				:layout="testLayout"
				:scopes="testScopes"></y-page>
	</div>
</template>
<script>
	export default {
		name: "app",
		data() {
			return {
				testScopes: [
					{
						scopeId: "1",
						data: {}
					}],
				testLayout: {
					scopeId: "1",
					nodeType: "el-container",
					props: {direction: "vertical"},
					children: [
						{
							nodeType: "y-button",
							innerHTML: "y-button"
						}]
				}
			};
		}
	};
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2C3E50;
		margin-top: 60px;
	}
</style>
