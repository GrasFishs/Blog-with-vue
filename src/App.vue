<template>
  <div id="app">
    <Navbar/>
    <div class="main">
      <transition :name="transitionName">
          <router-view class="child-view"/>
      </transition>
    </div>
    <ToTop />
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import ToTop from "./components/ToTop";
export default {
  components: {
    ToTop,
    Navbar
  },
  data() {
    return {
      transitionName: "slide-left"
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    }
  }
};
</script>

<style lang="scss" scoped>
.child-view {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
$stickyWidth: 250px;
$stickyHeight: 75px;
.main {
  padding: 10px;
}
@media screen and (min-width: 986px) {
  .main {
    margin-left: $stickyWidth;
  }
}

@media screen and (max-width: 986px) {
  .main {
    margin-top: $stickyHeight;
  }
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}
</style>