<template>
  <v-layout row style="padding-top: 35px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <h1 v-if="isAdmin && isUserLoggedIn">You have no rights to upload being an admin</h1>
      <h1 v-if="!isUserLoggedIn">You need to
        <v-btn color="accent" :to="{name: 'Login'}">Login</v-btn> or
        <v-btn color="accent" :to="{name: 'SignUp'}">Sign Up</v-btn>
        to upload your videos
      </h1>
      <form
        autocomplete="off"
        v-if="!isLoading && isUserLoggedIn && !isAdmin"
        action="http://localhost:8081/upload"
        enctype="multipart/form-data" method="POST">
        <h1>Upload a video</h1><br>
        <!-- Video file picker -->
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
        <!-- Title -->
        <v-text-field
            label="Title"
            v-model="title"
            :rules="titleRules"
            :counter="30"
            required>
        </v-text-field>
        <!-- Description  -->
        <v-text-field
            name="description"
            label="Description"
            v-model="description"
            multi-line>
        </v-text-field>
        <br>
        <!-- Submit -->
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
      loadingValue: 0,
      title: '',
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length <= 30) || 'Title maximum characters size is 30',
        v => (v && v.length >= 1) || 'Title must contain at least 1 character'
      ],
      description: null,
      snackbarError: false,
      snackbarSuccess: false,
      snackbarErrorMessage: null,
      snackbarSuccessMessage: null
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
      if (!this.title){
        return
      }

      if (!this.videoFile){
        this.snackbarErrorMessage = 'Video file is required'
        this.snackbarError = true
        return
      }

      if (!(this.videoFile.type == "video/mp4" ||
          this.videoFile.type == "video/webm" ||
          this.videoFile.type == "video/ogg")){
        this.snackbarErrorMessage = 'Video file type must be .mp4 or .ogg'
        this.snackbarError = true
        return
      }

      var self = this
      let formData = new FormData()
      self.loadingValue = 0
      formData.append('videoFile', self.videoFile)

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
