import api from '@/services/api'

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
  watchexample () {
    return api().get(`watchexample`)
  },
  upload (formData) {
    return api().post(`upload`, formData)
  }
}
