const mongoose = require("mongoose");
const UserSchema = require("./schema/user");
const ArticleSchema = require("./schema/article");

mongoose.connect("mongodb://localhost:27017/blog2", err => {
  if (err) console.log(err);
  console.log("connected");
});

const Models = {
  Article: mongoose.model("Article", ArticleSchema),
  User: mongoose.model("User", UserSchema)
};

module.exports = Models;
