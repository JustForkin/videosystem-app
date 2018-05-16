<template>
  <v-layout row style="padding-top: 35px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <h1 v-if="isAdmin && isUserLoggedIn">You have no rights to upload being an admin</h1>
      <h1 v-if="!isUserLoggedIn">You need to
        <v-btn color="accent" :to="{name: 'Login'}">Login</v-btn>
        to upload your videos
      </h1>
      <form v-if="!isLoading && isUserLoggedIn && !isAdmin" action="http://localhost:8081/upload" enctype="multipart/form-data" method="POST">
        
        <v-layout column>
          <v-flex>
            <v-chip
              v-if="videoFileName"
              class="file-selected" small color=""
              close @input="videoFileName = ''; videoFile = null;">
              {{videoFileName}}
            </v-chip>
          </v-flex>
          <v-btn raised @click="onPickFile">Pick a video</v-btn>
          <input
            ref="fileInput"
            type="file"
            style="display: none;" name="" value=""
            accept="video/mp4,video/ogg,video/webm"
            @change="onFilePicked">
        </v-layout>
        <br>
        <v-btn
          class="accent"
          @click="submit">
          Submit
        </v-btn>
      </form>
      <v-progress-circular
        v-if="isLoading"
        :size="100"
        :width="15"
        :rotate="-90"
        :value="loadingValue"
        color="accent">
        {{ loadingValue }}
      </v-progress-circular>
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
      videoFile: null,
      videoFileName: '',
      isLoading: false,
      loadingValue: 0
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'token',
      'isAdmin'
    ])
  },
  methods: {
    submit () {
      var self = this
      let formData = new FormData()
      self.loadingValue = 0
      formData.append('videoFile', this.videoFile)

      const config = {
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
          console.log(percentCompleted)
          self.loadingValue = percentCompleted
        },
        headers: {
          'Authorization': `Bearer ${self.token}`
        }
      }

      self.isLoading = true

      axios.post('http://localhost:8081/upload', formData, config)
      .then(function(){
        console.log('SUCCESS: File recieved');
        self.isLoading = false
      }).catch(function(){
        console.log('FAILURE!!');
        self.isLoading = false
      })
    },

    onPickFile () {
      this.$refs.fileInput.click()
    },

    onFilePicked (event) {
      const files = event.target.files
      if (files[0]) {
        let filename = files[0].name
        this.videoFile = files[0]
        this.videoFileName = filename
      } else {
        this.videoFile = null
        this.videoFileName = null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
