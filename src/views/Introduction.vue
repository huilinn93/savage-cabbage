<template>
  <div class="font-serif">
    instructions
  </div>
  <div>
    <ul>1. Snap a photo for each clue you see on the next few screens.</ul>
  </div>
  <router-link v-if="computedTeamId" :to="`team/${computedTeamId}/question/${computedTeamProgress}`">
    <button>Continue Hunt!</button>
  </router-link>
  <router-link v-else to="/">
    <button>Login</button>
  </router-link>
  <!-- <button @click="updateStore">for testing</button> -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex'
import { firebaseApp } from "../firebase"
import { getDatabase, ref as fbRef, set as fbSet,onValue as fbOnValue } from "firebase/database"
import { Team } from '../types';

const fbDatabase = getDatabase(firebaseApp)
const store = useStore()
const computedTeamId = computed(() => store.getters.getTeamId)
const computedTeamProgress = computed(() => store.getters.getTeamProgress)

const updateStore = () => store.dispatch('updateTeamProgress', { team: { teamProgress: 3 }})
const teamsBankRef = fbRef(fbDatabase, 'teamsBank');

// const newQnKey = fbPush(fbChild(fbRef(fbDatabase), 'teamsBank/2/questions'), {
//         3: '3something',
//         2: '22something',
//       }).key;
// const qnIdentifier = ref()
// qnIdentifier.value = newQnKey

// const qnsData = {
//       2: '2 more',
//     }
//   const fbUpdates: any = {}
//   fbUpdates['/teamsBank/' + 2 + '/questions/'] = qnsData;

  // return fbUpdate(fbRef(fbDatabase), fbUpdates);
</script>