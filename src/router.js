import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Options from './views/Options.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'login',
    component: Login
  }, {
    path: '/options',
    name: 'options',
    component: Options
  }, ]
})