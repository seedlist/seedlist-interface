const webpack = require("webpack")

module.exports = function override(config, env) {
	//do stuff with the webpack config...
	config.resolve.fallback = {
		...config.resolve.fallback,
		stream: require.resolve("stream-browserify"),
		buffer: require.resolve("buffer"),
		assert: require.resolve("assert/"),
		crypto: require.resolve("crypto-browserify")
	}
	config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
	config.plugins = [
		...config.plugins,
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		}),
	]

	return config
}