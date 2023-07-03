<template>
  <div>
    <h1 class="text-header italic text-sm">Hunt {{ currentQuestionId }}</h1>
    <h1 class="text-header">{{ questionBank[currentQuestionId - 1] }}</h1>
  </div>
  <img
    v-if="imageUrl && !isDownloadingRef"
    :src="imageUrl"
    class="h-1/4 object-scale-down"
  />
  <MoonLoader
    v-if="isDownloadingRef"
    :loading="isDownloadingRef"
    color="#3F474F"
    class="mx-auto h-1/4"
  />
  <div class="flex flex-col">
    <input
      id="selectFileInput"
      type="file"
      @change="onSelectFile"
      accept="image/jpeg, image/png"
      class="hidden"
    />
    <MoonLoader
      v-if="isSubmittingRef"
      :loading="isSubmittingRef"
      color="#3F474F"
      class="mx-auto bg-champagne rounded-lg p-2 w-2/3 my-1 shadow"
    />
    <label
      v-else
      :disabled="disableSubmitRef"
      class="w-2/3 mx-auto bg-champagne rounded-lg p-2 my-1 shadow"
      for="selectFileInput"
    >
      <img :src="cameraSvg" class="max-h-7 m-auto" /><span>{{
        computedSelectFileRef ? 'Selected' : 'Select'
      }}</span>
    </label>
    <button
      @click="onSubmitImage()"
      :disabled="disableSubmitRef"
      class="w-2/3 mx-auto bg-green"
    >
      <img :src="uploadSvg" class="max-h-7 m-auto" /><span
        class="capitalize text-sm"
      >
        Submit
      </span>
    </button>
  </div>
  <div class="justify-between flex flex-row">
    <button
      v-if="currentQuestionId - 1 > 0"
      @click="navigateQuestion('previous')"
    >
      Prev Clue!
    </button>
    <button
      v-else
      @click="
        router.push({
          path: '/instructions',
          query: {
            tid: teamId,
          },
        })
      "
    >
      Instructions
    </button>
    <button
      v-if="currentQuestionId < MAX_QUESTIONS"
      @click="navigateQuestion('next')"
    >
      Next Clue!
    </button>
    <button v-else @click="router.push('/endHunt')">End Hunt!</button>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
  import { ComputedRef, Ref, computed, ref, watch } from 'vue'
  import { MoonLoader } from 'vue3-spinner'
  import { useStore } from 'vuex'

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


  import cameraSvg from '../assets/icons/camera.svg'
  import uploadSvg from '../assets/icons/upload.svg'

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
    selectFileRef.value = undefined
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

  const selectFileRef: Ref<File | undefined> = ref()
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
  const disableSubmitRef = ref(true)

  const onSelectFile = (payload: Event) => {
    if ((payload.target as HTMLInputElement)?.files?.length === 0) {
      if (!computedSelectFileRef.value && !selectFileRef.value) {
        return (disableSubmitRef.value = true)
      }

      return
    }

    computedSelectFileRef.value = (payload.target as HTMLInputElement)
      .files![0] as File

    return (disableSubmitRef.value = false)
  }

  const onSubmitImage = async () => {
    if (!computedSelectFileRef.value) return

    if (imageUrl) {
      const replaceExistingSubmission = window.confirm(
        'Replace existing submission?'
      )

      if (!replaceExistingSubmission) return
    }
    disableSubmitRef.value = true
    isSubmittingRef.value = true

    const reader = new FileReader()
    reader.readAsDataURL(computedSelectFileRef.value)
    reader.onload = async () => {
      const teamQuestionStoragePath = fbStorageRef(
        firebaseStorage,
        `/t${teamId}/q${currentQuestionId.value}`
      )

      try {
        const uploadResponse = await fbStorageUploadBytes(
          teamQuestionStoragePath,
          computedSelectFileRef.value as File
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

        computedSelectFileRef.value = undefined
        selectFileRef.value = undefined
        fetchImage(currentQuestionId.value)

        window.alert('Upload successful!')
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
</script>

<style>
  .v-spinner {
    text-align: -webkit-center;
  }
</style>
