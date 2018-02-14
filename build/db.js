const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog2");

const articleSchema = new mongoose.Schema({
  title: String,
  date: Date,
  like: Number,
  view: Number,
  content: String,
  tag: String
});

const Models = {
  Article: mongoose.model("Article", articleSchema)
};

module.exports = Models;
