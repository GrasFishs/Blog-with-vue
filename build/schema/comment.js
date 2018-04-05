const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  articleId: String,
  username: String,
  email: String,
  date: Date,
  comment: String,
  likes: Number,
  cover: String
});

module.exports = CommentSchema;
