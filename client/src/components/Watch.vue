<template>
  <v-layout row style="padding-top: 35px;">
    
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
    this.videos = (await VideoService.videos()).data
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
