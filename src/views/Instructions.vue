<template>
  <h1 class="py-6">😽 Instructions 😽</h1>
  <ol class="text-justify space-y-2 list-decimal list-inside font-sans mb-16">
    <li>
      Welcome to photo scavenger hunt! Work as a table to submit photos as fast
      as possible.
    </li>
    <li>There will be a total of 7 hunts to complete - 1 photo per hunt.</li>
    <li>
      First 3 tables to submit photos for each hunt will qualify for the judging
      round, where the best* photos win!
    </li>
    <li>
      Winning table of each hunt wins a prize, so a total of 7 prizes up for
      grabs! 🍾
    </li>
  </ol>
  <div>*Best will be determined by our lovely emcees.</div>
  <button @click="begin()" :disabled="!isReadyGame">Begin!</button>
</template>

<script setup lang="ts">
  import { Question } from '../types'
  import { ref, Ref } from 'vue'

  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
    onValue as fbOnValue,
  } from 'firebase/database'
  import { firebaseApp } from '../firebase'

  import { useRoute, useRouter } from 'vue-router'
  const router = useRouter()
  const route = useRoute()

  const teamId: number = parseInt(route.query.tid as string)
  const currentQuestionId = parseInt(route.query.qid as string)
  const fbDatabase = getDatabase(firebaseApp)

  const isReadyGame: Ref<boolean> = ref(false)
  fbOnValue(fbRef(fbDatabase, 'questionsBank/'), (snapshot) => {
    const questionsBank =
      Object.entries(snapshot.val()).filter((el) => !!el) || []

    if (!questionsBank) return

    return isReadyGame.value = questionsBank.map(el => (el[1] as Question).activated).includes(true)
  })

  const begin = () => {
    router.push({
      path: '/question',
      query: { tid: teamId, qid: currentQuestionId },
    })
  }
</script>
