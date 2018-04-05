// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./vuex/store";
import axios from "axios";
import { markdown } from "./directives/markdown";
import { formatDate } from "./filters/formatDate";
import "font-awesome/css/font-awesome.css";

import 'element-ui/lib/theme-chalk/index.css';
import { MessageBox, Message } from "element-ui";

Vue.config.productionTip = false;

Vue.use(MessageBox.name, MessageBox);
Vue.prototype.$http = axios;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // console.log(isEmptyObject(store.state.user))
    if (store.state.user.status === 1) {
      next();
    } else {
      next({
        path: "/login"
      });
    }
  } else {
    next();
  }
});
/* eslint-disable no-new */
const vm = new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
