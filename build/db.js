const mongoose = require("mongoose");
const UserSchema = require("./schema/user");
const ArticleSchema = require("./schema/article");
const CommentSchema = require("./schema/comment");

mongoose.connect("mongodb://localhost:27017/blog2", err => {
  if (err) console.log(err);
  console.log("connected");
});

const Models = {
  Article: mongoose.model("Article", ArticleSchema),
  User: mongoose.model("User", UserSchema),
  Comment: mongoose.model("Comment", CommentSchema)
};

module.exports = Models;
