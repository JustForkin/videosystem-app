<template>
  <v-layout row style="margin-top: 0px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <v-layout row>
        <v-btn
          small
          v-if="isUserLoggedIn && !isAdmin"
          :to="{name: 'EditMyProfile'}"
          class="primary">
          Edit my profile
        </v-btn>
        <v-btn
          small
          v-if="isUserLoggedIn && !isAdmin"
          :to="{name: 'LikedVideos'}"
          class="success">
          Liked Videos
        </v-btn>
        <v-btn
          small
          v-if="isUserLoggedIn && !isAdmin"
          :to="{name: 'WatchLater'}"
          class="accent">
          Watch later
        </v-btn>
      </v-layout>
      <v-layout row class="mb-2">
        <v-flex xs12>
          <v-chip v-if="!user.isAdmin" large><h2><v-icon>perm_identity</v-icon>{{user.username}}</h2></v-chip>
          <v-chip v-if="user.isAdmin" large color="error"><h2><v-icon>perm_identity</v-icon>{{user.username}}</h2></v-chip>
          <h2>{{user.firstname}} {{user.lastname}}</h2>
          <span v-if="user.about"><b><i>About:</i></b> {{user.about}}</span><br>
          <span v-if="user.birthday"><b><i>Birthday:</i></b> {{user.birthday}}</span><br>
          <span><b><i>Registered:</i></b> {{user.registerDate}}</span><br>

        </v-flex>
      </v-layout>
      <hr>
      <h1 class="mt-2">Videos</h1>
      <h4 v-if="videos.length">Views sum: {{viewsSum()}}</h4>
      <p v-if="!videos.length">No videos</p>
      <div
        class="videos-list mt-1"
        v-for="video in videos"
        :key="video.id"
        >
        <v-card class="mb-1">
          <v-layout row>
            <v-flex xs9>
              <v-card-title primary-title>
                <h3 class="headline">{{video.title}}</h3>
                <v-chip v-if="!video.isPublic" color="error">
                  Private
                </v-chip>
              </v-card-title>
            </v-flex>
            <v-flex xs3 offset-xs0 class="mt-2">
              <p>{{video.uploadDate}}</p>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6>
              <v-card-actions>
                <v-btn
                  v-if="video.isPublic"
                  flat
                  color="accent"
                  :to="{name: 'Watch', params: { videoId: video.id }}">
                  Watch
                </v-btn>
                <v-btn
                  v-if="!video.isPublic"
                  flat
                  color="accent"
                  :to="{name: 'WatchPrivate', params: { videoId: video.id }}">
                  Watch
                </v-btn>
                <v-btn
                  flat
                  color="accent"
                  :to="{name: 'EditVideo', params: { videoId: video.id }}">
                  Edit video
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
import UserService from '@/services/UserService'
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      user: null,
      videos: []
    }
  },
  methods: {
    viewsSum () {
      var sum = 0
      for (var i = 0; i < this.videos.length; i++) {
        sum += this.videos[i].views
      }
      return sum
    }
  },
  async mounted () {
    if (this.isUserLoggedIn) {
      try {
        const response = await UserService.myProfile()
        this.user = response.data.user
        this.videos = response.data.videos
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
