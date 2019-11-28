//导入node下面的相关包
const merge = require("webpack-merge"); // base64
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const webpack = require("webpack");
//安装postcss-px2rem
// const px2rem = require("postcss-px2rem");
//安装postcss
const postcss = require("postcss");

function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	// 基本路径 对应process.env.BASE_URL
	publicPath: "/dashboard/corehr-web/",
	// 输出文件目录
	outputDir: "dist",
	// eslint-loader 是否在保存的时候检查
	lintOnSave: true,
	// webpack配置
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	// chainWebpack: () => {
	// }
	configureWebpack: config => {
		config.mode = "production";
		config.entry = {index: "./src/index.js"};
		config.output = {
			...config.output,
			path: resolve("dist"),
			filename: "[name].js"
			// chunkFilename: "js/[name].[chunkhash].js"
			// publicPath: "/dashboard/corehr-web/",
			// globalObject: "this"
		};
		// config.plugins = [
		// 	new ProgressBarPlugin(),
		// 	new VueLoaderPlugin()
		// ];
		// return {
		// 	...config,
		// 	...{
		// 		entry: {main: "./src/index.js"},
		// 		output: {
		// 			path: resolve("dist"),
		// 			filename: "js/index.js"
		// 			// chunkFilename: "js/[name].[chunkhash].js"
		// 			// publicPath: "/dashboard/corehr-web/",
		// 			// globalObject: "this"
		// 		},
		// 		plugins: [
		// 			new ProgressBarPlugin()
		// 		]
		// 		// resolve: {
		// 		// 	alias: {
		// 		// 		"@": resolve("src"),
		// 		// 		// "~": resolve("node_modules"),
		// 		// 		// "node_modules": resolve("node_modules"),
		// 		// 		"vue$": "vue/dist/vue.esm.js"
		// 		// 	},
		// 		// 	extensions: [".mjs", ".js", ".jsx", ".vue", ".json", ".wasm", ".ts", ".tsx", ".scss"],
		// 		// 	modules: [
		// 		// 		"node_modules",
		// 		// 		resolve("node_modules"),
		// 		// 		resolve("node_modules/@vue/cli-service/node_modules")
		// 		// 	]
		// 		// }
		// 	}
		// };
	}
};
