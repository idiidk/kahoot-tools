import Vue from "vue";
import Vuetify from "vuetify";
import colors from "vuetify/es5/util/colors";
import config from "../config.json";

import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import "vuetify/dist/vuetify.min.css";

export const Store = new Vue({
  data: {
    pin: null,
    session: null,
    mainSocket: null,
    theme: localStorage.getItem("theme") || "light",
    players: []
  }
});

export const Config = config;

Vue.prototype.$globals = Store;
Vue.config.productionTip = false;
Vue.use(Vuetify, {
  theme: {
    primary: colors.indigo.darken1,
    secondary: colors.indigo,
    accent: colors.indigo.base
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
