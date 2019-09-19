import Vue from "vue";
import Noty from "noty";
import App from "./App.vue";
import router from "./router";
import vuetify from "@/plugins/vuetify";
import config from "../config.json";
import "./registerServiceWorker";

export const Globals = new Vue({
  data: {
    pin: null,
    session: null,
    mainSocket: null,
    dark: localStorage.getItem("dark") === "true" || false,
    players: []
  },
  methods: {
    notify: function(text, type) {
      new Noty({
        text: text,
        timeout: 2000,
        layout: "topRight",
        type: type
      }).show();
    }
  }
});

export const Config = config;

Vue.prototype.$globals = Globals;
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
