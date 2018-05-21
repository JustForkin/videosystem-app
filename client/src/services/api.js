import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      'Access-Control-Request-Headers': 'authorization',
      'Access-Control-Request-Method': 'GET',
      'authorization': `Bearer ${store.state.token}`
    }
  })
}
