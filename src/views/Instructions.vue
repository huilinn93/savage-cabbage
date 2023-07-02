<template>
  <h1>instructions</h1>
  <ol class="text-justify text-s space-y-2 list-decimal list-inside font-sans">
    <li>Appoint a dedicated hunter (photographer + phone).</li>
    <li>Snap a photo to solve each given clue.</li>
    <li>First three teams to complete gets into the Brawling Round.</li>
    <li>Team with most likes from judges takes the win.</li>
  </ol>
  <router-link
    v-if="!!getTeams && !!teamId && !!getCurrentTeam"
    :to="{ path: '/question', query: { tid: teamId, qid: teamProgress } }"
  >
    <button class="w-1/2">
      {{ teamProgress === 1 ? 'Begin' : 'Continue' }} Hunt!
    </button>
  </router-link>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const teamId: number = parseInt(route.query.tid as string)

  const store = useStore()
  const getCurrentTeam = computed(() => store.getters.getCurrentTeam)
  const getTeams = computed(() => store.getters.getTeams)

  const teamProgress = computed(() =>
    getTeams?.value[teamId]?.questions
      ? Object.keys(getTeams.value[teamId].questions).length + 1
      : 1
  )
</script>
