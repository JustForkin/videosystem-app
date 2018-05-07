<template>
  <div class="container grid-xl">
    <header class="navbar">
      <section class="navbar-section">
        <router-link to="/" class="btn btn-link">VIDEOSYSTEM</router-link>
        <!-- <a href="#" class="btn btn-link">VideoSystem App</a> -->
      </section>
      <section class="navbar-center">

      </section>
      <section class="navbar-section">
        <router-link to="login" class="btn btn-link btn-sm">Login</router-link>
        <router-link to="signup" class="btn btn-link btn-sm">Sign Up</router-link>
      </section>
    </header>
  </div>
</template>

<script>
export default {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-lg{
}
</style>
