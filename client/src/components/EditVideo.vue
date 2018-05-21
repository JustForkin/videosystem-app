<template>
  <v-layout row style="margin-top: 0px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <!-- Title -->
      <v-text-field
          label="Title"
          v-model="video.title"
          :rules="titleRules"
          :counter="30"
          required>
      </v-text-field>
      <!-- Description  -->
      <v-text-field
          name="description"
          label="Description"
          v-model="video.description"
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
        :label="`Public access to video: ${video.isPublic}`"
        v-model="video.isPublic">
      </v-switch>
      <br>
      <!-- Submit -->
      <v-btn
        class="accent"
        @click="submit">
        Submit
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import VideoService from '@/services/VideoService'
import CountryService from '@/services/CountryService'
import axios from 'axios'
import {mapState} from 'vuex'
import _ from 'lodash'

export default {
  data () {
    return {
      src: 'http://localhost:8081/videos/edit/',
      video: null,
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length <= 30) || 'Title maximum characters size is 30',
        v => (v && v.length >= 1) || 'Title must contain at least 1 character'
      ],
      country: null,
      countries: []
    }
  },
  methods: {
    async submit () {
      if (!this.video.title){
        this.$store.dispatch('setSnack', {
          snack: 'Title is required'
        })
        return
      }

      if (!this.video.countryId){
        this.$store.dispatch('setSnack', {
          snack: 'Country is required'
        })
        return
      }

      try {
        const response = await VideoService.editVideoSubmit(this.video.id, {
          id: this.video.id,
          authorUsername: this.video.authorUsername,
          title: this.video.title,
          description: this.video.description,
          countryId: this.video.countryId,
          isPublic: this.video.isPublic
        })

        if (response.data.success) {
          this.$store.dispatch('setSnack', {
            snack: response.data.success,
            snackColor: 'success'
          })

          this.$router.push({
            name: 'Profile',
            params: {
              username: this.video.authorUsername
            }
          })
        }
      } catch (error) {
        this.$store.dispatch('setSnack', {
          snack: error.response.data.error
        })
      }
    }
  },
  watch: {
    country: function (value) {
      this.video.countryId = value.id
    }
  },
  async mounted () {
    // video
    try {
      await VideoService.editVideo(this.$route.params.videoId).then((response) => {
        this.video = response.data.video
      })
    } catch (error) {
      this.$store.dispatch('setSnack', {
        snack: error.response.data.error
      })
    }
    // countries
    try {
      const response = await CountryService.countries()
      this.countries = response.data
      // highlight country already set
      var i = _.findIndex(this.countries, ['id', this.video.countryId])
      this.country = this.countries[i]
    } catch (error) {
      this.$store.dispatch('setSnack', {
        snack: error.response.data.error
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
