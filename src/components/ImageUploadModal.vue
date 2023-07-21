<template>
  <Modal :dialogState="isUploadModalOpen">
    <div v-if="!isSubmittingRef">
      <div class="h-1/3">
        <img
          v-if="processedImageSrcRef"
          :src="processedImageSrcRef"
          class="object-scale-down w-1/2 m-auto"
        />
      </div>
      <div
        class="h-1/6 mx-auto my-5 bg-champagne rounded-lg p-4 shadow w-2/3 cursor-pointer"
      >
        <img
          v-if="processedImageSrcRef"
          :src="processedImageSrcRef"
          height="1"
          width="1"
        />
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
            !origFileRef ? 'select an image' : 'reselect an image'
          }}
        </label>
      </div>
    </div>
    <div v-else>
      {{ uploadProgressPercentage }}%
      <MoonLoader :loading="true" color="#3F474F" class="h-full w-full" />
    </div>
    <div class="flex flex-col h-1/6">
      <button
        class="w-2/3 mx-auto"
        @click="onUploadImageEmit"
        :disabled="!origFileRef || isSubmittingRef"
      >
        Submit
      </button>
      <button
        class="w-2/3 mx-auto bg-grey"
        :disabled="isSubmittingRef"
        @click="onUploadModalCloseEmit"
      >
        Cancel
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
  import { Ref, WritableComputedRef, computed, ref } from 'vue'
  import Modal from './Modal.vue'
  import { MoonLoader } from 'vue3-spinner'
  import uploadSvg from '../assets/icons/upload.svg'
  import Pica from 'pica'

  interface Props {
    isSubmittingRef: boolean
    isUploadModalOpen?: boolean
    uploadProgressPercentage?: number
  }
  const props = withDefaults(defineProps<Props>(), {
    isUploadModalOpen: false,
  })

  const emit = defineEmits(['closeUploadModal', 'uploadImage'])
  const onUploadImageEmit = () => {
    emit('uploadImage', computedOrigFileRef.value, processedImageBlobRef.value)
    computedOrigFileRef.value = null
    processedImageBlobRef.value = null
    processedImageSrcRef.value = ''
  }
  const onUploadModalCloseEmit = () => {
    computedOrigFileRef.value = null
    processedImageSrcRef.value = ''
    emit('closeUploadModal')
  }

  const processedImageBlobRef: Ref<Blob | null> = ref(null)
  const processedImageSrcRef = ref('')
  const origFileRef: Ref<File | null> = ref(null)
  const computedOrigFileRef: WritableComputedRef<File | null> = computed({
    get() {
      return origFileRef.value
    },
    set(newValue: File | null) {
      origFileRef.value = newValue ? newValue : null
    },
  })

  const onSelectFile = (event: Event) => {
    computedOrigFileRef.value = (event.target as HTMLInputElement).files![0]
    origFileRef.value && compressImage(origFileRef.value)
  }
  const compressImage = async (fileRef: File) => {
    if (!fileRef) return

    const maxScreenWidth = 768
    const maxScreenHeight = 576
    const preuploadImageWidthRef = ref()
    const preuploadImageHeightRef = ref()
    const widthToHeightRatio = ref()

    const reader = new FileReader()
    reader.readAsDataURL(fileRef)
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const image = new Image()
      image.src = event.target?.result as string

      image.onload = async () => {
        widthToHeightRatio.value = image.width / image.height

        preuploadImageWidthRef.value = maxScreenWidth
        preuploadImageHeightRef.value =
          maxScreenWidth / widthToHeightRatio.value

        if (preuploadImageHeightRef.value > maxScreenHeight) {
          preuploadImageHeightRef.value = maxScreenHeight
          preuploadImageWidthRef.value =
            maxScreenHeight * widthToHeightRatio.value
        }

        const pica = Pica()

        const newCanvas = document.createElement('canvas')
        newCanvas.height = preuploadImageHeightRef.value
        newCanvas.width = preuploadImageWidthRef.value

        await pica
          .resize(image, newCanvas)
          .then((result: any) => {
            processedImageSrcRef.value = result.toDataURL()
            result.toBlob((blob: Blob) => {
              processedImageBlobRef.value = blob
            })
          })
          .catch((error: any) => {
            console.error(error)
          })
      }
    }
  }
</script>

<style>
  .v-spinner {
    text-align: -webkit-center;
  }
</style>
