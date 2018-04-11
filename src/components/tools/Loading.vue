<!-- 数据预加载等待 -->
<template>
  <div class="not-load">
    <div class="loading">
      <span v-for="i of length" :key="i"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      length: new Array(8)
    };
  }
};
</script>
<style lang='scss' scoped>
$len: 8;
.not-load {
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 50%;
  right: 0;
}
.loading {
  position: relative;
  span {
    display: block;
    bottom: 0px;
    width: 9px;
    height: 5px;
    background: #9b59b6;
    position: absolute;
    animation: loading 1.5s infinite ease-in-out;
    @for $i from 2 through $len {
      &:nth-child(#{$i}) {
        left: 11px * ($i - 1);
        animation-delay: 0.1s *$i;
      }
    }
  }
}
@keyframes loading {
  0% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
  25% {
    height: 30px;
    transform: translateY(15px);
    background: #f6013f;
  }
  50% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
  100% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
}
</style>