<template>
  <v-layout row style="margin-top: 0px;">
    <v-flex xs12 offset-xs0 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 xl4 offset-xl4>
      <video id="videoPlayer" width="100%" height="400px" autoplay controls>
        <!-- <source src="http://localhost:3000/video" type="video/mp4"> -->
        <source src="http://localhost:8081/watchexample" type="video/mp4">
        <source src="http://localhost:8081/watchexample" type="video/webm">
        <source src="http://localhost:8081/watchexample" type="video/ogg">
        Your browser does not support the video tag.
      </video>
    </v-flex>
  </v-layout>
</template>

<script>
import VideoService from '@/services/VideoService'

export default {
  data () {
    return {

    }
  },
  methods: {

  },
  async mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
