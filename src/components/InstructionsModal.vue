<template>
  <h1 class="py-6">instructions</h1>
  <ol class="text-justify space-y-2 list-decimal list-inside font-sans mb-16">
    <li>
      Welcome to photo scavenger hunt! Work as a table to submit photos as fast
      as possible.
    </li>
    <li>There will be a total of 7 hunts to complete - 1 photo per hunt.</li>
    <li>
      First 3 tables to submit photos for each hunt will qualify for the judging
      round, where the best* photo wins!
    </li>
    <li>
      Winning table of each hunt wins a prize, so a total of 7 prizes up for
      grabs! 🍾
    </li>
  </ol>
  <div>*Best will be determined by our lovely emcees.</div>
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
