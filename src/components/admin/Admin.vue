<!-- 管理界面 -->
<template>
  <div class="admin">
    <div class="data">
      <div class="card">
        <div class="likes">
          <i class="fas fa-heart"></i>
          <Countup :end="likes" :duration="4" />
        </div>
      </div>
      <div class="card">
        <div class="views">
          <i class="fa fa-eye"></i>
          <Countup :end="views" :duration="5" />
        </div>
      </div>
      <div class="card">
        <div class="comments">
          <i class="fas fa-comments"></i>
          <Countup :end="comments" :duration="5" />
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>标题</th>
          <th>标签</th>
          <th>日期</th>
          <th>点赞</th>
          <th>访问量</th>
          <th>评论量</th>
          <th>编辑</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article,i) of articles" :key="i">
          <td>
            <router-link class="title" :to="{
              name:'article',
              params:{
                tag:article.tag,
                id:article._id,
              }}">
              {{article.title}}
            </router-link>
          </td>
          <td>
            <Tag :tag="article.tag" />
          </td>
          <td>{{article.date|formatDate}}</td>
          <td>{{article.like}}</td>
          <td>{{article.view}}</td>
          <td>{{article.comment}}</td>
          <td>
            <div @click="edit(article)" style="color:rgb(59, 120, 167);">
              <i class="fas fa-pencil-alt"></i>
            </div>
          </td>
          <td>
            <div @click="remove(article._id)" style="color:rgb(230, 42, 57);">
              <i class="fas fa-trash-alt"></i>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <div class="addArticle">
              <button @click="addArticle">添加文章</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Tag from "../tools/Tag";
import Countup from "../tools/Countup";
export default {
  data() {
    return {
      articles: []
    };
  },
  components: {
    Tag,
    Countup
  },
  computed: {
    likes: function() {
      if (this.articles.length !== 0) {
        return this.articles
          .map(i => i.like)
          .reduce((total, cur) => total + cur);
      } else {
        return 0;
      }
    },
    views: function() {
      if (this.articles.length !== 0) {
        return this.articles
          .map(i => i.view)
          .reduce((total, cur) => total + cur);
      } else {
        return 0;
      }
    },
    comments: function() {
      if (this.articles.length !== 0) {
        return this.articles
          .map(i => i.comment)
          .reduce((total, cur) => total + cur);
      } else {
        return 0;
      }
    }
  },
  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.$http.get("/api/articleList").then(res => {
        this.articles = res.data;
      });
    },
    edit(article) {
      this.$store.state.article = article;
      this.$router.push({ name: "editor" });
    },
    addArticle() {
      this.$store.state.article = {};
      this.$router.push({ name: "editor" });
    },
    remove(id) {
      this.$confirm("确定删除本文章吗？", "警告", {
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$http.get("/api/remove/" + id).then(res => {
            this.fetchData();
            this.$message({
              type: "success",
              message: `删除成功！`
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.data {
  display: flex;
  flex-direction: row;
  .card {
    width: 50%;
    height: 175px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .likes {
      color: #f6013f;
    }
    .views {
      color: rgb(59, 120, 167);
    }
    .comments {
      color: #35bbb4;
    }
    .views,
    .likes,
    .comments {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 2em;
    }
  }
}

.addArticle {
  button {
    background: #f6013f;
    width: 100px;
    height: 50px;
    border: none;
    transition: 0.5s all cubic-bezier(0.9, -0.35, 0.29, 1.54);
    line-height: 50px;
    text-align: center;
    color: white;
    text-overflow: ellipsis;

    &:hover {
      border-radius: 25%/50%;
    }

    &:focus {
      outline: none;
    }
  }
}
table,
table tr th,
table tr td {
  border: 1px solid rgba(246, 1, 63, 0.2);
}
table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  tr {
    cursor: pointer;
  }
  thead {
    background: #f6013f;
    color: white;
    th {
      padding: 10px;
    }
  }
  tbody {
    tr {
      transition: 0.1s all ease;
      &:hover {
        background: rgba(246, 1, 63, 0.2);
        color: white;
      }

      td {
        padding: 5px 10px;
      }
    }
  }
}
</style>