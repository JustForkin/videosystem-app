<template>
  <div id="app">
    <v-app>
      <page-header />
      <snackbar />
      <main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
// import './assets/scss/spectre.scss'
// import './assets/scss/spectre-exp.scss'
// import './assets/scss/spectre-icons.scss'

import PageHeader from '@/components/Header.vue'
import Snackbar from '@/components/Snackbar.vue'

export default {
  name: 'App',
  components: {
    PageHeader,
    Snackbar
  }
}
</script>

<style>
/* for vuetify */
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
@import url('https://fonts.googleapis.com/css?family=Comfortaa');
@import url('https://unpkg.com/vuetify/dist/vuetify.min.css');

#app {
  font-family: 'Comfortaa', 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
