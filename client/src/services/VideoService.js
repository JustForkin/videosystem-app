import api from '@/services/api'
import store from '@/store/store'

export default {
  videos (search, sortByPopularity) {
    let urlRequest = `videos/?`
    if (search) {
      urlRequest += `search=${search}&`
    }
    if (sortByPopularity) {
      urlRequest += `sortBy=popularity`
    }

    return api().get(urlRequest)
  },
  watch (videoId) {
    return api().get(`videos/${videoId}`)
  },
  watchInfo (videoId) {
    return api().post(`videos/${videoId}`)
  },
  watchPrivate (videoId) {
    return api().get(`videos/private/${videoId}`)
  },
  watchPrivateInfo (videoId) {
    return api().post(`videos/private/${videoId}`)
  },
  editVideo (videoId) {
    return api().get(`videos/edit/${videoId}`)
  },
  editVideoSubmit (videoId, reqBodyData) {
    return api().post(`videos/edit/${videoId}`, reqBodyData)
  },
  editVideoRemove (videoId) {
    return api().post(`videos/edit/remove/${videoId}`)
  },
  upload (formData) {
    return api().post(`upload`, formData)
  },
  likedVideos () {
    return api().get(`me/liked`)
  }
}
