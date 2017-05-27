/**
 * @file webpack設定スクリプト。
 */
module.exports = {
	entry: './public/main.ts',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: [
				{ loader: "ts-loader" },
			]
		}]
	},
	watchOptions: {
		poll: 1000
	}
};