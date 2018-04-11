<!-- 评论 -->
<template>
  <div>
    <Comment @comment="pushComment" />
    <div class="comments">
      <div>({{comments.length}})个评论</div>
      <transition-group name="list">
        <div class="comment" v-for="c of comments" :key="c._id">
          <div class="left">
            <div class="cover">
            </div>
            <div class="username">{{c.username}}</div>
          </div>
          <div class="right">
            <div class="content">{{c.comment}}</div>
            <div class="bottom">
              <div class="date">
                <i class="far fa-clock"></i>{{c.date | formatDate}}</div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Comment from "./Comment";
export default {
  props: {
    articleId: {
      type: String
    }
  },
  components: {
    Comment
  },
  data() {
    return {
      comments: []
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    fetchComments: function() {
      const id = this.$route.params.id;
      setTimeout(() => {
        this.$http.get("/api/comments/" + id).then(res => {
          this.comments = res.data.reverse();
        });
      }, 500);
    },
    pushComment(cmt) {
      this.comments.unshift(cmt);
      this.fetchComments();
    }
  }
};
</script>
<style lang='scss' scoped>
.comments {
  margin: 10px;
  color: gray;
  .list-move {
    transition: all 0.5s ease;
  }
  .list-enter {
    opacity: 0;
    transform: translateY(-30px);
  }
  .comment {
    margin-bottom: 20px;
    padding: 15px;
    border-bottom: 1px #d3d3d3 solid;
    display: flex;
    transition: all 0.5s;
    .left {
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .cover {
        width: 50px;
        height: 50px;
        background: gray;
        border: 1px solid gray;
        margin-bottom: 5px;
      }
    }
    .right {
      flex: 1;
      margin-left: 10px;
      .content {
        $borderWidth: 8px;
        $padding: 20px;
        background: #eee;
        padding: $padding;
        border: 1px solid #d3d3d3;
        position: relative;
        &::after {
          position: absolute;
          border-width: $borderWidth;
          border-style: solid;
          border-color: transparent #eee transparent transparent;
          top: $padding;
          left: -$borderWidth * 2;
          content: "";
        }
        &::before {
          position: absolute;
          border-width: $borderWidth;
          border-style: solid;
          border-color: transparent #d3d3d3 transparent transparent;
          top: $padding;
          left: - $borderWidth * 2 - 1px; //多偏移一个像素
          content: "";
        }
      }
      .bottom {
        display: flex;
        margin-top: 10px;
        div {
          margin-right: 10px;
        }
        .like {
          color: #ea6f5a;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
@media screen and (max-width: 768px) {
  .bottom {
    flex-direction: column;
  }
}
@media screen and (min-width: 768px) {
  .bottom {
    flex-direction: row;
  }
}
</style>