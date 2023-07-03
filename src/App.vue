<template>
  <router-view />
  <router-link
    v-if="route.name !== 'home'"
    :to="{ path: '/' }"
    class="underline align-middle"
    ><img :src="homeSvg" class="max-h-7 m-auto" /><span>
      Home
    </span>
    </router-link
  >
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import homeSvg from './assets/icons/login.svg'

  const route = useRoute()
</script>
