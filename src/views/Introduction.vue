<template>
  <div class="font-serif">
    instructions
  </div>
  <router-link :to="`team/${computedTeamNumber}/question/${computedQuestionNumber}`">
    <button>Begin</button>
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
const computedTeamNumber = computed(() => store.getters.getTeamNumber)
const computedQuestionNumber = computed(() => store.getters.getTeamProgress)

const updateStore = () => store.dispatch('updateTeamProgress', { team: { teamProgress: 3 }})
const teamRef = fbRef(fbDatabase, 'teamsBank');
fbOnValue(teamRef, (snapshot) => {
  const teams: Team = snapshot.val();
console.log(teams, 'teamteamsss')
  for (const team in teams) {
    if(team === 'number') {
      // teamProgress.value = teams['questions']?.length || 1
    }
  }
});

// const newQnKey = fbPush(fbChild(fbRef(fbDatabase), 'teamsBank/2/questions'), {
//         3: '3something',
//         2: '22something',
//       }).key;
// const qnIdentifier = ref()
// qnIdentifier.value = newQnKey

const qnsData = {
      2: '2 more',
    }
  const fbUpdates: any = {}
  fbUpdates['/teamsBank/' + 2 + '/questions/'] = qnsData;

  // return fbUpdate(fbRef(fbDatabase), fbUpdates);
</script>