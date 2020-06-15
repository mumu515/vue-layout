<template>
	<div
			class="display-flex align-center"
			style="margin:20px 0">
		<slot name="header"></slot>
		<div :class="'y-icon-'+iconClass"></div>
		<div
				class="bolder"
				style="margin: 0 24px 0 10px">{{title}}
		</div>
		<div class="line-grey-dashed"></div>
		<slot name="footer"></slot>
	</div>
</template>
<script type="text/babel">
	export default {
		name: "YPortalItemHeader",
		props: [
			"title",
			"iconClass"
		]
	};
</script>
<style
		lang="scss"
		scoped
		type="text/scss">
	$icons: bank-card, bank-card-blue, contract-way, emergency-contract, family-dependent, id-card,
	local-info, location, mail, mobile, name, other-contract, personal-info, personal-profile-info;

	@mixin icon($url) {
		content: "";
		width: 20px;
		height: 20px;
		display: block;
		background: url($url) no-repeat;
		background-size: contain;

	}

	@each $icon in $icons {
		.y-icon-#{$icon}:before {
			@include icon("~@/assets/icon/svg/#{$icon}.svg")
		}
	}
</style>

