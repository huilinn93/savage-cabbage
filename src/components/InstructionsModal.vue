<template>
  <h1 class="py-6">instructions</h1>
  <ol class="text-justify space-y-2 list-decimal list-inside font-sans mb-16">
    <li>You are photohunters working together to complete 7 tasks.</li>
    <li>You may submit as many photos for each question as you like - they will all be live streamed but only the final one will be taken into account.</li>
    <li>First 3 teams (by tables) to complete all 7 tasks gets into the next round.</li>
    <li>Winner will be picked amongst the 3 teams.</li>
  </ol>
  May the best man (no pun intended)/ woman win.
  <button class="w-2/3 my-6" @click="onInstructionsModalClose">Close!</button>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const emit = defineEmits(['closeInstructionsModal'])
  const router = useRouter()

  const onInstructionsModalClose = () => {
    router.push('/')
    emit('closeInstructionsModal')
  }
</script>
