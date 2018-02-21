<!-- 管理界面拦截登录 -->
<template>
  <div class="login">
    <div class="inner">
      <h3>系统登录</h3>
      <input type="text" placeholder="username" v-model="name">
      <input type="password" placeholder="password" v-model="pwd">
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      pwd: "",
      error: ""
    };
  },
  computed: {},
  methods: {
    login() {
      if (this.name === "admin" && this.pwd === "gotoAnd123") {
        this.$store.state.user.status = 1;
        this.$router.push({ name: "admin" });
      } else {
        alert("账户密码不正确");
      }
    }
  }
};
</script>
<style lang='scss' scoped>
$stickyWidth: 250px;
$stickyHeight: 75px;
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .inner {
    width: 300px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    margin-top: -100px;

    input,button {
      background: #eee;
      box-sizing: border-box;
      border: none;
      margin: 10px;
      width: 250px;
      height: 35px;
      border-radius: 5px;
      padding: 10px;
      &:focus {
        outline: none;
      }
    }
    button{
      background: #f6013f;
      color: white;
    }
  }
}
@media screen and (min-width: 986px) {
  .login {
    left: $stickyWidth;
  }
}

@media screen and (max-width: 986px) {
  .login {
    top: $stickyHeight;
  }
}
</style>