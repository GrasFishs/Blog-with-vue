<template>
  <div class="articles">
    <TagList/>
    <div class="page" 
        v-for="article of articles"
        :key="article._id">
        <div class="header">
          <router-link class="title"
            :to="{
              name:'article',
              params:{
                tag:article.tag,
                id:article._id,
              }}">
            {{article.title}}
          </router-link>
          <Tag :tag="article.tag"/>
        </div>
        <div class="body">
          <div class="content" v-html="article.content"></div>
        </div>
        <div class="footer">
          <div class="date"><i class="icon far fa-clock"></i>{{article.date}}</div>
          <div class="like"><i class="icon far fa-heart"></i>{{article.like}}</div>
          <div class="view"><i class="icon fa fa-eye"></i>{{article.view}}</div>
        </div>
    </div>
  </div>
</template>

<script>
import Tag from "./Tag";
import TagList from "./TagList";
export default {
  components: {
    Tag,
    TagList
  },
  data() {
    return {
      articles: []
    };
  },
  watch: {
    $route(to, from) {
      this.get();
      this.getAll();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  },
  methods: {
    save: function() {
      let self = this;
      const article = {
        title: this.title,
        content: this.content,
        date: new Date(),
        like: 0,
        view: 0
      };
      this.$http
        .post("/api/saveArticle", {
          article: article
        })
        .then(res => {
          self.state = res.data;
        });
    },
    get: function() {
      const self = this;
      let tag = this.$route.params.tag;
      if (tag === "main") {
        this.$http.get("/api/articleList").then(res => {
          self.articles = res.data;
        });
      } else {
        this.$http.get("/api/articleList/" + tag).then(res => {
          self.articles = res.data;
        });
      }
    }
  },
  mounted() {
    this.get();
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 200px;
  box-sizing: border-box;
  padding: 10px 20px;
  transition: 0.5s all ease;
  //border-bottom: 1px solid #f6013f;
  border-left: 5px solid #ffffff;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0px;
  }

  &:hover {
    border-left: 15px solid #f6013f;
    //border-bottom: 1px solid #ffffff;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 1.5em;
    }

    .tag {
      //background: #f6013f;
      color: #fff;
      padding: 4px 10px;
    }
  }
  .body {
    .content {
      /*缩进*/
      text-indent: 22px;
      /*显示三行内容，多余的用...替代*/
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      color: #2c3e50;
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;

    div {
      margin-left: 20px;
      &:first {
        margin-left: 0px;
      }
    }

    .icon {
      font-size: 1.2em;
      margin-right: 5px;
    }
    .date {
      color: rgb(94, 177, 224);
    }

    .like {
      color: #ea6f5a;
    }

    .view {
      color: gray;
    }
  }
}
</style>
