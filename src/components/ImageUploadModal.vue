<template>
  <Modal :dialogState="isUploadModalOpen">
    <div v-if="!isSubmittingRef" class="py-6">
      <div
        class="mx-auto bg-champagne rounded-lg p-4 shadow w-2/3 cursor-pointer"
      >
        <input
          id="selectFileInput"
          type="file"
          @change="onSelectFile"
          accept="image/jpeg, image/png"
          class="hidden"
        />
        <label for="selectFileInput">
          <img :src="uploadSvg" class="max-h-5 m-auto" />{{
            !computedSelectFileRef
              ? 'select an image'
              : 'image selected; click to reselect'
          }}
        </label>
      </div>
    </div>
    <MoonLoader
      v-else
      :loading="true"
      color="#3F474F"
      class="h-full w-full pt-6"
    />
    <div class="flex flex-col py-6">
      <button
        class="w-2/3 mx-auto"
        @click="onUploadImageEmit"
        :disabled="!computedSelectFileRef || isSubmittingRef"
      >
        Submit
      </button>
      <button class="w-2/3 mx-auto bg-grey" @click="onUploadModalCloseEmit">
        Cancel
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
  import { Ref, computed, ref } from 'vue'
  import Modal from './Modal.vue'
  import { MoonLoader } from 'vue3-spinner'
  import uploadSvg from '../assets/icons/upload.svg'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

  interface Props {
    isSubmittingRef: boolean
    isUploadModalOpen?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    isUploadModalOpen: false,
  })

  const emit = defineEmits([
    'closeUploadModal',
    'uploadImage',
  ])
  const onUploadImageEmit = () => {
    emit('uploadImage', computedSelectFileRef.value)
  }
  const onUploadModalCloseEmit = () => {
    emit('closeUploadModal')
  }

  const selectFileRef: Ref<File | null> = ref(null)
  const computedSelectFileRef = computed({
    get() {
      return selectFileRef.value
    },
    set(newValue) {
      selectFileRef.value = newValue
        ? (selectFileRef.value = newValue)
        : selectFileRef.value
    },
  })

  const onSelectFile = (payload: Event) => {
    if ((payload.target as HTMLInputElement)?.files?.length === 0) {

      return
    }

    computedSelectFileRef.value = (payload.target as HTMLInputElement)
      .files![0] as File
  }

  onBeforeRouteUpdate(() => {
    selectFileRef.value = null
  })
</script>

<style>
  .v-spinner {
    text-align: -webkit-center;
  }
</style>
