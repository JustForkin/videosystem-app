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
        <!-- Country -->
        <v-layout row wrap>
          <v-flex xs12>
            <v-select
              :items="countries"
              :filter="customFilter"
              v-model="country"
              item-text="country"
              label="Country"
              autocomplete
              required
            ></v-select>
          </v-flex>
        </v-layout>
        <!-- isPublic -->
        <v-switch
          :label="`Public access to video: ${isPublic}`"
          v-model="isPublic">
        </v-switch>
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
import CountryService from '@/services/CountryService'
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
      isPublic: true,
      country: null,
      countries: [
        { country: 'Florida', id: 1 }
      ],
      customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : ''
        const text = hasValue(item.country)
        const query = hasValue(queryText)
        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
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
  },
  methods: {
    submit () {
      if (!this.title){
        this.$store.dispatch('setSnack', {
          snack: 'Title is required'
        })
        return
      }

      if (!this.videoFile){
        this.$store.dispatch('setSnack', {
          snack: 'Video file is required'
        })
        return
      }

      if (!(this.videoFile.type == "video/mp4" ||
          this.videoFile.type == "video/webm" ||
          this.videoFile.type == "video/ogg")){
        this.$store.dispatch('setSnack', {
          snack: 'Video file type must be .mp4 or .ogg'
        })
        return
      }

      if (!this.country){
        this.$store.dispatch('setSnack', {
          snack: 'Country is required'
        })
        return
      }

      var self = this
      let formData = new FormData()
      self.loadingValue = 0
      formData.append('videoFile', self.videoFile)
      formData.append('title', self.title)
      formData.append('countryId', self.country.id)
      formData.append('isPublic', self.isPublic)
      if (self.description) {
        formData.append('description', self.description)
      }

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
        .then((response) => {
          self.isLoading = false
		      console.log(response.data)

          this.$store.dispatch('setSnack', {
            snack: 'Congrats! Your video has uploaded successfully',
            snackColor: 'success'
          })
          this.$router.push({
            name: 'Videos'
          })
	      })
        .catch((error) => {
          self.isLoading = false
          console.log(error)
          this.$store.dispatch('setSnack', {
            snack: error.response.data.error
          })
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
  },
  async mounted () {
    try {
      const response = await CountryService.countries()
      this.countries = response.data
    } catch (error) {
      this.$store.dispatch('setSnack', {
        snack: error.response.data.error
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
