"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const path = require("path");
const fs = require("fs");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");
const express = require("express");
const app = express();
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

      app.get("/api/articleList", function(req, res) {
        db.Article.find({})
          .sort({ _id: -1 })
          .exec(function(err, docs) {
            if (err) {
              console.log("find articleList error:" + err);
              return;
            }
            res.send(docs);
          });
      });
      const SKIP = 3;
      app.post("/api/articleList", function(req, res) {
        const page = req.body.page;
        db.Article.find({})
          .sort({ _id: -1 })
          .limit(SKIP)
          .skip(SKIP * page)
          .exec(function(err, docs) {
            if (err) {
              console.log("find articleList error:" + err);
              return;
            }
            if (docs) {
              res.send(docs);
            }
          });
      });
      app.post("/api/articleList/:tag", function(req, res) {
        const page = req.body.page;
        db.Article.find({ tag: req.params.tag })
          .sort({ _id: -1 })
          .limit(SKIP)
          .skip(SKIP * page)
          .exec(function(err, docs) {
            if (err) {
              console.log("find articleList error:" + err);
              return;
            }
            if (docs) {
              res.send(docs);
            }
          });
      });
      /**
       * 登录
       */
      app.post("/login", function(req, res) {
        const un = req.body.username;
        const pwd = req.body.password;
        if (un === "grasfish" && pwd === "gotoAnd123") {
          res.send("OK");
        } else {
          res.send("BAD");
        }
      });
      /**
       * 上传图片
       */
      app.post("/upload", function(req, res) {
        const file = req.files.image;
        console.log(file.originalname + " load");
        const des_file = "./public/static/img/" + file.originalname;
        fs.readFile(file.path, function(err, data) {
          fs.writeFile(des_file, data, function(err) {
            if (err) console.log(err);
            else {
              res.send(req.headers.origin + "/static/img/" + file.originalname);
            }
          });
        });
      });
      /**
       * 上传文章
       */
      app.post("/api/saveArticle", function(req, res) {
        const article = new db.Article(req.body.article);
        db.Article.findOne({ title: article.title }, function(err, docs) {
          // 标题一致则更新，否则插入
          if (docs) {
            db.Article.where({ _id: docs._id })
              .update({
                $set: {
                  title: article.title,
                  content: article.content,
                  tag: article.tag,
                  date: article.date,
                  cover: article.cover
                }
              })
              .exec(function(err, docs) {
                res.send("updated " + article.title);
              });
          } else {
            article.save(function(err, doc) {
              if (err) {
                res.send(err);
              } else {
                res.send("saved " + article.title);
              }
            });
          }
        });
      });
      /**
       * 根据id查询单篇文章
       */
      app.get("/api/article/:id", function(req, res) {
        const id = req.params.id;
        db.Article.where({ _id: id })
          .update({ $inc: { view: 1 } })
          .exec(function(err, doc) {
            if (err) console.log(err);
          });
        db.Article.where({ _id: id }).exec(function(err, docs) {
          if (err) res.send(err);
          else res.send(docs);
        });
      });
      /**
       * 删除文章
       */
      app.get("/api/remove/:id", function(req, res) {
        db.Article.findByIdAndRemove(req.params.id, function(err, docs) {
          if (err) console.log(err);
          else res.send(docs);
        });
      });
      /**
       * 点赞路由
       */

      app.get("/api/like/:id", function(req, res) {
        const id = req.params.id;
        db.Article.where({ _id: id })
          .update({ $inc: { like: 1 } })
          .exec(function(err, doc) {
            if (err) console.log(err);
          });
      });
      app.get("/api/unlike/:id", function(req, res) {
        const id = req.params.id;
        db.Article.where({ _id: id })
          .update({ $inc: { like: -1 } })
          .exec(function(err, doc) {
            if (err) console.log(err);
          });
      });
      /**
       * 上传评论
       */
      app.post("/api/saveComment", function(req, res) {
        const comment = new db.Comment(req.body.comment);
        comment.save(function(err, doc) {
          if (err) {
            res.send(err);
          } else {
            db.Article.where({ _id: req.body.comment.articleId })
              .update({ $inc: { comment: 1 } })
          }
        });
      });
      /**
       * 获取评论列表
       */
      app.get("/api/comments/:id", function(req, res) {
        const id = req.params.id;
        db.Comment.where({ articleId: id }).exec(function(err, docs) {
          if (err) {
            res.send(err);
          } else {
            res.send(docs);
          }
        });
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
