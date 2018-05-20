<template>
  <v-layout row style="margin-top: 0px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <v-layout row class="">
        <v-flex xs12>
          <v-chip v-if="!user.isAdmin" large><h2><v-icon>perm_identity</v-icon>{{user.username}}</h2></v-chip>
          <v-chip v-if="user.isAdmin" large color="error"><h2><v-icon>perm_identity</v-icon>{{user.username}}</h2></v-chip>
          <h2>{{user.firstname}} {{user.lastname}}</h2>
          <span v-if="user.about"><b><i>About:</i></b> {{user.about}}</span><br>
          <span v-if="user.birthday"><b><i>Birthday:</i></b> {{user.birthday}}</span><br>
          <span><b><i>Registered:</i></b> {{user.registerDate}}</span><br>

        </v-flex>
      </v-layout>
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
      src: 'http://localhost:8081/users/',
      user: null
    }
  },
  methods: {

  },
  async mounted () {
    this.src += this.$route.params.username
    var self = this

    await axios.post(self.src).then((response) => {
      self.user = response.data
    })
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
