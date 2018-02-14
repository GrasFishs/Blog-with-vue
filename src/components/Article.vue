<!-- 文章的细节 -->
<template>
  <div>
      <div v-for="(item,index) of list" :key="index">
        <h1 class="title">{{item.title}}</h1>
        <ul class="info">
            <li class="date"><i class="far fa-clock"></i>{{item.date}}</li>
            <li class="like"><i class="far fa-heart"></i>({{item.like}})</li>
            <li class="view"><i class="fa fa-eye"></i>({{item.view}})</li>
        </ul>
        <div class="content" v-html="item.content" v-markdown="'page'"></div>
        <div class="like-button" @click="like">
          <span>喜欢</span>
          <span class="far fa-heart"></span>
          <span>({{item.like}})</span>
        </div>
      </div>
  </div>
</template>

<script>
import { markdown } from "../directives/markdown";
export default {
  data() {
    return {
      list: [],
      likeState: 0
    };
  },
  mounted() {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      const self = this;
      const id = this.$route.params.id;
      this.$http.get("/api/article/" + id).then(res => {
        self.list = [];
        self.list.push(res.data);
      });
    },
    like: function() {
      const self = this;
      const id = this.$route.params.id;
      if (this.likeState === 0) {
        this.list[0].like += 1;
        this.likeState = 1;
        this.$http.get("/api/like/" + id);
      } else if (this.likeState === 1) {
        this.list[0].like -= 1;
        this.likeState = 0;
        this.$http.get("/api/unlike/" + id);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
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
}

li {
  margin-right: 20px;
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
</style>
