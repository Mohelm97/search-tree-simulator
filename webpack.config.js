const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    mode: "production",
    devServer: {
        static: {
            directory: "./dist",
        },
        devMiddleware: {
            writeToDisk: true,
        },
        liveReload: true,
        hot: false,
        watchFiles: ["index.html"],
        client: {
            overlay: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
    ],
};
