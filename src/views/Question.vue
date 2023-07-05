<template>
  <h1 class="h-1/6">
    <div class="italic text-sm">Hunt {{ currentQuestionId }}</div>
    <div class="leading-7">{{ questionBank[currentQuestionId - 1] }}</div>
  </h1>
  <div>
    <MoonLoader
      v-if="isDownloadingRef"
      :loading="isDownloadingRef"
      color="#3F474F"
      class="h-full w-full"
    />
    <div v-else>
      <img
        :src="imageUrl ? imageUrl : cameraSvg"
        class="object-scale-down h-full w-full pt-6"
      />
    </div>
  </div>
  <button @click="() => (isUploadModalOpen = true)" class="bg-green">
    {{ imageUrl ? 'click to replace' : 'click to submit' }}
  </button>
  <ImageUploadModal
    :isSubmittingRef="isSubmittingRef"
    :isUploadModalOpen="isUploadModalOpen"
    @uploadImage="onSubmitImage"
    @closeUploadModal="isUploadModalOpen = false"
  />
  <div class="justify-between flex flex-row">
    <button
      :disabled="currentQuestionId - 1 <= 0"
      @click="navigateQuestion('previous')"
      class="mr-auto w-2/5"
    >
      Prev Clue!
    </button>
    <button
      v-if="currentQuestionId < MAX_QUESTIONS"
      @click="navigateQuestion('next')"
      class="ml-auto w-2/5"
    >
      Next Clue!
    </button>
    <button v-else @click="router.push('/endHunt')">End Hunt!</button>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { ComputedRef, Ref, computed, ref, watch } from 'vue'
  import { MoonLoader } from 'vue3-spinner'
  import { useStore } from 'vuex'
  import ImageUploadModal from '../components/ImageUploadModal.vue'
  import cameraSvg from '../assets/icons/camera.svg'

  const isDownloadingRef = ref(false)
  const isSubmittingRef = ref(false)

  import questionBank from '../data/QuestionBank'

  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
  } from 'firebase/database'
  import { firebaseApp, firebaseStorage } from '../firebase'
  import {
    ref as fbStorageRef,
    uploadBytes as fbStorageUploadBytes,
    getDownloadURL as fbStorageGetDownloadURL,
  } from 'firebase/storage'

  const fbDatabase = getDatabase(firebaseApp)

  const MAX_QUESTIONS = questionBank.length

  const store = useStore()
  const route = useRoute()
  const teamId: number = parseInt(route.query.tid as string)
  const currentQuestionId = ref(parseInt(route.query.qid as string))

  const imageUrl = ref('')

  const fetchImage = async (qid: number) => {
    const teamQuestionStoragePath = fbStorageRef(
      firebaseStorage,
      `/t${teamId}/q${qid}`
    )
    if (!teamQuestionStoragePath) return

    try {
      isDownloadingRef.value = true
      const url = await fbStorageGetDownloadURL(teamQuestionStoragePath)

      if (!url) return

      imageUrl.value = url
    } catch (error) {
      return (imageUrl.value = '')
    } finally {
      isDownloadingRef.value = false
    }
  }

  fetchImage(currentQuestionId.value)

  watch(currentQuestionId, (newValue, currentValue) => {
    computedSelectFileRef.value = undefined
    disableSubmitRef.value = true

    fetchImage(newValue)
  })

  const getCurrentTeam: ComputedRef<number> = computed(
    () => store.getters.getCurrentTeam
  )
  const router = useRouter()
  if (getCurrentTeam.value !== teamId) {
    window.alert('Pls log in first.')
    router.push('/')
  }

  const computedSelectFileRef: Ref<File | undefined> = ref()
  const disableSubmitRef = ref(true)

  const onSubmitImage = async (fileRef: File) => {
    if (!fileRef) return

    if (imageUrl.value) {
      const replaceExistingSubmission = window.confirm(
        'Replace existing submission?'
      )

      if (!replaceExistingSubmission) return
    }
    disableSubmitRef.value = true
    isSubmittingRef.value = true

    const reader = new FileReader()
    reader.readAsDataURL(fileRef)
    reader.onload = async () => {
      const teamQuestionStoragePath = fbStorageRef(
        firebaseStorage,
        `/t${teamId}/q${currentQuestionId.value}`
      )

      try {
        const uploadResponse = await fbStorageUploadBytes(
          teamQuestionStoragePath,
          fileRef as File
        )

        await fbUpdate(
          fbRef(
            fbDatabase,
            'teamsBank/' + teamId + '/questions/' + uploadResponse.ref.name
          ),
          {
            storagePath: uploadResponse.ref.fullPath,
          }
        )

        fetchImage(currentQuestionId.value)

        window.alert('Upload successful!')
        isUploadModalOpen.value = false
      } catch {
        window.alert('Upload failed; Pls try again.')
      } finally {
        disableSubmitRef.value = false
        isSubmittingRef.value = false
      }
    }
  }

  const navigateQuestion = (navigation: string) => {
    navigation === 'next'
      ? (currentQuestionId.value += 1)
      : (currentQuestionId.value -= 1)

    router.push({
      query: {
        tid: teamId,
        qid: currentQuestionId.value,
      },
    })
  }

  const isUploadModalOpen = ref(false)
</script>

<style>
  .v-spinner {
    text-align: -webkit-center;
  }
</style>
