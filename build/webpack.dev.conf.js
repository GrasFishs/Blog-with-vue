"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");
const app = require("express")();
var bodyParser = require("body-parser");
var multer = require("multer");
const db = require("./db");

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: "warning",
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, "index.html")
        }
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    before(app) {
      app.use(bodyParser.json()); // for parsing application/json
      app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
      app.use(multer()); // for parsing multipart/form-data

      /**
       * 获取所有的文章列表
       */
      app.get("/api/articleList", function(req, res) {
        db.Article.find({}, function(err, docs) {
          if (err) {
            console.log("find articleList error:" + err);
            return;
          }
          res.send(docs);
        });
      }),
        app.get("/api/articleList/:tag", function(req, res) {
          db.Article.find(
            {
              tag: req.params.tag
            },
            function(err, docs) {
              if (err) {
                console.log("find articleList error:" + err);
                return;
              }
              res.send(docs);
            }
          );
        }),
        /**
         * 上传文章
         */
        app.post("/api/saveArticle", function(req, res) {
          const article = new db.Article(req.body.article);
          article.save(function(err, doc) {
            if (err) {
              res.send(err);
            } else {
              res.sendStatus(200);
            }
          });
        }),
        /**
         * 根据id查询单篇文章
         */
        app.get("/api/article/:id", function(req, res) {
          db.Article.findOne(
            {
              _id: req.params.id
            },
            function(err, docs) {
              db.Article.update(
                { _id: req.params.id },
                { view: docs.view + 1 }
              );
              if (err) return;
              res.send(docs);
            }
          );
        }),
        /**
         * 点赞路由
         */

        app.get("/api/like/:id", function(req, res) {
          db.Article.findOne(
            {
              _id: req.params.id
            },
            function(err, docs) {
              docs.like++;
              db.Article.update(
                { _id: req.params.id },
                { like: docs.like }
              );
              if (err) return;
            }
          );
        }),
        app.get("/api/unlike/:id", function(req, res) {
          db.Article.findOne(
            {
              _id: req.params.id
            },
            function(err, docs) {
              docs.like--;
              db.Article.update(
                { _id: req.params.id },
                { like: docs.like },
              );
              if (err) return;
            }
          );
        });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: config.dev.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      );

      resolve(devWebpackConfig);
    }
  });
});
