<template>
  <v-layout row style="padding-top: 35px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <v-layout row>
        <v-flex xs6 offset-xs0>
          <v-switch
            v-model="sortTypeSwitch"
            small
            :label="sortType">
          </v-switch>
        </v-flex>
        <v-flex xs6>
          <v-text-field
             v-model="searchQuery"
             append-icon="search"
             label="Search"
             single-line
             hide-details
           ></v-text-field>
        </v-flex>
      </v-layout>
      <div
        class="users-list"
        v-for="user in users"
        :key="user.username"
        >
        <v-card class="mb-1">
          <v-layout row>
            <v-flex xs9>
              <v-card-title
                primary-title>
                <h3 class="headline">{{user.username}}</h3>
              </v-card-title>
              <v-card-actions>
                <v-btn
                  flat
                  color="accent"
                  :to="{name: 'Profile', params: { username: user.username }}"
                  >
                  Visit profile
                </v-btn>
              </v-card-actions>
            </v-flex>
            <v-flex xs3 offset-xs0>
              <br>
              <h4>{{user.firstname}} {{user.lastname}}</h4>
              <p>Registered: {{user.registerDate}}</p>
            </v-flex>
          </v-layout>
          <!-- <v-layout row>
            <v-flex xs6>

            </v-flex>
          </v-layout> -->
        </v-card>
      </div><!-- .users-list -->
    </v-flex>
  </v-layout>
</template>

<script>
import UserService from '@/services/UserService'
import _ from 'lodash'

export default {
  data () {
    return {
      videos: [],
      users: [],
      sortTypeSwitch: false,
      sortType: 'Sort by: register date',
      searchQuery: ''
    }
  },
  async mounted () {
    this.searchUsers()
  },
  methods: {
    searchUsers (query, sortByPopularity = false) {
      var self = this
      _.debounce(async function () {
        try {
          self.users = (await UserService.users(query, sortByPopularity)).data
          if (!self.users) {
            self.$store.dispatch('setSnack', {
              snack: 'No users found :('
            })
          }
        } catch (error) {
          self.$store.dispatch('setSnack', {
            snack: error.response.data.error
          })
          self.users = []
        }
      }, 800)()
    }
  },
  watch : {
    sortTypeSwitch: function (value) {
      if (value) {
        this.sortType = 'Sort by: popularity'
      } else {
        this.sortType = 'Sort by: register date'
      }

      this.searchUsers(this.searchQuery, value)
    },
    searchQuery: function (value) {
      this.searchUsers(value, this.sortTypeSwitch)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
