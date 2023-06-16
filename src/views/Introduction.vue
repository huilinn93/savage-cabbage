<template>
  <h1>instructions</h1>
  <div class="text-xs">
    <div class="space-y-2">
      <ul>
        1. Appoint a dedicated hunter (photographer + phone).
      </ul>
      <ul>
        2. Snap a photo for each clue you receive.
      </ul>
      <ul>
        3. First three teams to complete the hunt gets into the Brawling Round.
      </ul>
      <ul>
        4. Team that rakes up most likes from judges takes the win.
      </ul>
    </div>
  </div>
  <router-link
    v-if="teamIdRef"
    :to="{ path: '/question', query: { tid: teamIdRef, qid: teamProgress() } }"
  >
    <button class="w-1/2">Continue Hunt!</button>
  </router-link>
  <router-link v-else to="/">
    <button class="w-1/2">Login</button>
  </router-link>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const teamIdRef = ref(route.query.tid)

  const store = useStore()
  const currentTeam = computed(() => store.getters.getCurrentTeam)
  const teams = computed(() => store.getters.getTeams)

  const teamProgress = () => {
    if (!currentTeam) {
      store.dispatch('setCurrentTeam', {
        teamId: teamIdRef.value,
        teamData: teams.value[teamIdRef.value as string],
      })
    }

    if (Object.keys(currentTeam.value.data).includes('questions')) {
      return Object.keys(currentTeam.value.data.questions).length + 1
    } else {
      return 1
    }
  }
</script>
