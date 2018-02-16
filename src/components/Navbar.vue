<!--  -->
<template>
  <router-link to="/">
    <div class="info">
      <div class="title">{{title}}</div>
      <router-link :to="{name:'admin'}" class="avatar">
        <img src="../assets/grasfish.svg" alt="avatar">
      </router-link>
      <div class="other">
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  data() {
    return {
      title: "GrasFish"
    };
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
$stickyWidth: 250px;
$stickyHeight: 75px;
.info {
  font-size: 24px;
  color: #fff;

  .avatar {
    background: #fff;
    border-radius: 50%;
  }
}

@media screen and (min-width: 986px) {
  .info {
    background: rgba($color: #f6013f, $alpha: 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    position: fixed;
    top: 0;
    left: 0;
    width: $stickyWidth;
    height: 100%;

    .avatar {
      $length: 120px;
      width: $length;
      height: $length;
      border-radius: 50%;
      transition: 0.3s all ease;
      img {
        width: $length;
        height: $length;
      }
    }
  }
}

@media screen and (max-width: 986px) {
  .info {
    background: rgba($color: #f6013f, $alpha: 0.8);
    //box-shadow: 0 0 50px #f6013f;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $stickyHeight;

    .avatar {
      $length: 0.8 * $stickyHeight;
      width: $length;
      height: $length;
      img {
        width: $length;
        height: $length;
      }
    }
  }
}
</style>