import api from '@/services/api'

export default {
  users (search, sortByPopularity) {
    let urlRequest = `users/?`
    if (search) {
      urlRequest += `search=${search}&`
    }
    if (sortByPopularity) {
      urlRequest += `sortBy=popularity`
    }

    return api().get(urlRequest)
  },
  profile (username) {
    return api().get(`users/${username}`)
  },
  myProfile () {
    return api().get('me/')
  }
}
