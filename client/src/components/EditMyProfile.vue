<template>
  <v-layout
    v-if="!isAdmin && isUserLoggedIn"
    row style="margin-top: 0px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <!-- Firstname input -->
      <v-text-field
          label="First Name"
          v-model="user.firstname"
          :rules="firstnameRules"
          :counter="30"
          required>
      </v-text-field>
      <!-- Firstname input END -->
      <v-text-field
          label="Last Name"
          v-model="user.lastname">
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
          v-model="user.birthday"
          label="Birthday date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker
          ref="picker"
          v-model="user.birthday"
          :max="new Date().toISOString().substr(0, 10)"
          min="1920-01-01"
          @change="save"
        ></v-date-picker>
      </v-menu>
      <!-- Birthday picker END -->
      <!-- Gender picker -->
      <v-select
        v-model="user.gender"
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
          v-model="user.about"
          multi-line>
      </v-text-field>
      <!-- About END -->
      <v-btn
        class="primary"
        @click="update">
        Update profile
      </v-btn>
      <!-- Remove profile -->
      <v-btn
        class="error"
        @click="remove">
        Remove profile
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import VideoService from '@/services/VideoService'
import UserService from '@/services/UserService'
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      user: null,
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length <= 30) || 'Username must be less than 30 characters',
        v => (v && v.length >= 5) || 'Username must be more than 5 characters'
        // v => /^[\w]/.test(v) || 'Username can contain only letters, numbers and underscore _ symbol'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length <= 30) || 'Password must be less than 30 characters',
        v => (v && v.length >= 8) || 'Password must be more than 5 characters'
      ],
      firstnameRules: [
        v => !!v || 'First Name is required',
        v => (v && v.length <= 30) || 'First Name must be less than 30 characters'
      ],
      menu: false,
      genderItems: [
        'Male',
        'Female'
      ]
    }
  },
  methods: {
    save (birthday) {
      this.$refs.menu.save(birthday)
    },

    async update () {
      try{
        const response = await UserService.updateMyProfile({
          username: this.user.username,
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          birthday: this.user.birthday,
          gender: this.user.gender,
          about: this.user.about
        })

        if (response.data.success) {
          this.$store.dispatch('setSnack', {
            snack: response.data.success,
            snackColor: 'success'
          })

          this.$router.push({
            name: 'Profile',
            params: {
              username: this.user.username
            }
          })
        }
      } catch (error) {
        this.$store.dispatch('setSnack', {
          snack: error.response.data.error
        })
      }
    },

    async remove () {

    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  async mounted () {
    if (this.isUserLoggedIn) {
      try {
        const response = await UserService.myProfile()
        this.user = response.data.user
      } catch (error) {
        this.$store.dispatch('setSnack', {
          snack: error.response.data.error
        })
      }
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'token',
      'isAdmin',
      'snack'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
