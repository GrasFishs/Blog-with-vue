<!--  -->
<template>
  <div class="tagList">
    <span class="tag" v-for="tag of tags" :key="tag">
      <Tag :tag="tag" />
    </span>
  </div>
</template>

<script>
import Tag from "./Tag";
export default {
  components: {
    Tag
  },
  created() {
    this.$http.get("/api/articleList").then(res => {
      const articleTags = [];
      res.data.forEach(article => {
        articleTags.push(article.tag);
      });
      const tagSets = new Set(articleTags);
      this.tags = [...tagSets]; //集合转数组
    });
  },
  data() {
    return {
      tags: []
    };
  }
};
</script>
<style lang='scss' scoped>
.tagList {
  margin: 10px;
}
.tag {
  margin-right: 10px;
  &:last-child {
    margin-right: 0px;
  }
}
</style>