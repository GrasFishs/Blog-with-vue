<!-- 评论 -->
<template>
  <div class="comment">
    <div class="body">
      <div class="user">发表你的评论</div>
      <div class="input-area">
        <textarea v-model="content" placeholder="说点什么吧…" @click="show=true" :style="{height:show?'100px':'50px',boxShadow:show?'0 0 10px #f78585':'0 0 10px lightgray'}"></textarea>
        <div class="submit">
          <button @click="submit">提交评论</button>
        </div>
      </div>
      <transition name="fadeTo">
        <div class="form" v-show="show">
          <div class="left">请完成身份认证</div>
          <div class="right">
            <input type="text" placeholder="昵称" v-model="username">必填
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      content: "",
      show: false,
      username: ""
    };
  },
  methods: {
    submit() {
      if (this.content === "") {
        this.$message.error("评论不能为空哦");
      }
      if (this.username === "") {
        this.$message.error("请提交昵称");
      }
      if (this.content !== "" && this.username !== "") {
        let comment = {
          articleId: this.$route.params.id,
          username: this.username,
          date: new Date(),
          comment: this.content,
          likes: 0,
          cover: ""
        };
        this.content = "";
        this.username = "";
        this.$http
          .post("/api/saveComment", {
            comment: comment
          })
          .then(res => {
            this.$message({
              message: '提交评论成功！',
              type: "success"
            });
            console.log(res.data);
          });
        this.$emit("comment", comment);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.comment {
  margin-top: 20px;
  .body {
    padding: 30px;
    color: #272822;
    .user {
      font-size: 1.5em;
      color: gray;
      padding-left: 10px;
      border-left: 10px gray solid;
    }
    .input-area {
      margin-top: 20px;
      textarea {
        width: 100%;
        height: 50px;
        transition: all 0.5s ease;
        border: none;
        resize: none;
        outline: none;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0 0 10px lightgray;
        border-radius: 10px;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .submit {
        display: flex;
        justify-content: flex-start;
        button {
          margin: 0px auto;
          width: 80px;
          height: 35px;
          border: none;
          outline: none;
          background: #60eba5;
          color: white;
          transition: 0.2s all ease;
          &:hover {
            background: #35bbb4;
          }
        }
      }
    }
    .form {
      margin-top: 10px;
      text-align: center;
      color: #272822;
      font-size: 14px;
      display: flex;
      .left {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 20px;
        height: 80px;
        border-right: 1px solid lightgray;
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        input {
          display: block;
          padding: 2px;
          margin-right: 5px;
        }
      }
    }
  }
}

.fadeTo-enter-active,
.fadeTo-leave-active {
  transition: opacity 0.5s;
}
.fadeTo-enter,
.fadeTo-leave-to {
  opacity: 0;
  height: 0;
}
</style>