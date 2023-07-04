<template>
  <GDialog v-model="dialogStateRef" max-width="400" persistent scrollable local>
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

<style scoped>
background-image: url('../assets/images/Background.png');
</style>