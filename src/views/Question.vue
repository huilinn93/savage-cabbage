<template>
  <div>
    <h1>Question {{ currentQuestionId + 1 }}</h1>
    {{ questions[currentQuestionId].description }}
    currentQuestionId: {{ currentQuestionId }}
  </div>
  <router-link :to="{ name: 'question', params: { tid: currentTeamId, qid: currentQuestionId + 1 }}">
    <button v-if="hasNextQuestion" @click="onNextPageClick()">
      next
    </button>
  </router-link>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { computed, ref } from 'vue';
import { firebaseApp } from "../firebase"
import { getDatabase, ref as fbRef, get as fbGet, child} from "firebase/database"

// TODO: retrieve current team id
const currentTeamId = ref(0)

const currentQuestionId = ref(0)
const questions = ref([{description: ''}])
const hasNextQuestion = computed(() => {
  return currentQuestionId.value < questions.value.length
})
const onNextPageClick = ():void => {
  currentQuestionId.value+=1
}

// retrieve question bank data
const database = getDatabase(firebaseApp)
const questionBankRef = fbRef(database, 'root/questionBank');

fbGet(child(questionBankRef, 'root/questionBank')).then((snapshot) => {
  if (snapshot.exists()) {
    questions.value = snapshot.val()
  } else {
    console.log("No question found");
  }
}).catch((error) => {
  console.error(error);
});

// // same as beforeRouteLeave option with no access to `this`
// onBeforeRouteLeave((to, from) => {
//   console.log(to, '<----onBeforeRouteLeave---->', from)
//       const answer = window.confirm(
//         'Do you really want to leave? you have unsaved changes!'
//       )
//       // cancel the navigation and stay on the same page
//       if (!answer) return false
// })

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
