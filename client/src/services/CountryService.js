import api from '@/services/api'

export default {
  countries () {
    return api().post('countries')
  }
}
