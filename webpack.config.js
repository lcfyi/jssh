const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!.gitignore"]
    }),
    new CopyPlugin([{ from: "static", to: "." }]),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: "index.[contenthash].js",
    path: path.resolve(__dirname, "dist")
  }
};
