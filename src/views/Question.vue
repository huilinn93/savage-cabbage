<template>
  <div>
    <h1>Question {{ currentQuestionId + 1 }}</h1>
    {{ questions[currentQuestionId].description }}
  </div>
  <router-link v-if="hasNextQuestion" :to="{ name: 'question', params: { id: currentQuestionId + 1 }}">
    <button>
      next
    </button>
  </router-link>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
import { firebaseApp } from "../firebase"
import { getDatabase, ref as fbRef, onValue} from "firebase/database"

const currentQuestionId = ref(0)
const questions = ref([{description: ''}])
const hasNextQuestion = computed(() => currentQuestionId.value < questions.value.length)


const database = getDatabase(firebaseApp)
const questionBankRef = fbRef(database, 'root/questionBank');

onValue(questionBankRef, (snapshot) => {
  questions.value = snapshot.val()
})

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
