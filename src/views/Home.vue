<template>
  <div class="text-grey font-header text-xxl pb-5 leading-10 uppercase">
    Scavenger Hunt
  </div>
  <div class="uppercase text-xs">
    table
    <select id="teams" class="p-1 font-serif" v-model="teamIdRef">
      <option v-for="TeamId in totalTeams" :key="TeamId" :value="TeamId">
        {{ TeamId }}
      </option>
    </select>
    ,
  </div>
  <div class="text-xs w-100">
    also known as
    <textarea
      type="text"
      class="px-3 py-2 font-serif italic"
      :placeholder="teamDescPlaceholderRef"
      v-model="descriptionRef"
    />
  </div>
  <div class="flex flex-col w-1/2 mx-auto mt-5">
    <router-link
      :to="
        teamProgressRef === 0
          ? { path: '/introduction', query: { id: teamIdRef } }
          : `team/${teamIdRef}/question/${teamProgressRef}`
      "
      class="w-full"
    >
      <button @click="login" :disabled="!teamIdRef">Login</button>
    </router-link>
    <router-link :to="{ path: '/introduction', query: { id: teamIdRef } }">
      <button>Instructions</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
  } from 'firebase/database'
  import { firebaseApp } from '../firebase'

  const fbDatabase = getDatabase(firebaseApp)

  import { computed } from 'vue'
  import { useStore } from 'vuex'

  import { Team } from '../types'

  const teamIdRef = ref('')
  const teamProgressRef = ref(0)
  const teamDescPlaceholderRef = ref('the most awesome table ever')
  const descriptionRef = ref('')

  const totalTeams = Array.from({ length: 30 }, (_, i) => i + 1)

  const store = useStore()
  const teams = computed(() => store.getters.getTeams)

  watch(teamIdRef, (currentValue: string) => {
    const team: Team = teams.value[currentValue]

    if (!team) return

    teamDescPlaceholderRef.value = team.description

    if (team.questions) {
      teamProgressRef.value = Object.keys(team.questions).length + 1
    }
  })

  const createOrUpdateTeam = () => {
    fbUpdate(fbRef(fbDatabase, 'teamsBank/' + teamIdRef.value), {
      description: descriptionRef.value,
    })
  }

  const login = () => {
    if (!teamIdRef.value) return
    if (!descriptionRef.value) {
      descriptionRef.value = teamDescPlaceholderRef.value
    }

    store.dispatch('setCurrentTeam', {teamId: teamIdRef.value, teamData: teams.value[teamIdRef.value]})
    createOrUpdateTeam()
  }
</script>
