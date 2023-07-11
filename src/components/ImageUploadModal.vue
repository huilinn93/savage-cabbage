<template>
  <Modal :dialogState="isUploadModalOpen">
    <div v-if="!isSubmittingRef" class="py-6">
      <div
        class="mx-auto bg-champagne rounded-lg p-4 shadow w-2/3 cursor-pointer"
        >
        <input
        type="file"
        accept="image/jpeg, image/png"
        class="hidden"
        @change="onSelectFile"
        @click="(event: Event) => (event.target as HTMLInputElement).value = ''"
        id="fileInput"
        />
        <label for="fileInput">
          <img :src="uploadSvg" class="max-h-5 m-auto" />{{
            !selectFileRef
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
        :disabled="!selectFileRef || isSubmittingRef"
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
  import {
    ComputedRef,
    Ref,
    WritableComputedRef,
    computed,
    ref,
    watch,
  } from 'vue'
  import Modal from './Modal.vue'
  import { MoonLoader } from 'vue3-spinner'
  import uploadSvg from '../assets/icons/upload.svg'
  import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
  // import Pica from 'pica'

  interface Props {
    isSubmittingRef: boolean
    isUploadModalOpen?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    isUploadModalOpen: false,
  })

  const emit = defineEmits(['closeUploadModal', 'uploadImage'])
  const onUploadImageEmit = () => {
    emit('uploadImage', selectFileRef.value)
    computedSelectFileRef.value = null
  }
  const onUploadModalCloseEmit = () => {
    computedSelectFileRef.value = null
    emit('closeUploadModal')
  }

  const selectFileRef: Ref<File | null> = ref(null)
  const computedSelectFileRef: WritableComputedRef<File | null> = computed({
    get() {
      return selectFileRef.value
    },
    set(newValue: File | null) {
      console.log(newValue, 'newValue')
        selectFileRef.value = newValue ? newValue : null
    },
  })

  const onSelectFile = (event: Event) => {
    computedSelectFileRef.value = (event.target as HTMLInputElement).files![0]
  }

  // const compressImage = (fileRef: File) => {
  //   if (!fileRef) return

  //   const pica = Pica()
  //   const resizedCanvas = document.createElement('canvas')
  //   resizedCanvas.height = 768
  //   resizedCanvas.width = 576
  //   const reader = new FileReader()

  //   pica
  //     .resize(reader.readAsDataURL(fileRef), resizedCanvas)
  //     .then((result: any) => {
  //       console.log('resize done!', result)
  //       // computedSelectFileRef.value = result.toDataURL();
  //     })
  //     .catch((error: any) => {
  //       console.log('got error..')
  //       console.log(error)
  //     })
  // }
</script>

<style>
  .v-spinner {
    text-align: -webkit-center;
  }
</style>
