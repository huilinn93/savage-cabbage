import { createApp } from 'vue'
import { createStore } from 'vuex'

import './input.css'
import App from './App.vue'
import router from './router'
import { firebaseApp } from './firebase'
import { getDatabase, ref as fbRef, onValue as fbOnValue } from 'firebase/database'
import { Team } from './types'

const fbDatabase = getDatabase(firebaseApp)
const teamsBankRef = fbRef(fbDatabase, 'teamsBank')

// Create a new store instance.
const store = createStore({
    state: {
      teams: {}
    },
    getters: {
      getTeams: state => state.teams,
    },
    actions: {
      fetchTeams({ commit }) {
        fbOnValue(teamsBankRef, (snapshot) => {
          const teamsBank = snapshot.val()
          let teams = []
          teams.push(teamsBank)
          commit('fetchTeams', teams[0])
        })
      }
    },
    mutations: {
      fetchTeams(state, teams) {
        state.teams = teams
      }
    }
  })

  store.dispatch('fetchTeams');

// const store = createStore({
//   state: () => ({
//     team: {
//       id: null,
//       description: null,
//       teamProgress: null,
//     },
//   }),
//   getters: {
//     getTeamId: state => state.team.id,
//     getTeamProgress: state => state.team.teamProgress,
//   },
//   actions: {
//     login({ commit }, { team }) {
//       commit('SET_TEAM', team)
//     },
//     logout({ commit }) {
//       commit('SET_TEAM', null)
//     },
//     updateTeamDescription({ commit }, { description }) {
//       commit('UPDATE_TEAM_DESCRIPTION', description)
//     },
//   },
//   mutations: {
//     SET_TEAM(state, team) {
//       state.team = team
//     },
//     UPDATE_TEAM_DESCRIPTION(state, description) {
//       state.team.description = description
//   }}
// })

const app = createApp(App)
app.use(router).mount('#app')

// Install the store instance as a plugin
app.use(store)

