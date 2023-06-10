<template>
  <div class="text-grey font-header text-xl py-2 leading-10">
    Scavenger Hunt
  </div>
  <div class="my-1">
    table
    <select id="teams" class="rounded-lg p-1" v-model="teamIdRef">
      <option v-for="TeamId in totalTeams" :key="TeamId" :value="TeamId">
        {{ TeamId }}
      </option>
    </select>
    ,
  </div>
  <div class="my-3">
    also known as
    <input
      type="text"
      class="rounded-lg p-1"
      :placeholder="teamDescPlaceholderRef"
      v-model="descriptionRef"
    />
  </div>
  <div class="flex flex-col w-1/2 mx-auto my-5">
    <router-link
      :to="
        computedTeamProgress === 0
          ? 'introduction'
          : `team/${computedTeamId}/question/${computedTeamProgress}`
      "
      class="w-full"
    >
      <button @click="login" :disabled="!teamIdRef">Login</button>
    </router-link>
    <router-link to="introduction">
      <button>Instructions</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
  import { ComputedRef, ref, watch } from 'vue'
  import {
    getDatabase,
    ref as fbRef,
    child as fbChild,
    set as fbSet,
    onValue as fbOnValue,
    push as fbPush,
    update as fbUpdate,
  } from 'firebase/database'
  import { firebaseApp } from '../firebase'
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { Team } from '../types'

  const teamIdRef = ref()
  const teamDescPlaceholderRef = ref('')
  const teamProgressRef = ref(0)

  const descriptionRef = ref('')
  const totalTeams = Array.from({ length: 30 }, (_, i) => i + 1)

  const store = useStore()

  const fbDatabase = getDatabase(firebaseApp)
  const teamsBankRef = fbRef(fbDatabase, 'teamsBank')

  const teams = computed(() => store.getters.getTeams)

  watch(teamIdRef, (currentValue: string) => {
    // const team: Team = teamsBank[teamIdRef.value]
    // if (!team) {
    //   teamDescPlaceholderRef.value = ''
    //   teamProgressRef.value = 0
    // } else {
    // teamDescPlaceholderRef.value = team.description
    // if (!team.questions) return
    // teamProgressRef.value = Object.keys(team.questions).length + 1
    // }
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
  }
</script>
