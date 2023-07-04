<template>
  <router-view />
  <router-link
    v-if="route.name !== 'home'"
    :to="{ path: '/' }"
    class="underline align-middle"
    ><img :src="homeSvg" class="max-h-5 m-auto" />Home
  </router-link>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import homeSvg from './assets/icons/login.svg'

  const route = useRoute()
</script>
