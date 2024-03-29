import { createApp } from 'vue'
import { createStore } from 'vuex'

import 'gitart-vue-dialog/dist/style.css'
import { GDialog } from 'gitart-vue-dialog'

import './input.css'
import App from './App.vue'
import router from './router'
import { firebaseApp } from './firebase'
import {
  getDatabase,
  ref as fbRef,
  onValue as fbOnValue,
} from 'firebase/database'
import { Team } from './types'

const fbDatabase = getDatabase(firebaseApp)
const teamsBankRef = fbRef(fbDatabase, 'teamsBank')

// Create a new store instance.
const store = createStore({
  state: {
    teams: {} as { [key: string]: Team },
    currentTeam: {
      id: undefined as unknown as number,
    },
  },
  getters: {
    getTeams: (state) => state.teams,
    getCurrentTeam: (state) => state.currentTeam.id,
  },
  actions: {
    fetchTeams({ commit }) {
      fbOnValue(teamsBankRef, (snapshot) => {
        const teamsBank = snapshot.val()
        let teams = []
        teams.push(teamsBank)
        commit('fetchTeams', teams[0])
      })
    },
    setCurrentTeam({ commit }, teamId: number) {
      commit('setCurrentTeam', teamId)
    },
  },
  mutations: {
    fetchTeams(state, teams) {
      state.teams = teams
    },
    setCurrentTeam(state, currentTeam: { teamId: number }) {
      state.currentTeam.id = currentTeam.teamId
    },
  },
})

store.dispatch('fetchTeams')

const app = createApp(App)

app.use(router).use(store)
app.component('GDialog', GDialog)

app.mount('#app')
