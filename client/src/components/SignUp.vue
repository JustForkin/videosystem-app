<template>
  <div id="main">
    <div class="container grid-md">
      <h1>Sign Up</h1>
      <!-- vertical divider element -->
      <div class="columns">
        <div class="column">
          <!-- column 1 content -->
          <div class="form-group">
            <input
              class="form-input"
              type="text"
              placeholder="Username*"
              name="username"
              v-model="username"
              minlength=""
              maxlength="30"
              autocomplete="new-password">
          </div>
          <div class="form-group">
            <input
              class="form-input"
              type="password"
              placeholder="Password*"
              name="password"
              v-model="password"
              minlength=""
              maxlength="30"
              autocomplete="new-password">
          </div>
          <div class="form-group">
            <input
              class="form-input"
              type="text"
              placeholder="First Name*"
              name="firstname"
              v-model="firstname"
              minlength=""
              maxlength="30"
              autocomplete="new-password">
          </div>
          <div class="form-group">
            <input
              class="form-input"
              type="text"
              placeholder="Last Name"
              name="lastname"
              v-model="lastname"
              minlength=""
              maxlength="30"
              autocomplete="new-password">
          </div>
        </div>
        <!-- divider itself  -->
        <div class="divider-vert" data-content=""></div>
        <div class="column">
          <!-- column 2 content -->
          2 column content
        </div>
      </div><!-- .columns -->
      <button @click="signup" class="btn btn-primary btn-lg btn-block">Continue</button>
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
      firstname: '',
      lastname: '',
      birthday: new Date(),
      gender: '',
      about: '',
      error: null
    }
  },
  methods: {
    async signup () {
      try {
        const response = await AuthenticationService.signup({
          username: this.username,
          password: this.password
        })
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
.columns{
  margin-bottom: 20px;
}

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
