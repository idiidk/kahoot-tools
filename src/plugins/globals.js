import Noty from "noty";

export default {
  install(Vue) {
    const Globals = new Vue({
      data: {
        dark: localStorage.getItem("dark") === "true" || false
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

    Vue.prototype.$globals = Globals;
  }
};
