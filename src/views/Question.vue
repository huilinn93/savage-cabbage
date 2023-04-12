<template>
  <h1>
    Question {{ currentQuestionId }}
  </h1>
  <p>
    description: {{ questions[currentQuestionId - 1].content}}
  </p>

  <router-link v-if="currentQuestionId < questions.length" :to="{ name: 'question', params: { id: currentQuestionId + 1 } }">
    <button>next</button>
  </router-link>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import questions from '../data/questions';

// // same as beforeRouteLeave option with no access to `this`
// onBeforeRouteLeave((to, from) => {
//   console.log(to, '<----onBeforeRouteLeave---->', from)
//       const answer = window.confirm(
//         'Do you really want to leave? you have unsaved changes!'
//       )
//       // cancel the navigation and stay on the same page
//       if (!answer) return false
// })

const currentQuestionId = ref(1)

// same as beforeRouteUpdate option with no access to `this`
onBeforeRouteUpdate(async (to, from) => {
  console.log('currentQuestionId.value', currentQuestionId.value)
  // only fetch the user if the id changed as maybe only the query or the hash changed
  if (to.params.id !== from.params.id) {
    currentQuestionId.value = +to.params.id
    // questionData.value = await fetchQuestion(to.params.id)
  }
})
</script>
