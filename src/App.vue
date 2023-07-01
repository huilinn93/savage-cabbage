<template>
  <router-view />
  <div v-if="route.name !== 'home'">
    Go
    <router-link :to="{ path: '/' }" class="underline">Home</router-link>.
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

  const route = useRoute()
</script>
