<template>
  <v-layout row style="padding-top: 35px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <v-layout row>
        <v-flex xs6 offset-xs0>
          <v-switch small
            label="Sort by: upload date">
          </v-switch>
        </v-flex>
        <v-flex xs6>
          <v-text-field
             v-model="search"
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
              <v-card-title>
                {{video.authorUsername}}
              </v-card-title>
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
      <!-- <infinite-loading @infinite="infiniteHandler"></infinite-loading> -->
    </v-flex>
  </v-layout>
</template>

<script>
import VideoService from '@/services/VideoService'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  data () {
    return {
      videos: []
    }
  },
  methods: {
    infiniteHandler($state) {
      setTimeout(() => {
        const temp = []
        for (let i = this.videos.length + 1; i <= this.videos.length + 20; i++) {
          temp.push(i)
        }
        this.videos = this.videos.concat(temp)
        $state.loaded()
      }, 1000)
    }
  },
  components: {
    InfiniteLoading
  },
  async mounted () {
    this.videos = (await VideoService.videos()).data.sort(function (a, b) {
      return b.id - a.id
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
