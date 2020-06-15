<template>
	<el-main
			id="corehr"
			v-loading="loading()">
		<slot></slot>
	</el-main>
</template>
<script>
	import {ApiOptions} from "@/service/apiOptions";
	import {getCookieByQuery, setCookieByQuery} from "@/utils/auth";
	import {post, put} from "@/service/myHttp";

	export default {
		name: "CorehrRoot",
		data() {
			return {
				// loading: false
			}
		},
		methods: {
			loading() {
				console.log(this.$store.state.corehr);
				return this.$store.state.corehr.loadingStackNum !== 0;
			}
		}

	};
</script>
<style
		lang="scss"
		type="text/scss">
	@mixin icon($url) {
		content: "";
		width: 20px;
		height: 20px;
		display: block;
		background: url($url) no-repeat;
		background-size: contain;

	}

	@mixin bg($url) {
		background-image: url($url);
		background-repeat: no-repeat;
	}

	body {
		.el-message {
			height: auto;
		}

		.required:before {
			content: '*';
			color: #F56C6C;
			margin-right: 4px;
		}

		.corehr-main-container {
			height: calc(100vh - 100px) !important;
		}

	}

	#corehr {
		height: 100%;
		width: 100%;
		overflow: hidden;

		.el-scrollbar {
			/*height: 100%;*/
			/*max-width: 100%;*/
			/*overflow: hidden;*/
		}

		.el-scrollbar__wrap {
			height: calc(100% + 19px) !important;
		}

		.pl20 {
			padding-left: 20px;
		}

		.el-row {
			margin: 0;
		}

		.transparent {
			color: transparent;
		}

		.detail-label-title {
			display: flex;
			align-items: center;
			margin: 40px 0;

			.begin-tag {
				width: 12px;
				height: 12px;
				display: block;
				flex: none;
			}

			.content {
				font-size: 18px;
				font-weight: bolder;
				flex: none;
				margin: 0 20px;
			}

			.end-tag {
				background-color: #EEEEEE;
				height: 1px;
				flex: auto;
			}
		}

		.bolder {
			font-weight: bolder;
		}

		.display-flex {
			display: flex;

			&.align-center {
				align-items: center;
			}
		}

		.line-grey {
			background-color: #EEEEEE;
			border-bottom: 1px solid #EEEEEE;
			flex: auto;
		}

		.line-grey-dashed {
			border-bottom: 1px #EEEEEE dashed;
			flex: auto;
			height: 0
		}

		.pagination {
			text-align: right;
			margin-top: 30px;
		}

		.el-icon-plus:before {
			@include icon("~@/assets/icon/svg/add.svg")
		}

		.el-icon-delete:before {
			@include icon("~@/assets/icon/svg/delete.svg")
		}

		.el-icon-reset:before {
			@include icon("~@/assets/icon/svg/reset.svg")
		}

		.el-icon-saveedit:before {
			@include icon("~@/assets/icon/svg/save-edit.svg")
		}

		.el-icon-save:before {
			@include icon("~@/assets/icon/svg/save.svg")
		}

		.icon-back.el-icon-arrow-left:before {
			@include icon("~@/assets/icon/svg/angle-left.svg");
			height: 17px;
		}

		.personalInfo-bg {
			@include bg("~@/assets/img/personalInfo_1.png");
			background-position: bottom right;
			background-size: 623px;
		}

		.familyPersonInfo-bg {
			@include bg("~@/assets/img/personalInfo_2.png");
			background-position: bottom right;
			background-size: 623px;
		}

		.tab-page {
			.el-tabs__content {
				padding: initial;
				margin: initial;
			}
		}

		.el-input-number /deep/ input {
			text-align: right;
		}

		input::placeholder {
			color: #999999;
		}

		.el-form .el-form-item__label {
			font-weight: initial;
		}

		.el-form-item--mini .el-form-item__error {
			padding-top: 4px;
		}

		.el-card__body {
			max-width: 100%;
		}

		.no-permission {
			@include bg("~@/assets/img/no-permission.png");
			background-position: center;
			background-size: 100%;
		}

	}
</style>
<style
		lang="scss"
		scoped
		type="text/scss">
	/deep/ {
		.display-none {
			display: none !important;
		}

		.el-container {
			display: flex !important;
		}
	}
</style>
