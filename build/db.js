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
//Models.User.register('GrasFish','gotoAnd123');
let grasfish = {};
Models.User.findUser("robot1", (err, doc) => {
  //doc.addFollower("robot1", (e, d) => console.log(e, d));
});


module.exports = Models;
