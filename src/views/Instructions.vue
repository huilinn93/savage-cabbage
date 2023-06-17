<template>
  <h1>instructions</h1>
  <ol class="text-justify text-xs space-y-2 list-decimal list-inside">
    <li>Appoint a dedicated hunter (photographer + phone).</li>
    <li>Snap a photo to solve each given clue.</li>
    <li>First three teams to complete gets into the Brawling Round.</li>
    <li>Team with most likes from judges takes the win.</li>
  </ol>
  <router-link
    v-if="teamId && teamProgress"
    :to="{ path: '/question', query: { tid: teamId, qid: teamProgress } }"
  >
    <button class="w-1/2">Continue Hunt!</button>
  </router-link>
  <router-link v-else to="/">
    <button class="w-1/2">Login</button>
  </router-link>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const teamId = route.query.tid as string

  const store = useStore()
  const teams = computed(() => store.getters.getTeams)

  const teamProgress = computed(() => {
    if (!teams.value[teamId]) return false

    return teams.value[teamId].questions
      ? teams.value[teamId].questions.length
      : 1
  })
</script>
