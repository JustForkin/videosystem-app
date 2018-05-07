<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <page-header />
    <router-view />
  </div>
</template>

<script>
import './assets/scss/spectre.scss'
import './assets/scss/spectre-exp.scss'
import './assets/scss/spectre-icons.scss'

import PageHeader from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    PageHeader
  }
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //margin-top: 60px;
}

// @import 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';

</style>
