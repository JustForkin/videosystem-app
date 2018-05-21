<template>
  <v-layout row style="margin-top: 0px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <video id="videoPlayer" width="100%" height="400px" autoplay controls>
        <!-- <source src="http://localhost:3000/video" type="video/mp4"> -->
        <source v-bind:src="src" type="video/mp4">
        <source v-bind:src="src" type="video/webm">
        <source v-bind:src="src" type="video/ogg">
        Your browser does not support the video tag.
      </video>
      <v-layout row class="mt-3">
        <v-flex xs8>
          <h1>{{video.title}}
            <v-btn
            :to="{name: 'EditVideo', params: { videoId: video.id }}"
            flat
            small color="error">
            Edit video
            </v-btn>
          </h1>
          <v-chip small color="error">
            Private
          </v-chip>
          <p>
            by<v-btn
              :to="{name: 'Profile', params: { username: video.authorUsername }}"
              flat
              small color="">
              <v-icon small>perm_identity</v-icon>{{video.authorUsername}}
            </v-btn>
          </p>
          <p>{{video.description}}</p>
        </v-flex>
        <v-flex xs4 offset-xs0>
          <v-layout column d-inline-flex>
            <v-btn
              flat
              icon
              fab
              color="success"
              >
              <v-icon flat color="success">thumb_up</v-icon>
            </v-btn>
            {{video.likes}}
          </v-layout>
          <v-layout column d-inline-flex>
            <v-btn
              flat
              icon
              fab
              color="error"
              >
              <v-icon flat color="error">thumb_down</v-icon>
            </v-btn>
            {{video.dislikes}}
          </v-layout>
          <v-layout column d-inline-flex>
            <v-btn
              flat
              icon
              fab
              color="blue">
              <v-icon flat color="blue">play_arrow</v-icon>
            </v-btn>
            {{video.views}}
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import VideoService from '@/services/VideoService'
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      src: 'http://localhost:8081/videos/private/',
      video: null
    }
  },
  methods: {

  },
  async mounted () {
    this.src += this.$route.params.videoId
    var self = this

    // video stream
    await axios.post(self.src, {}, {headers: {'authorization': `Bearer ${self.token}`}}).then((response) => {
      self.video = response.data
      console.log(response.data)
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
