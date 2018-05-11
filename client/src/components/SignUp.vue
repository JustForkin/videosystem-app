<template>
  <v-layout row style="padding-top: 35px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <form autocomplete="off">
        <h1>Sign Up</h1>
        <!-- Username input -->
        <v-text-field
          label="Username"
          v-model="username"
          :rules="usernameRules"
          :counter="30"
          required>
        </v-text-field>
        <!-- Username input END -->
        <!-- Password input -->
        <v-text-field
            label="Password"
            type="password"
            v-model="password"
            autocomplete="new-password"
            :rules="passwordRules"
            required>
        </v-text-field>
        <!-- Password input END -->
        <!-- Firstname input -->
        <v-text-field
            label="First Name"
            v-model="firstname"
            :rules="firstnameRules"
            :counter="30"
            required>
        </v-text-field>
        <!-- Firstname input END -->
        <v-text-field
            label="Last Name"
            v-model="lastname">
        </v-text-field>
        <!-- Birthday picker  -->
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px">
          <v-text-field
            slot="activator"
            v-model="birthday"
            label="Birthday date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker
            ref="picker"
            v-model="birthday"
            :max="new Date().toISOString().substr(0, 10)"
            min="1920-01-01"
            @change="save"
          ></v-date-picker>
        </v-menu>
        <!-- Birthday picker END -->
        <!-- Gender picker -->
        <v-select
          v-model="gender"
          :items="genderItems"
          :rules="[v => !!v || 'Gender is required']"
          required
          label="Gender"
        ></v-select>
        <!-- Gender picker END -->
        <!-- About  -->
        <v-text-field
            name="about"
            label="About"
            v-model="about"
            multi-line>
        </v-text-field>
        <!-- About END -->
        <v-btn
          class="accent"
          @click="signup">
          Continue
        </v-btn>

        <!-- Snackbar Error -->
        <v-snackbar
          top
          left
          multi-line
          v-model="snackbarError"
          color="error">
          {{ error }}
          <v-btn flat color="" @click.native="snackbarError = false">Close</v-btn>
        </v-snackbar>

        <!-- Snackbar Success -->
        <v-snackbar
          top
          left
          multi-line
          v-model="snackbarSuccess"
          color="success">
          {{ success }}
          <v-btn flat color="" @click.native="snackbarSuccess = false">Close</v-btn>
        </v-snackbar>

      </form>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      username: '',
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length <= 30) || 'Username must be less than 30 characters',
        v => (v && v.length >= 5) || 'Username must be more than 5 characters'
        // v => /^[\w]/.test(v) || 'Username can contain only letters, numbers and underscore _ symbol'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length <= 30) || 'Password must be less than 30 characters',
        v => (v && v.length >= 8) || 'Password must be more than 5 characters'
      ],
      firstname: '',
      firstnameRules: [
        v => !!v || 'First Name is required',
        v => (v && v.length <= 30) || 'First Name must be less than 30 characters'
      ],
      lastname: null,
      birthday: null,
      gender: null,
      about: null,
      error: null,
      success: null,
      menu: false,
      genderItems: [
        'Male',
        'Female'
      ],
      snackbarError: false,
      snackbarSuccess: false
    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    async signup () {
      try {
        const response = await AuthenticationService.signup({
          username: this.username,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname,
          birthday: this.birthday,
          gender: this.gender,
          about: this.about
        })

        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)

        if (response.data.token) {
          this.success = 'You registered successfully. Welcome to Videosystem App'
          this.snackbarSuccess = true
        }
      } catch (error) {
        this.error = error.response.data.error
        if (this.error) {
          this.snackbarError = true;
        }
      }
    },
    save (birthday) {
      this.$refs.menu.save(birthday)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
