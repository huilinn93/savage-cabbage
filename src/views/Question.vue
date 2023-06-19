<template>
  <div>
    <h1 class="text-header italic text-sm">Hunt {{ currentQuestionIdRef }}</h1>
    <h1 class="text-header">{{ questionBank[currentQuestionIdRef - 1] }}</h1>
  </div>
  <div class="flex flex-col">
    <div>Choose an Image</div>
    <input type="file" />
    <button @click="uploadImage()" class="w-1/2 mx-auto bg-green">
      Upload
    </button>
  </div>
  <div class="justify-between flex flex-row">
    <router-link
      v-if="hasPrevQuestion"
      :to="{
        query: {
          tid: teamId,
          qid: currentQuestionIdRef - 1,
        },
      }"
    >
      <button @click="onPrevPageClick" class="w-full">Prev Clue!</button>
    </router-link>
    <router-link v-else :to="{ path: '/instructions', query: { tid: teamId } }">
      <button class="w-full">Instructions</button>
    </router-link>
    <router-link
      v-if="hasNextQuestion"
      :to="{
        query: {
          tid: teamId,
          qid: currentQuestionIdRef + 1,
        },
      }"
    >
      <button v-if="hasNextQuestion" @click="onNextPageClick" class="w-full">
        Next Clue!
      </button>
    </router-link>
    <button v-else @click="router.push('/instructions')">
      End Hunt!
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { ComputedRef, computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import questionBank from '../data/QuestionBank'

  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
  } from 'firebase/database'
  import { firebaseApp } from '../firebase'
  import { Team } from '../types'

  const fbDatabase = getDatabase(firebaseApp)

  const MAX_QUESTIONS = questionBank.length

  const store = useStore()
  const teams = computed(() => store.getters.getTeams)

  const route = useRoute()
  const teamId = route.query.tid as string
  const currentQuestionIdRef = ref(parseInt(route.query.qid as string))

  const uploadImage = () => {
    if ((teams.value[teamId] as Team).questions[currentQuestionIdRef.value].answer) {
      const existingSubmission = window.confirm(
        "Replace existing submission?"
      )

      if (!existingSubmission) return
    }

    // TODO: upload image into cloud storage
    fbUpdate(
      fbRef(
        fbDatabase,
        'teamsBank/' + teamId + '/questions/' + currentQuestionIdRef.value
      ),
      {
        answer: 'some other image url',
      }
    )
  }
  const hasPrevQuestion = computed(() => currentQuestionIdRef.value - 1 > 0)
  const hasNextQuestion = computed(
    () => currentQuestionIdRef.value < MAX_QUESTIONS
  )

  const router = useRouter()
  const onPrevPageClick = () => (currentQuestionIdRef.value -= 1)
  const onNextPageClick = () => (currentQuestionIdRef.value += 1)

  // same as beforeRouteUpdate option with no access to `this`
  // onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  // if (to.params.qid !== from.params.qid) {

  // }
  // })
</script>
