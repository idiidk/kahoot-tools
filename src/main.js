import Vue from "vue"
import VueMaterial from "vue-material"
import App from "./App.vue"
import router from "./router"
import "./registerServiceWorker"

import "vue-material/dist/vue-material.min.css"
import "vue-material/dist/theme/default-dark.css"

export const store = new Vue({
  data: {
    session: null
  }
})

Vue.prototype.$globals = store
Vue.config.productionTip = false

Vue.use(VueMaterial)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")