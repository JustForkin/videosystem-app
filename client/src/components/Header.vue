<template>
  <div class="container grid-xl">
    <header class="navbar">
      <section class="navbar-section">
        <div class="input-group input-inline">
          <input class="form-input" type="text" placeholder="Search videos">
          <button class="btn btn-link input-group-btn">
            <i class="icon icon-search"></i>
          </button>
        </div>
      </section>

      <section class="navbar-center">
        <router-link to="/" class="btn btn-link btn-lg">VIDEOSYSTEM</router-link>
      </section>

      <section class="navbar-section">
        <router-link
          v-if="!$store.state.isUserLoggedIn"
          to="login"
          class="btn btn-link btn-sm">Login</router-link>
        <router-link
          v-if="!$store.state.isUserLoggedIn"
          to="signup"
          class="btn btn-link btn-sm">Sign Up</router-link>
        <span
          v-if="$store.state.isAdmin && $store.state.isUserLoggedIn"
          class="label label-error">admin account</span>
        <button
          v-if="$store.state.isUserLoggedIn"
          @click="logout"
          class="btn btn-link btn-sm">Log Out</button>
      </section>

    </header>
  </div><!-- container -->
</template>

<script>
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
