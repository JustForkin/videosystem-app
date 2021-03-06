// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

// import Snackbar from '@/components/globals/Snackbar'

const InfiniteLoading = require('vue-infinite-loading');

Vue.config.productionTip = false

Vue.use(Vuetify, {
  theme: {
    accent: colors.red.accent3
  }
})

// Vue.component('snackbar', Snackbar)

sync(store, router)

export default {
  components: {
    InfiniteLoading
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  methods: {

  }
})
