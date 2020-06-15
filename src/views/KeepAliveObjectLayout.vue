<template>
	<keep-alive include="CorehrMetaObjectLayout">
		<corehr-meta-object-layout
				v-bind="$attrs"></corehr-meta-object-layout>
	</keep-alive>
</template>
<script>
	import CorehrMetaObjectLayout from "@/views/ObjectLayout";

	export default {
		name: "CorehrKeepAliveObjectLayout",
		components: {"CorehrMetaObjectLayout": CorehrMetaObjectLayout},
		mounted(){
			console.log(this);
		}
	}
	;
</script>
<style
		lang="scss"
		scoped
		type="text/scss">
</style>
