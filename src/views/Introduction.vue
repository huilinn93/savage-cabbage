<template>
  <div class="font-serif text-grey text-xl leading-10 uppercase">
    instructions
  </div>
  <div class="text-xs">
    <div class="p-2 flex-col space-y-2 my-3">
      <ul>1. Appoint a dedicated hunter (photographer + phone).</ul>
      <ul>2. Snap a photo for each clue you receive.</ul>
      <ul>3. First three teams to complete the hunt gets into the Brawling Round.</ul>
      <ul>4. The team that impresses the judges the most takes the win.</ul>
    </div>
  </div>
  <router-link v-if="computedteamId" :to="`team/${computedteamId}/questions/${teamProgress()}`">
    <button class="w-1/2">Continue Hunt!</button>
  </router-link>
  <router-link v-else to="/">
    <button class="w-1/2">Login</button>
  </router-link>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';

const route = useRoute()
const computedteamId = ref(route.query.id)

const store = useStore()
const currentTeam = computed(() => store.getters.getCurrentTeam)
const teams = computed(() => store.getters.getTeams)

const teamProgress = () => {
  if (!currentTeam) {
    store.dispatch('setCurrentTeam', { teamId: computedteamId.value, teamData: teams.value[computedteamId.value as string] })
  }

  return currentTeam.value.data.questions && Object.keys(currentTeam.value.data.questions).length > 1 ? Object.keys(currentTeam.value.data.questions).length + 1 : 1
}
</script>