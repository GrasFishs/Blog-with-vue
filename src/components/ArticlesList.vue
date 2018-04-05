<template>
  <div class="articles">
    <TagList/>
    <div class="not-load" v-if="!loaded">
      <Loading/>
    </div>
    <div v-if="loaded">
      <div class="page" v-for="article of articles" :key="article._id" v-if="!article.draft">
        <div class="left">
          <div class="header">
            <router-link class="title" :to="{
              name:'article',
              params:{
                tag:article.tag,
                id:article._id,
              }}">
              {{article.title}}
            </router-link>
          </div>
          <div class="body">
            <div class="content" v-markdown="'card'">{{article.content}}</div>
          </div>
          <div class="footer">
            <div class="tag">
              {{article.tag}}
            </div>
            <div class="date">
              <i class="icon far fa-clock"></i>{{article.date | formatDate}}</div>
            <div class="like">
              <i class="icon far fa-heart"></i>{{article.like}}</div>
            <div class="view">
              <i class="icon fa fa-eye"></i>{{article.view}}</div>
            <div class="comment">
              <i class="fas fa-comments"></i>{{article.comment}}</div>
          </div>
        </div>
        <div class="right" v-if="article.cover">
          <img class="responsive" :src="article.cover" />
        </div>
      </div>
      <transition name="load-more">
        <div class="more" v-if="isLoaded">
          <div class="load" @click="fetchData">加载更多</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Tag from "./Tag";
import TagList from "./TagList";
import Loading from "./Loading";
export default {
  components: {
    Tag,
    TagList,
    Loading
  },
  data() {
    return {
      articles: [],
      noArticles: false,
      oldLength: 0,
      page: 0
    };
  },
  computed: {
    loaded: function() {
      const currentLength = this.articles.length;
      if (this.oldLength !== currentLength && !this.noArticles) {
        this.oldLength = currentLength;
        return true;
      } else {
        return this.noArticles ? true : false;
      }
    },
    isLoaded: function() {
      return this.articles.length >= 3 ? true : false;
    }
  },
  watch: {
    $route(to, from) {
      this.articles = [];
      this.page = 0;
      this.noArticles = false;
      this.fetchData();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  },
  methods: {
    fetchData: function() {
      const self = this;
      let tag = this.$route.params.tag;
      if (tag === "main") {
        this.$http.post("/api/articleList", { page: this.page }).then(res => {
          if (res.data.length > 0) {
            self.articles = self.articles.concat(res.data);
          } else {
            self.noArticles = true;
          }
        });
      } else {
        this.$http
          .post("/api/articleList/" + tag, { page: this.page })
          .then(res => {
            if (res.data.length > 0) {
              self.articles = self.articles.concat(res.data);
            } else {
              self.noArticles = true;
            }
          });
      }
      this.page++;
    },
    formatDate: function(date) {
      return new Date(date);
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 200px;
  box-sizing: border-box;
  padding: 10px 10px;
  transition: 0.5s all ease;
  //border-left: 5px solid #ffffff;
  margin-bottom: 15px;
  border-bottom: 1px solid #f6013e7a;
  &:last-child {
    margin-bottom: 0px;
  }

  // &:hover {
  //   border-left: 15px solid #f6013f;
  // }

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 1.2em;
        text-overflow: ellipsis;
        word-wrap: break-word;
      }
    }
    .body {
      .content {
        /*缩进*/
        text-indent: 22px;
        /*显示三行内容，多余的用...替代*/
        overflow: hidden;
        display: -webkit-box;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
        color: #2c3e50;

        &::selection {
          background: #f6013f;
          color: white;
        }
      }
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      div {
        margin-left: 20px;
        &:first-child {
          margin-left: 0px;
        }
      }

      @media screen and (min-width: 968px) {
        .icon {
          font-size: 1.2em;
          margin-right: 5px;
        }
      }
      @media screen and (max-width: 968px) {
        .icon {
          font-size: 0.8em;
          margin-right: 5px;
        }
      }

      .tag {
        color: #ea6f5a;
        transition: 0.5s all ease;
        box-sizing: border-box;
        border: 1px #ea6f5a solid;
        padding: 2px 5px;
        cursor: pointer;
        &:hover {
          color: #b95746;
        }
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
      .comment{
        color: #35bbb4;
      }
    }
  }
  @media screen and (min-width: 968px) {
    .right {
      width: 180px;
      height: 180px;
      overflow: hidden;
      .responsive {
        max-height: 100%;
      }
    }
  }
  @media screen and (max-width: 968px) {
    .right {
      display: none;
    }
  }
}
.more {
  text-align: center;
  display: inline-block;
  display: flex;
  justify-content: center;
  .load {
    background: #f6013f;
    color: #fff;
    padding: 10px 15px;
  }
}

.load-more-enter-active {
  transition: all 1s;
}
.load-more-enter {
  opacity: 0;
  transform: translateY(100%);
}
</style>
