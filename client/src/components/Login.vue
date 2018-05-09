<template>
  <div id="main">
    <!--<div class="container">
      <header class="navbar">
        <a href="#" class="btn btn-link btn-block btn-lg">VideoSystem App</a>
      </header>
    </div>-->

    <div class="container grid-sm">
      <h1>Login</h1>

      <div class="form-group">
        <input
          class="form-input"
          type="text"
          placeholder="Username"
          name="username"
          v-model="username"
          minlength="5"
          maxlength="30"
          autocomplete="on">
      <!-- <p v-html="error" class="form-input-hint"></p> -->
      </div>

      <div class="form-group">
        <input
          class="form-input"
          type="password"
          placeholder="Password"
          name="password"
          v-model="password"
          minlength="8"
          maxlength="30"
          autocomplete="on">
        <!-- <p class="form-input-hint">The name is invalid.</p> -->
      </div>
      <!-- <div class="error" v-html="error" /> <br> -->
      <button @click="login" class="btn btn-primary btn-lg btn-block">Login</button>
    </div><!-- form -->
  </div><!-- main div -->
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      username: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          username: this.username,
          password: this.password
        })
        console.log(response.data)
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error{
  color: red;
}

header.navbar{
  border-bottom: 1px solid black;
}

div#main{
  margin-top: 60px;
}

</style>
