<!-- 数字累增 -->
<template>
  <span ref="countup"></span>
</template>

<script>
import CountUp from "countup.js";
export default {
  props: {
    start: {
      type: Number,
      default: 0
    },
    end: {
      type: Number,
      default: 2018
    },
    decimal: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 2.5
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      numAnim: null
    };
  },
  mounted() {
    this.initCountUp();
    const that = this;
    setTimeout(() => {
      that.numAnim.update(this.end);
    }, 50);
  },

  methods: {
    initCountUp() {
      this.numAnim = new CountUp(
        this.$refs.countup,
        this.start,
        this.end,
        this.decimal,
        this.duration,
        this.options
      );
    }
  }
};
</script>
<style lang='scss' scoped>

</style>