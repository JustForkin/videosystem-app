<template>
  <v-toolbar>
    <v-btn
      large
      flat
      icon
      color="accent"
      to="/">
      <v-icon>ondemand_video</v-icon>
    </v-btn>
    <v-toolbar-title class="hidden-sm-and-down mr-2">Videosystem App</v-toolbar-title>
    <v-toolbar-items class="">
    <!-- Users button -->
    <v-btn
      :to="{name: 'Users'}"
      flat>
      <v-icon>supervised_user_circle</v-icon>
      Users</v-btn>
    </v-toolbar-items>
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
          <v-icon left>build</v-icon>{{user.username}}
        </v-chip>
      </div>

      <!-- User account Label -->
      <div
        v-if="!isAdmin && isUserLoggedIn"
        style="margin: auto;"
        class="text-xs-center">
        <v-chip
          small outline color="accent">
          <v-icon left>perm_identity</v-icon>{{user.username}}
        </v-chip>
      </div>

      <!-- My Profile button -->
      <v-btn
        v-if="isUserLoggedIn"
        :to="{name: 'MyProfile'}"
        flat>
        <v-icon class="mr-1">settings</v-icon>
        Me</v-btn>

      <!-- Upload button -->
      <v-btn
        v-if="isUserLoggedIn && !isAdmin"
        :to="{name: 'Upload'}"
        flat>
        <!-- <v-icon class="mr-1">backup</v-icon> -->
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

      this.$store.dispatch('setSnack', {
        snack: 'Goodbye :)',
        snackColor: 'success'
      })

      // redirect to homepage
      this.$router.push({
        name: 'Start'
      })
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'isAdmin',
      'user',
      'snack'
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
