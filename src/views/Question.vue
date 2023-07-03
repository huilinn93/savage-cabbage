<template>
  <div>
    <h1 class="text-header italic text-sm">Hunt {{ currentQuestionIdRef }}</h1>
    <h1 class="text-header">{{ questionBank[currentQuestionIdRef - 1] }}</h1>
  </div>
  <div class="flex flex-col">
    <input
      id="selectFileInput"
      type="file"
      @change="selectFile"
      accept="image/jpeg, image/png"
      class="hidden"
    />
    <MoonLoader
      v-if="isLoadingRef"
      :loading="isLoadingRef"
      color="#3F474F"
      class="mx-auto"
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
    <button v-if="hasPrevQuestion" @click="navigateQuestion('previous')">
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
    <button v-if="hasNextQuestion" @click="navigateQuestion('next')">
      Next Clue!
    </button>
    <button v-else @click="router.push('/endHunt')">End Hunt!</button>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
  import { ComputedRef, Ref, computed, ref } from 'vue'
  import { MoonLoader } from 'vue3-spinner'
  import { useStore } from 'vuex'

  const isLoadingRef = ref(false)

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
  } from 'firebase/storage'

  import { Team } from '../types'

  import cameraSvg from '../assets/icons/camera.svg'
  import uploadSvg from '../assets/icons/upload.svg'

  const fbDatabase = getDatabase(firebaseApp)

  const MAX_QUESTIONS = questionBank.length

  const store = useStore()
  const route = useRoute()
  const teamId: number = parseInt(route.query.tid as string)
  const currentQuestionId: number = parseInt(route.query.qid as string)
  const currentQuestionIdRef = ref(currentQuestionId)
  const hasExistingImageRef = () => {
    const getTeams = computed(() => store.getters.getTeams)

    if (!getTeams.value[teamId].questions) return false

    return Object.keys((getTeams.value[teamId] as Team).questions).includes(
      `q${currentQuestionIdRef.value}`
    )
  }

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

  const selectFile = (payload: Event) => {
    if ((payload.target as HTMLInputElement)?.files?.length === 0) {
      if (!computedSelectFileRef.value && !selectFileRef.value) {
        return disableSubmitRef.value = true
      }

      return
    }

    computedSelectFileRef.value = (payload.target as HTMLInputElement)
      .files![0] as File

    return (disableSubmitRef.value = false)
  }

  const onSubmitImage = async () => {
    if (!computedSelectFileRef.value) return

    disableSubmitRef.value = true
    isLoadingRef.value = true

    if (hasExistingImageRef()) {
      const replaceExistingSubmission = window.confirm(
        'Replace existing submission?'
      )

      if (!replaceExistingSubmission) {
        disableSubmitRef.value = false
        isLoadingRef.value = false

        return
      }
    }

    const reader = new FileReader()
    reader.readAsDataURL(computedSelectFileRef.value)
    reader.onload = async () => {
      const teamQuestionStoragePath = fbStorageRef(
        firebaseStorage,
        `/t${teamId}/q${currentQuestionId}`
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

        window.alert('Upload successful!')
      } catch {
        window.alert('Upload failed; Pls try again.')
      } finally {
        disableSubmitRef.value = false
        isLoadingRef.value = false
        computedSelectFileRef.value = undefined
      }
    }
  }

  const hasPrevQuestion = computed(() => currentQuestionIdRef.value - 1 > 0)
  const hasNextQuestion = computed(
    () => currentQuestionIdRef.value < MAX_QUESTIONS
  )

  const navigateQuestion = (navigation: string) => {
    switch (navigation) {
      case 'next':
        currentQuestionIdRef.value += 1
        break
      case 'previous':
        currentQuestionIdRef.value -= 1
        break
    }

    router.push({
      query: {
        tid: teamId,
        qid: currentQuestionIdRef.value,
      },
    })
  }

  onBeforeRouteUpdate((to, from) => {
    selectFileRef.value = undefined
    computedSelectFileRef.value = undefined
    disableSubmitRef.value = true

    if (
      !from.query.tid ||
      !from.query.qid ||
      (from.query.qid &&
        currentQuestionIdRef.value !== parseInt(to.query.qid as string))
    ) {
      return router.push('/')
    }
  })
</script>
