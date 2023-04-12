
<template>
  <div class="text-grey font-header text-xl py-2">Scavenger Hunt</div>
  <div class="my-1">
    my table number is 
    <select id="countries" class="rounded-lg p-1" v-model="teamNumber">
      <option v-for="teamNumber in totalTeams" :key="teamNumber" :value="teamNumber">
        {{ teamNumber }}
      </option>
    </select>
  </div>
  <div class="my-1">
    we are a bunch of
    <input type="text" class="rounded-lg p-1"/>
  </div>
  <router-link to="/introduction">
    <button>sign in</button>
  </router-link>
</template>
  
<script setup lang="ts">import { ref } from 'vue';

const teamNumber = ref('')
const totalTeams = Array.from({length: 30}, (_, i) => i + 1)
</script>