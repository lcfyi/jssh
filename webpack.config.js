const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const childProcess = require("child_process");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /bootstrap.js$/,
        use: [
          {
            loader: "val-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __COMMIT_HASH: JSON.stringify(
        childProcess
          .execSync("git rev-parse --short HEAD")
          .toString()
          .trim()
      ),
      __COMMIT_COUNT: JSON.stringify(
        childProcess
          .execSync("git rev-list --count HEAD")
          .toString()
          .trim()
      ),
      __BUILD_DATE: JSON.stringify(new Date())
    }),
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
