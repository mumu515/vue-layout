var path = require("path");
var webpack = require("webpack");
const env = require("../config/pack.env");

const utils = require("./utils");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
	// entry:"./src/components/carousel/index.js",
	entry:"./src/index.js",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "vueJsonLayout.js",
		library: "vueJsonLayout", // library指定的就是你使用require时的模块名，这里便是require("toastPanel")
		libraryTarget: "umd", //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
		umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
	},
	devtool: "#source-map",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"vue-style-loader",
					"css-loader"
				]
			}, {
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					loaders: {}
					// other vue-loader options go here
				}
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 100000,
					name: utils.assetsPath("img/[name].[hash:7].[ext]")
				}
			}
		]
	},
	resolve: {
		alias: {
			"vue$": "vue/dist/vue.esm.js",
			"@": path.resolve(__dirname, "../src")
		},
		extensions: ["*", ".js", ".vue", ".json"]
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true
	},
	performance: {
		hints: false
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			"process.env": env
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			parallel: true,
			compress: {
				warnings: false,
				drop_debugger: false,
				drop_console: false

			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	]
};
