const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: String,
  username: String,
  date: Date,
  likes: Number,
  views: Number,
  content: String,
  tag: String,
  cover: String,
  tag: String,
  draft: Boolean
});

module.exports = ArticleSchema;
