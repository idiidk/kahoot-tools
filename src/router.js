import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Options from "./views/Options.vue";
import Game from "./views/Game.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/game",
      name: "game",
      component: Game
    },
    {
      path: "/options",
      name: "options",
      component: Options
    }
  ]
});
