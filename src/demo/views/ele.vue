<template>
	<el-container style="height:100vh">
		<el-header>el-header</el-header>
		<el-main>
			<span>el-main</span>
			<el-aside v-bind="aside">
				<span>el-aside</span>
			</el-aside>
			<el-icon name="loading"></el-icon>
			<el-avatar v-bind="avatar"></el-avatar>
			<el-backtop v-bind="backtop">top</el-backtop>
			<el-badge
					class="mark"
					:value="12"><span>badge</span></el-badge>
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>活动管理</el-breadcrumb-item>
			</el-breadcrumb>
			<el-button-group>
				<el-button
						type="primary"
						icon="el-icon-arrow-left">button-group>button1
				</el-button>
				<el-button type="primary">button-group>button2<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			</el-button-group>
			<el-button type="primary">el-button</el-button>
			<el-calendar></el-calendar>
			<el-card class="box-card">
				<div
						slot="header"
						class="clearfix">
					<span>卡片名称</span>
					<el-button
							style="float: right; padding: 3px 0"
							type="text">操作按钮
					</el-button>
				</div>
				<div
						v-for="o in 4"
						:key="o"
						class="text item">
					{{"列表内容 " + o }}
				</div>
			</el-card>
			<el-carousel height="150px">
				<el-carousel-item
						v-for="item in 4"
						:key="item">
					<h3>{{ item }}</h3>
				</el-carousel-item>
			</el-carousel>
			<el-cascader
					:options="cascader.options"
					v-model="cascader.selectedOptions"></el-cascader>
			<el-collapse
					@change="handleChange(val)">
				<el-collapse-item
						title="一致性 Consistency"
						name="1">
					<div>与现实生活一致</div>
				</el-collapse-item>
			</el-collapse>
			<el-color-picker v-model="colorPicker.color"></el-color-picker>
			<el-divider>divider</el-divider>
			<el-button
					type="primary"
					@click="drawer.visible=true"><span>show drawer</span></el-button>
			<el-drawer :visible.sync="drawer.visible"><span>drawer</span></el-drawer>
			<el-dropdown>
			  <span class="el-dropdown-link">
			    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
			  </span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>黄金糕</el-dropdown-item>
					<el-dropdown-item disabled>双皮奶</el-dropdown-item>
					<el-dropdown-item divided>蚵仔煎</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-image
					style="width: 100px; height: 100px"
					:src="image.url"
					:fit="image.fit"></el-image>
		</el-main>
		<el-footer>footer</el-footer>
	</el-container>
</template>
<script>
	export default {
		name: "Ele",
		props: {},
		data() {
			return {
				aside: {
					width: 200
				},
				avatar: {
					size: "small",
					shape: "circle",
					icon: "el-icon-close"
				},
				backtop: {
					visibilityHeight: 0,
					target: ".el-main",
					right: 20,
					bottom: 20
				},
				badge: {
					value: 10,
					max: 30,
					isDot: false,
					hidden: false,
					type: "primary"
				},
				cascader: {
					selectedOptions: [],
					options: [
						{
							label: '指南',
							children: [
								{
									label: '设计原则',
									children: [{label: '一致'}]
								},]
						}]
				},
				colorPicker: {color: ""},
				drawer: {visible: false},
				image: {
					fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
					url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
				}
			};
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
	.el-header {
		background-color: bisque;
	}

	.el-container {
		background-color: #EEEEEE;
	}

	.el-main {
		background-color: #FFFFFF;
		overflow-y: scroll;
	}

	.el-aside {
		background-color: aliceblue;
	}
</style>
