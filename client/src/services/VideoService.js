import api from '@/services/api'

export default {
  videos () {
    return api().get('videos')
  },
  watch (videoId) {
    return api().get(`videos/${videoId}`)
  },
  watchexample () {
    return api().get(`watchexample`)
  },
  upload () {
    return api().post(`upload`)
  }
}
