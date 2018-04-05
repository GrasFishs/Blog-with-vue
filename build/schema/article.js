const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: String,
  username: String,
  date: Date,
  like: Number,
  view: Number,
  comment:Number,
  content: String,
  tag: String,
  cover: String
});

module.exports = ArticleSchema;
