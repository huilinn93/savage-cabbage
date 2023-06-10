import { createApp } from 'vue'
import { createStore } from 'vuex'

import './input.css'
import App from './App.vue'
import router from './router'

// Create a new store instance.
const store = createStore({
  state: () => ({
    team: {
      id: null,
      teamProgress: null,
    },
  }),
  getters: {
    getTeamId: state => state.team.id,
    getTeamProgress: state => state.team.teamProgress,
  },
  actions: {
    login({ commit }, { team }) {
      commit('SET_TEAM', team)
    },
    logout({ commit }) {
      commit('SET_TEAM', null)
    },
  },
  mutations: {
    SET_TEAM(state, team) {
      state.team = team
    },
  }
})

const app = createApp(App)
app.use(router).mount('#app')

// Install the store instance as a plugin
app.use(store)

