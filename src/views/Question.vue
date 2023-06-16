<template>
  <div>
    <h1 class="text-header italic text-sm">Hunt {{ currentQuestionIdRef }}</h1>
    <h1 class="text-header">{{ questionBank[currentQuestionIdRef - 1] }}</h1>
  </div>
  <div class="mx-auto">
    <div>Choose an Image</div>
    <input class="w-1/2" type="file"/>
  </div>
  <button
    v-if="hasNextQuestion"
    @click="onNextPageClick()"
    :disabled="!hasNextQuestion"
  >
    Next
  </button>
  <button
    class="w-1/2 mx-auto"
    v-else
    @click="() => router.push('/introduction')"
  >
    Thank you for participating!
  </button>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import questionBank from '../data/QuestionBankService'

  const MAX_QUESTIONS = questionBank.length

  const store = useStore()
  const teams = computed(() => store.getters.getTeams)

  const route = useRoute()
  const currentQuestionIdRef = ref(parseInt(route.query.qid as string))
  const proceedToNextQuestionRef = ref(true)

  const hasNextQuestion = computed(() => currentQuestionIdRef.value < MAX_QUESTIONS)

  const router = useRouter()
  const onNextPageClick = () => {
    const answer = window.confirm(
      "Lockin' it in?"
    )

    proceedToNextQuestionRef.value = answer
    if (answer) {
      router.push({query: { qid: currentQuestionIdRef.value + 1 }})
      return currentQuestionIdRef.value += 1
    } else {
      currentQuestionIdRef.value = parseInt(route.query.qid as string)
    }
  }

  // same as beforeRouteUpdate option with no access to `this`
  // onBeforeRouteUpdate(async (to, from) => {
    // only fetch the user if the id changed as maybe only the query or the hash changed
    // if (to.params.qid !== from.params.qid) {

    // }
  // })
</script>
