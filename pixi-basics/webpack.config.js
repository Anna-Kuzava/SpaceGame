const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins: [
        new HTMLPlugin(  {
            template:"./src/index.html"
        }),
        new CopyPlugin( {
            patterns: [{
                from:path.resolve(__dirname, "src", "resources"),
                to:path.resolve(__dirname, "dist", "resources")
            }]
        })
    ]
};