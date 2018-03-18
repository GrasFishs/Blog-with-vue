import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import ArticleList from "../components/ArticlesList.vue";
import Article from "../components/Article.vue";
import Admin from "../components/Admin.vue";
import Ediotr from "../components/Editor.vue";
import Login from "../components/Login.vue";

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
      path: "/admin/editor/:id",
      name: "editorWithId",
      component: Ediotr,
      meta: {
        requireAuth: true,
      }
    }
  ]
});

export default router;
