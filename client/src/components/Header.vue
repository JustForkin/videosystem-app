<template>
  <v-toolbar>
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
    <v-btn
      large
      flat
      icon
      color="accent"
      to="/">
      <v-icon>ondemand_video</v-icon>
    </v-btn>
    <v-toolbar-title class="hidden-sm-and-down">Videosystem App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="">
      <!-- Login button -->
      <v-btn
        v-if="!isUserLoggedIn"
        :to="{name: 'Login'}"
        flat>Login</v-btn>
      <!-- Sign Up Button -->
      <v-btn
        v-if="!isUserLoggedIn"
        :to="{name: 'SignUp'}"
        flat>Sign Up</v-btn>
      <!-- Admin account Label -->
      <div
        v-if="isAdmin && isUserLoggedIn"
        style="margin: auto;"
        class="text-xs-center">
        <v-chip small outline color="accent">
          <v-icon left>build</v-icon>Admin account
        </v-chip>
      </div>
      <!-- Upload button -->
      <v-btn
        v-if="isUserLoggedIn && !isAdmin"
        :to="{name: 'Upload'}"
        flat>
        Upload</v-btn>
      <!-- Log Out Button -->
      <v-btn
        v-if="isUserLoggedIn"
        @click="logout"
        flat>Log Out</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import {mapState} from 'vuex'

export default {
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)

      // redirect to homepage
      this.$router.push({
        name: 'Start'
      })
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'isAdmin'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar{
  padding-bottom: 5px;
  padding-top: 5px;
}
</style>
