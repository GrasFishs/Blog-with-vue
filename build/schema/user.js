const mongoose = require("mongoose");
const path = require("path");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  nickname: {
    type: String,
    default: ""
  },
  avatarUrl: {
    type: String,
    default: path.join(__dirname, "logo.png")
  },
  description: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  QQ: {
    type: String,
    default: ""
  },
  wechat: {
    type: String,
    default: ""
  },
  phoneNumber: Number,
  registerYear: Number,
  registerMonth: Number,
  registerDay: Number,
  followers: [],
  followings: []
});

UserSchema.static("findUser", function(username, callback) {
  this.findOne(
    {
      username: username
    },
    callback
  );
});

UserSchema.static("register", function(username, password, callback) {
  //可以考虑使用 const isExitst = this.where('username').equals(username).exists();
  this.findOne(
    {
      username: username
    },
    (err, doc) => {
      if (err) {
        callback(err);
      }
      if (doc) {
        callback(new Error("Username is existed"));
      } else {
        if (password) {
          const now = new Date();
          const y = now.getFullYear();
          const m = now.getMonth() + 1;
          const d = now.getDate();
          this.create({
            username: username,
            password: password,
            registerYear: y,
            registerMonth: m,
            registerDay: d
          });
        } else {
          callback(new ReferenceError("Cannot find password"));
        }
      }
    }
  );
});

UserSchema.method("setAvatar", function(avatar, callback) {
  this.model("User")
    .update({ $set: { avatarUrl: avatar } })
    .exec(callback);
});

UserSchema.method("addFollower", function(username, callback) {
  const self = this;
  const model = this.model("User");
  //为 follower 添加 following
  model
    .where({ username: username })
    .update({
      $push: {
        followings: self.username
      }
    })
    .exec(callback);
  // 为 该对象 添加 follower
  model
    .where({ username: self.username })
    .update({
      $push: {
        followers: username
      }
    })
    .exec(callback);
});

module.exports = UserSchema;
