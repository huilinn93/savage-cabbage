<template>
  <GDialog v-model="dialogStateRef" persistent scrollable local>
    <div class="wrapper">
      <div class="content mx-5">
        <slot />
      </div>
    </div>
  </GDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
interface Props {
  dialogState?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
  dialogState: false,
})

const dialogStateRef = computed(() => props.dialogState)
</script>

<style>
.wrapper {
  background: url(../assets/images/DefaultBackground.png) no-repeat;
  /* background-size: cover; */
}
</style>