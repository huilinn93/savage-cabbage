
<template>
  <div class="text-grey font-header text-xl py-2 leading-10">Scavenger Hunt</div>
  <div class="my-3">
    we are a bunch of
    <input type="text" class="rounded-lg p-1" :placeholder="teamDescPlaceholderRef" v-model="description" />
  </div>
  <div class="my-1">
    from table
    <select id="teams" class="rounded-lg p-1" v-model="teamId" @change="onChange">
      <option v-for="TeamId in totalTeams" :key="TeamId" :value="TeamId">
        {{ TeamId }}
      </option>
    </select>
  </div>
  <div class="flex flex-col w-1/2 mx-auto my-5">
    <button v-if="computedTeamId">Resume Game</button>
    <button v-else @click="login">Login</button>
    <router-link to="/introduction" class="w-full">
      <button>
        Instructions
      </button>
      </router-link>
  </div>
</template>
  
<script setup lang="ts">import { ref } from 'vue';
import { getDatabase, ref as fbRef, child as fbChild, set as fbSet,onValue as fbOnValue, push as fbPush, update as fbUpdate } from "firebase/database"
import { firebaseApp } from "../firebase"
import { computed } from 'vue'
import { useStore } from 'vuex'

const teamId = ref()
const teamDescPlaceholderRef = ref('')

const teamProgress = ref(1)
const description = ref('')
const totalTeams = Array.from({length: 30}, (_, i) => i + 1)
const store = useStore()

const fbDatabase = getDatabase(firebaseApp)
const teamBankRef = fbRef(fbDatabase, 'teamsBank');

const onChange = (event: Event): void => {
  teamId.value = (event.target as HTMLInputElement).value

  fbOnValue(teamBankRef, (snapshot) => {
    const teamsBank = snapshot.val();
    const team = teamsBank[teamId.value]

    if (!team) return

    teamDescPlaceholderRef.value = team.description
    teamProgress.value = Object.keys(team.questions).length + 1
  })
}

const createOrUpdateTeam = () => {
  fbUpdate(fbRef(fbDatabase, 'teamsBank/' + teamId.value), {
      description: description.value,
      questions: {}
  });
}

const login = () => {
  if (!teamId.value) return
  if (!description.value) {
    description.value = teamDescPlaceholderRef.value
  }

  store.dispatch('login', { team: { id: teamId.value, description: description.value, teamProgress: teamProgress.value }})

  createOrUpdateTeam()
}

const computedTeamId = computed(() => store.getters.getTeamId)
</script>