import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import ArticleList from "../components/ArticlesList.vue";
import Article from "../components/Article.vue";
import Admin from '../components/Admin.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/main"
    },
    {
      path: "/:tag",
      name: "ArticleList",
      component: ArticleList
    },
    {
      path: "/article/:tag/:id",
      name: "article",
      component: Article
    },
    {
      path:'/admin',
      name:'admin',
      component:Admin
    }
  ]
});
