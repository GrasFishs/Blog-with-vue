<!-- 到顶部 -->
<template>
  <transition name="show">
    <div class="top" @click.stop="scrolltoTop()">
      <div class="fas fa-angle-double-up"></div>
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
          scroll -= Math.floor(height / 10);
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
$len: 50px;
$pos: 20px;
.top {
  position: fixed;
  bottom: $pos;
  right: $pos;

  width: $len;
  height: $len;
  line-height: 50px;
  text-align: center;
  color: white;
  border-radius: 50%;
  transition: 0.5s all ease;
  background: rgba($color: #f6013f, $alpha: 0.2);

  &:hover {
    animation: bigger 0.5s;
    background: rgba($color: #f6013f, $alpha: 1);
    box-shadow: 0 0 20px #f6013f;
  }
}
@keyframes bigger {
  0% {
    bottom: $pos;
    right: $pos;
    width: $len;
    height: $len;
  }
  50% {
    $big: 1.2*$len;
    font-size: 1.2em;
    width: $big;
    height: $big;
    line-height: $big;
    bottom: $pos - ($big - $len)/2;
    right: $pos - ($big - $len)/2;
    box-shadow: 0 0 10px #f6013f;
  }
  100% {
    bottom: $pos;
    right: $pos;
    width: $len;
    height: $len;
  }
}
</style>