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
            v-if="isUserLoggedIn && (user.username == video.authorUsername)"
            :to="{name: 'EditVideo', params: { videoId: video.id }}"
            flat
            small color="error">
            Edit video
            </v-btn>
            <v-btn
            v-if="isUserLoggedIn && isAdmin"
            @click="removeVideo"
            flat
            outline
            small color="error">
            Remove video
            </v-btn>
          </h1>
          <p>by
            <v-btn
              :to="{name: 'Profile', params: { username: video.authorUsername }}"
              flat
              small color="">
              <v-icon small>perm_identity</v-icon>{{video.authorUsername}}
            </v-btn>
            <v-btn
              v-if="isUserLoggedIn && !isAdmin"
              flat
              outline
              @click="addToWatchLater"
              small color="blue">
              <v-icon small>add</v-icon>Watch Later
            </v-btn>
          </p>
          <p>{{video.description}}</p>
        </v-flex>
        <v-flex xs4 offset-xs0>
          <v-layout column d-inline-flex>
            <v-btn
              flat
              icon
              :outline="alreadyLiked"
              fab
              color="success"
              @click="like">
              <v-icon flat color="success">thumb_up</v-icon>
            </v-btn>
            {{video.likes}}
          </v-layout>
          <v-layout column d-inline-flex>
            <v-btn
              flat
              icon
              fab
              :outline="alreadyDisliked"
              color="error"
              @click="dislike">
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
      src: 'http://localhost:8081/videos/',
      video: null,
      alreadyLiked: false,
      alreadyDisliked: false
    }
  },
  methods: {
    async like () {
      if (this.isUserLoggedIn && !this.isAdmin){
        await axios.post(this.src + '/addLike', {}, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
          .then((response) => {
            console.log(response.data)
            this.video.likes += response.data.like
            this.alreadyLiked = (response.data.like > 0)
            this.video.dislikes += response.data.dislike
            this.alreadyDisliked = false
          })
          .catch((error) => {
            this.$store.dispatch('setSnack', {
              snack: error.response.data.error
            })
          })
      } else {
        if (this.isUserLoggedIn && this.isAdmin){
          this.$store.dispatch('setSnack', {
            snack: 'Admins are not able to like / dislike'
          })
          return
        }

        this.$store.dispatch('setSnack', {
          snack: 'Login to be able to like / dislike'
        })
      }
    },

    async dislike() {
      if (this.isUserLoggedIn && !this.isAdmin){
        await axios.post(this.src + '/addDislike', {}, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
          .then((response) => {
            console.log(response.data)
            this.video.dislikes += response.data.dislike
            this.alreadyDisliked = (response.data.dislike > 0)
            this.video.likes += response.data.like
            this.alreadyLiked = false
          })
          .catch((error) => {
            this.$store.dispatch('setSnack', {
              snack: error.response.data.error
            })
          })
      } else {
        if (this.isUserLoggedIn && this.isAdmin){
          this.$store.dispatch('setSnack', {
            snack: 'Admins are not able to like / dislike'
          })
          return
        }

        this.$store.dispatch('setSnack', {
          snack: 'Login to be able to like / dislike'
        })
      }
    },

    async addToWatchLater () {
      try{
        const response = await VideoService.watchLaterAdd({
          videoId: this.video.id
        })

        if (response.data.success) {
          this.$store.dispatch('setSnack', {
            snack: response.data.success,
            snackColor: 'success'
          })
        }
      } catch (error) {
        this.$store.dispatch('setSnack', {
          snack: error.response.data.error
        })
      }
    },

    async removeVideo () {
      try {
        const response = await VideoService.editVideoRemove(this.$route.params.videoId)

        if (response.data.success) {
          this.$store.dispatch('setSnack', {
            snack: response.data.success,
            snackColor: 'success'
          })

          this.$router.push({
            name: 'Videos'
          })
        }
      } catch (error) {
        this.$store.dispatch('setSnack', {
          snack: error.response.data.error
        })
      }
    }
  },
  async mounted () {
    this.src += this.$route.params.videoId
    var self = this

    // video stream
    await axios.post(self.src).then((response) => {
      self.video = response.data
      VideoService.addView(self.$route.params.videoId)
        .then((response) => {
        })
    })

    if ((self.isUserLoggedIn && !self.isAdmin)) {
      await axios.post(self.src + '/pointsByUser', {}, {headers: {'Authorization': `Bearer ${self.token}`}})
      .then((response) => {
        console.log(response.data)
        if (response.data.liked) {
          self.alreadyLiked = true
        }
        if (response.data.disliked) {
          self.alreadyDisliked = true
        }
      })
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'token',
      'isAdmin',
      'snack',
      'user'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
