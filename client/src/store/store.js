import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    isAdmin: false,
    snack: '',
    snackColor: ''
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      if (token) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
        state.isAdmin = false
      }
    },
    setUser (state, user) {
      state.isAdmin = false
      state.user = user
      if (state.user.isAdmin === true) {
        state.isAdmin = true
      } else {
        state.isAdmin = false
      }
    },
    setSnack (state, payload) {
      if (!payload.snackColor){
        payload.snackColor = 'error'
      }
      state.snack = payload.snack
      state.snackColor = payload.snackColor
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    setSnack ({commit}, payload) {
      commit('setSnack', payload)
    }
  }
})
