<!-- 编辑 -->
<template>
  <div class="admin">
    <div class="info">
      <div class="title">
        <input type="text" v-model="title" v-focus>
      </div>
      <div class="tag">
        <label>Tag</label><input type="text" v-model="tag">
      </div>
      <div class="save">
        <button @click="save">提交</button>
      </div>
    </div>
    <div class="content">
      <textarea class="edit" v-model="content"></textarea>
      <div class="show" v-html="markdown"></div>
    </div>
    <div class="state">{{state}}</div>
  </div>
</template>

<script>
import marked from "marked";
export default {
  data() {
    return {
      title: new Date().toLocaleDateString(),
      tag: "",
      content: "",
      state: "",
      w: ""
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  computed: {
    markdown: function() {
      return marked(this.content);
    },
    wordCount: function() {
      return this.content.replace(/(\s|\*|\>|\#|)/gi, "").length || 0;
    }
  },
  methods: {
    save: function() {
      let self = this;
      if (!this.title || !this.content) {
        alert("不能为空");
      }
      const postarticle = {
        title: this.title,
        content: this.content,
        tag: this.tag || "other",
        date: new Date(),
        like: 0,
        view: 0
      };
      this.$http
        .post("/api/saveArticle", {
          article: postarticle
        })
        .then(res => {
          self.state = res.data;
        });
    }
  }
};
</script>
<style lang='scss' scoped>
textarea {
  font-family: "Monaco", courier, monospace;
  border: none;
  resize: none;
  outline: none;
  color: #f6f6f6;
  background-color: #272822;
  font-size: 14px;
  padding: 20px;
}
.admin {
  padding: 10px;
  .info {
    .title {
      width: 80%;
      input {
        width: 100%;
        height: 35px;
        font-size: 1.5em;
        border: none;
        padding: 10px;
        background: white;
        border: 1px solid #ccc;
        color: #555;
        transition: 0.25s all ease;
        &:focus {
          outline: none;
        }
      }
    }
  }
  .content {
    //border: 1px solid black;
    height: 600px;
    .edit,
    .show {
      display: inline-block;
      width: 49%;
      height: 100%;
      vertical-align: top;
      box-sizing: border-box;
      overflow: auto;
    }
  }
}
</style>