<template>
  <h1 class="text-grey font-header text-xxl my-auto">Scavenger Hunt</h1>
  <div class="uppercase my-auto font-sans">
    table
    <select
      id="teams"
      class="p-1 font-serif opacity-80 rounded-lg"
      v-model="teamIdRef"
    >
      <option v-for="TeamId in totalTeams" :key="TeamId" :value="TeamId">
        {{ TeamId }}
      </option>
    </select>
    ,
    <div class="pt-2">also known as</div>
    <textarea
      type="text"
      class="p-3 font-serif italic w-2/3 opacity-80 rounded-lg"
      :placeholder="teamDescPlaceholderRef"
      v-model="descriptionRef"
      maxlength="40"
    />
  </div>
  <div class="w-1/2 m-auto flex flex-col">
    <router-link
      :to="
        teamProgressRef === 0
          ? { path: '/instructions', query: { tid: teamIdRef } }
          : {
              path: '/question',
              query: { tid: teamIdRef, qid: teamProgressRef },
            }
      "
    >
      <button @click="login" :disabled="disabledLoginRef" class="w-full">
        Login
      </button>
    </router-link>
    <router-link :to="{ path: '/instructions', query: { tid: teamIdRef } }">
      <button @click="login" class="w-full">Instructions</button>
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

  import questionBank from '../data/QuestionBank'
  const MAX_QUESTIONS = questionBank.length

  const teamIdRef = ref(undefined as unknown as number)
  const teamProgressRef = ref(0)
  const teamDescPlaceholderRef = ref('the best crew')
  const descriptionRef = ref('')
  const disabledLoginRef = ref(true)

  const totalTeams = Array.from({ length: 30 }, (_, i) => i + 1)

  const store = useStore()
  const teams = computed(() => store.getters.getTeams)

  import { useRoute } from 'vue-router'

  const route = useRoute()
  const teamId: number = parseInt(route.query.tid as string)
  store.dispatch('setCurrentTeam', { teamId: teamId })
  
  watch(teamIdRef, (currentValue: number) => {
    disabledLoginRef.value = false

    if (!teams.value) {
      return createOrUpdateTeam()
    }

    const team: Team = teams.value[currentValue]

    if (!team) return

    teamDescPlaceholderRef.value = team.description

    if (team.questions) {
      if (Object.keys(team.questions).length === MAX_QUESTIONS) {
        return (disabledLoginRef.value = true)
      }

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

    createOrUpdateTeam()

    store.dispatch('setCurrentTeam', { teamId: teamIdRef.value })
  }
</script>
