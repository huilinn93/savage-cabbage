<template>
  <h1 class="my-6">instructions</h1>
  <ol class="text-justify space-y-2 list-decimal list-inside font-sans mb-16">
    <li>Appoint a dedicated hunter (photographer + phone).</li>
    <li>Snap a photo to solve each given clue.</li>
    <li>First three teams to complete gets into the Brawling Round.</li>
    <li>Team with most likes from judges takes the win.</li>
  </ol>
  <button class="w-1/2 my-6" @click="onInstructionsModalClose">Close!</button>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const emit = defineEmits(['showModal'])
  const router = useRouter()

  const onInstructionsModalClose = () => {
    router.push('/')
    emit('showModal', false)
  }
</script>
