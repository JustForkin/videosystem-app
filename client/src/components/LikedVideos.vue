<template>
  <v-layout row style="padding-top: 35px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <h2>Liked videos</h2>
      <p v-if="!videos.length">You haven't liked any video yet</p>
      <div
        class="videos-list"
        v-for="video in videos"
        :key="video.id"
        >
        <v-card class="mb-1">
          <v-layout row>
            <v-flex xs9>
              <v-card-title primary-title>
                <h3 class="headline">{{video.title}}</h3>
              </v-card-title>
            </v-flex>
            <v-flex xs3 offset-xs0>
              <v-btn
                :to="{name: 'Profile', params: { username: video.authorUsername }}"
                small flat color="">
                <v-icon small>perm_identity</v-icon>{{video.authorUsername}}
              </v-btn>
              <p>{{video.uploadDate}}</p>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6>
              <v-card-actions>
                <v-btn
                  flat
                  color="accent"
                  :to="{name: 'Watch', params: { videoId: video.id }}">
                  Watch
                </v-btn>
              </v-card-actions>
            </v-flex>
            <v-flex xs6 offset-xs0>
              <v-layout column d-inline-flex>
                <v-icon small flat color="success">thumb_up</v-icon>
                {{video.likes}}
              </v-layout>
              <v-layout column d-inline-flex>
                <v-icon small flat color="error">thumb_down</v-icon>
                {{video.dislikes}}
              </v-layout>
              <v-layout column d-inline-flex>
                <v-icon small flat color="blue">play_arrow</v-icon>
                {{video.views}}
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </div><!-- .videos-list -->
    </v-flex>
  </v-layout>
</template>

<script>
import VideoService from '@/services/VideoService'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      videos: []
    }
  },
  async mounted () {
    try {
      await VideoService.likedVideos().then((response) => {
        this.videos = response.data
      })
    } catch (error) {
      this.$store.dispatch('setSnack', {
        snack: error.response.data.error
      })
    }
  },
  methods: {

  },
  watch: {

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
