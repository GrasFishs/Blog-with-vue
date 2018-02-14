<template>
  <div id="app">
    <Navbar/>
    <div class="main">
      <router-view/>
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
  }
};
</script>

<style lang="scss" scoped>
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
</style>