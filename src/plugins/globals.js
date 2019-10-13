export default {
  install(Vue) {
    Vue.component();

    const Globals = new Vue({
      data: {
        options: {
          dark: false,
          selectOnAdd: true
        },
        notification: {
          text: "",
          type: "",
          active: false
        }
      },
      methods: {
        notify: function(text, type) {
          this.notification.text = text;
          this.notification.type = type;
          this.notification.active = true;
        }
      },
      watch: {
        options: {
          handler() {
            localStorage.setItem("options", JSON.stringify(this.options));
          },
          deep: true
        }
      }
    });

    Vue.prototype.$globals = Globals;
  }
};
