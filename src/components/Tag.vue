<!-- 标签复用 -->
<template>
    <router-link 
    :to="{name:'ArticleList',params:{tag:tag}}">
      <div class="tag" :style="{background:tagColor}">{{tag}}</div>
    </router-link>
</template>

<script>
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
          color = "#f6013f";
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