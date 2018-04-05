<!-- 文章的细节 -->
<template>
  <div class="article">
    <div v-if="!loaded">
      <Loading/>
    </div>
    <div v-if="loaded">
      <h1 class="title">{{article.title}}</h1>
      <ul class="info">
        <li class="tag">
          <Tag :tag="article.tag" />
        </li>
        <li class="date">
          <i class="far fa-clock"></i>{{article.date |formatDate}}</li>
        <li class="like">
          <i class="far fa-heart"></i>({{article.like}})</li>
        <li class="view">
          <i class="fa fa-eye"></i>({{article.view}})</li>
        <li class="comment">
          <i class="fas fa-comments"></i>({{article.comment}})</li>
      </ul>
      <div class="content" v-markdown="'page'" v-html="content"></div>
      <div class="like-button" @click="like">
        <span>喜欢</span>
        <span :class="[likeState?'far fa-heart':'fa fa-heart']"></span>
        <span>({{article.like}})</span>
      </div>
      <div class="commentsList">
        <CommentsList :articleId="this.$route.params.id" />
      </div>
    </div>
  </div>
</template>

<script>
import marked from "marked";
import Loading from "./Loading";
import Tag from "./Tag";
import CommentsList from "./CommentsList";
export default {
  components: {
    Loading,
    Tag,
    CommentsList
  },
  data() {
    return {
      article: null,
      likeState: 0
    };
  },
  mounted() {
    /**当前页面 */
    const id = this.$route.params.id;
    this.fetchData(id);
  },
  computed: {
    content: function() {
      return marked(this.article.content);
    },
    loaded: function() {
      return this.article !== null;
    }
  },

  methods: {
    fetchData: function(id) {
      setTimeout(() => {
        const self = this;
        this.$http.get("/api/article/" + id).then(res => {
          self.article = res.data;
        });
      }, 500);
    },
    like: function() {
      const id = this.$route.params.id;
      if (this.likeState === 0) {
        this.article.like += 1;
        this.likeState = 1;
        this.$http.get("/api/like/" + id);
      } else if (this.likeState === 1) {
        this.article.like -= 1;
        this.likeState = 0;
        this.$http.get("/api/unlike/" + id);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.article {
  .title {
    margin: 10px 0px;
  }

  .info {
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px;
    padding: 0px;

    li {
      margin-right: 20px;

      &.date {
        color: rgb(94, 177, 224);
      }

      &.like {
        color: #ea6f5a;
      }

      &.view {
        color: gray;
      }
      &.comment{
        color: #35bbb4;
      }
    }
  }
  .like-button {
    margin: 0px auto;
    width: 150px;
    height: 50px;
    background: #f78585;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s all ease;

    &:hover {
      background: #ea6f5a;
    }
    & span {
      margin: 0px 5px;
    }
  }
}

.pageChange {
  display: flex;
  justify-content: space-between;

  $margin: 50px;
  .prev {
    margin-left: $margin;
  }
  .next {
    margin-right: $margin;
  }
}
</style>
