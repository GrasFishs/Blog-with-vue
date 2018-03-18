<!-- 编辑 -->
<template>
  <div class="admin">
    <div class="info">
      <div class="title">
        <input type="text" v-model="title" v-focus>
      </div>
      <div class="tagSelector">
        <div class="tag" v-for="tag of tags" :key="tag.name" :class="tag.select?'select':''" @click="select(tag)">
          {{tag.name}}
        </div>
      </div>
    </div>
    <div class="content">
      <textarea class="edit" v-model="content" ref="area"></textarea>
      <div class="show" v-html="markdown"></div>
    </div>
    <div class="save">
      <button @click="save">提交</button>
    </div>
    <div class="state">{{state}}</div>
  </div>
</template>

<script>
import marked from "marked";
import Tag from "./Tag";

const tagsList = [
  "javascript",
  "react",
  "vue",
  "css",
  "html",
  "python",
  "angular",
  "java",
  "other"
];
export default {
  components: {
    Tag
  },
  created() {
    this.tags = tagsList.map(tag => {
      if (this.$store.state.article) {
        if (tag === this.$store.state.article.tag) {
          return {
            name: tag,
            select: true
          };
        } else {
          return { name: tag, select: false };
        }
      } else {
        if (tag === "other") {
          return {
            name: tag,
            select: true
          };
        } else {
          return { name: tag, select: false };
        }
      }
    });
  },
  mounted() {
    const area = this.$refs.area;
    const self = this;

    area.addEventListener("paste", function(e) {
      // 通过获取选择的范围，插入图片
      const selection = area.selectionStart;
      // 剪贴板事件
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const key in items) {
        const item = items[key];
        const type = item.type;
        // 剪贴的类型是否为 image
        if (type && type.split("/")[0] === "image") {
          const imgSuffix = type.split("/")[1]; //图片后缀
          const file = item.getAsFile(); //获取base64的图片格式
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(event) {
            const base64 = event.currentTarget.result;
            const imgName =
              base64
                .split("base64,")[1]
                .replace(/\W/gi, "")
                .slice(-20) +
              "." +
              imgSuffix; //采取倒数20的字符
            let form = new FormData();
            form.append("image", file, imgName);
            self
              .$http({
                url: "/upload",
                method: "post",
                data: form,
                headers: { "Content-Type": "multipart/form-data" }
              })
              .then(res => {
                const img = `![image.${imgSuffix}](${res.data})`;
                self.content =
                  self.content.slice(0, selection) +
                  img +
                  self.content.slice(selection);
              });
          };
        }
      }
    });
  },
  data() {
    return {
      tags: [],
      title: this.$store.state.article.title || new Date().toLocaleDateString(),
      tag: this.$store.state.article.tag || "other",
      content: this.$store.state.article.content || "",
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
      // todo 还需改善
      return this.content.replace(/(\s|\*|\>|\#|)/gi, "").length || 0;
    }
  },
  methods: {
    save: function() {
      let self = this;
      if (!this.title || !this.content) {
        alert("不能为空");
        return;
      }
      const postarticle = {
        title: this.title,
        content: this.content,
        tag: this.tag,
        date: this.$store.state.article.date || new Date(),
        like: 0,
        view: 0,
        cover: this.getCover(this.content)
      };
      this.$http
        .post("/api/saveArticle", {
          article: postarticle
        })
        .then(res => {
          self.state = res.data; //return 'OK'
        });
    },
    select: function(tag) {
      this.tag = tag.name;
      const newTags = [];
      for (const i_tag of tagsList) {
        if (i_tag === tag.name) {
          newTags.push({
            name: i_tag,
            select: true
          });
        } else {
          newTags.push({
            name: i_tag,
            select: false
          });
        }
      }
      this.tags = newTags;
    },
    getCover: function(content) {
      let div = document.createElement("div");
      if (typeof content === "string") {
        div.innerHTML = marked(content);
      }
      let cover = div.querySelector("img").getAttribute("src");
      return cover;
    }
  },
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
        padding: 10px;
        background: white;
        border: 1px solid #ccc;
        color: #555;
        transition: 0.25s all ease;
        &:focus {
          outline: none;
          border: 1px solid lightblue;
          box-shadow: 0 0 5px lightblue;
        }
      }
    }
    .tagSelector {
      .tag {
        display: inline-block;
        background: #eee;
        color: #ffb5c7;
        transition: 0.2s all ease;
        box-sizing: content-box;
        margin: 5px;
        padding: 10px 20px;
        cursor: pointer;
        &:first-child {
          margin-left: 0px;
        }
        &:hover {
          //transform: scale(1.1);
          transform: translateY(-5%);
          background: #f6013f;
          color: #eee;
        }
        &.select {
          background: #f6013f;
          color: #eee;
        }
      }
    }
  }
  .content {
    border: 1px solid #eee;
    height: 600px;
    .edit,
    .show {
      display: inline-block;
      width: 49%;
      height: 100%;
      vertical-align: top;
      box-sizing: border-box;
      padding: 20px;
      overflow-wrap: break-word;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;

        &-thumb {
          background: rgba($color: #f6013f, $alpha: 0.8);
        }
        &-track {
          background: rgba($color: #f6013f, $alpha: 0.2);
        }
      }
    }
  }
  .save {
    button {
      background: #f6013f;
      width: 50px;
      height: 50px;
      border: none;
      //border-radius: 50%;
      transition: 0.5s all cubic-bezier(0.9, -0.35, 0.29, 1.54);
      line-height: 50px;
      text-align: center;
      color: white;
      text-overflow: ellipsis;

      &:hover {
        width: 200px;
        border-radius: 12.5%/50%;
      }

      &:focus {
        outline: none;
      }
    }
  }
}
</style>