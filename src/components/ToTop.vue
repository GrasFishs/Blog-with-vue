<!-- 到顶部 -->
<template>
  <transition name="show">
    <div class="top" @click.stop="scrolltoTop()">
      <div class="fas fa-arrow-up"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: "none"
    };
  },
  methods: {
    scrolltoTop() {
      let scroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      let height =
        document.body.scrollTop || document.documentElement.scrollTop;
      let id = setInterval(() => {
        if (scroll > 0) {
          scroll -= Math.floor(height / 6);
          document.body.scrollTop = scroll;
          document.documentElement.scrollTop = scroll;
        } else {
          clearInterval(id);
        }
      }, 20);
    }
  }
};
</script>
<style lang='scss' scoped>
.top {
  position: fixed;
  bottom: 20px;
  right: 20px;

  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: white;
  border-radius: 50%;
  transition: 0.3s all ease;
  background: rgba($color: #f6013f, $alpha: 1);

  &:hover {
    font-size: 1.5em;
    background: rgba($color: #f6013f, $alpha: 1);
    box-shadow: 0 0 20px #f6013f;
  }
}
</style>