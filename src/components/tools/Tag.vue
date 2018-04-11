<!-- 标签复用 -->
<template>
    <router-link 
    :to="{name:'ArticleList',params:{tag:tag}}">
      <div class="tag" :style="{background:tagColor}">{{tag}}</div>
    </router-link>
</template>

<script>
const t = [
  "javscript",
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
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  computed: {
    tagColor: function() {
      let color = "#aaa";
      let tag = this.tag.toLowerCase();
      switch (tag) {
        case "javascript":
          color = "rgb(250,220,42)";
          break;
        case "react":
          color = "#61dafb";
          break;
        case "vue":
          color = "#42b983";
          break;
        case "css":
          color = "rgb(59,154,220)";
          break;
        case "html":
          color = "rgb(228,76,39)";
          break;
        case "angular":
          color = "rgb(230,42,57)";
          break;
        case "python":
          color = "rgb(59,120,167)";
          break;
        case "java":
          color = "rgb(230,111,0)";
          break;
        
      }
      return color;
    }
  }
};
</script>
<style lang='scss' scoped>
.tag {
  //background: #f6013f;
  color: #fff;
  padding: 4px 10px;
  display: inline-block;
}
</style>