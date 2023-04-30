<template>
  <div class="font-serif">
    instructions
  </div>
  <button>
    <router-link :to="{ name: 'question', params: { id: 0 } }">Begin</router-link>
  </button>
</template>

<script setup lang="ts">
</script>