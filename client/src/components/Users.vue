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
              <v-chip
                :to="{name: 'Users', params: { username: video.authorUsername }}"
                small color="">
                <v-icon small>perm_identity</v-icon>{{video.authorUsername}}
              </v-chip>
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
import _ from 'lodash'

export default {
  data () {
    return {
      videos: [],
      sortTypeSwitch: false,
      sortType: 'Sort by: upload date',
      searchQuery: ''
    }
  },
  async mounted () {
    this.searchVideos()
  },
  methods: {
    searchVideos (query, sortByPopularity = false) {
      var self = this
      _.debounce(async function () {
        try {
          self.videos = (await VideoService.videos(query, sortByPopularity)).data
          if (!self.videos) {
            self.$store.dispatch('setSnack', {
              snack: 'No videos found :('
            })
          }
        } catch (error) {
          self.$store.dispatch('setSnack', {
            snack: error.response.data.error
          })
          self.videos = []
        }
      }, 800)()
    }
  },
  watch : {
    sortTypeSwitch: function (value) {
      if (value) {
        this.sortType = 'Sort by: popularity'
      } else {
        this.sortType = 'Sort by: upload date'
      }

      this.searchVideos(this.searchQuery, value)
    },
    searchQuery: function (value) {
      this.searchVideos(value, this.sortTypeSwitch)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
