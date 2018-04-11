import Vue from "vue";
import Router from "vue-router";
import { Article, ArticleList } from "../components/article";
import { Admin, Ediotr, Login } from "../components/admin";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/articles/main"
    },
    {
      path: "/articles/:tag",
      name: "ArticleList",
      component: ArticleList
    },
    {
      path: "/article/:tag/:id",
      name: "article",
      component: Article
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/admin/editor/",
      name: "editor",
      component: Ediotr,
      meta: {
        requireAuth: true
      }
    }
  ]
});

export default router;
