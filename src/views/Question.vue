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
  <button @click="onSubmitHuntClick" class="bg-green">
    {{ imageUrl ? 'Replace Hunt' : 'Submit Hunt' }}
  </button>
  <ImageUploadModal
    :isSubmittingRef="isSubmittingRef"
    :isUploadModalOpen="isUploadModalOpen"
    @uploadImage="onSubmitImage"
    @closeUploadModal="onCloseUploadModal"
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

  import { v4 as uuidv4 } from 'uuid'

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

  const teams = computed(() => store.getters.getTeams)
  const getCurrentTeam: ComputedRef<number> = computed(
    () => store.getters.getCurrentTeam
  )
  const router = useRouter()
  if (getCurrentTeam.value !== teamId) {
    window.alert('Pls log in first.')
    router.push('/')
  }

  const fetchImage = async (qid: number) => {
    try {
      const latestAnswerRef = ref('')

      isDownloadingRef.value = true

      const timestampArr = Object.keys(teams.value[teamId].questions[qid]).map(
        (x) => parseInt(x)
      )
      const latestTimestamp = timestampArr
        .sort((a: number, b: number) => b - a)[0]
        .toString()
      latestAnswerRef.value =
        teams.value[teamId].questions[qid][latestTimestamp].id

      const teamQuestionStoragePath = fbStorageRef(
        firebaseStorage,
        latestAnswerRef.value
      )

      if (!teamQuestionStoragePath) return
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
    fetchImage(newValue)
  })

  const onSubmitHuntClick = () => {
    isUploadModalOpen.value = true
  }

  const onSubmitImage = async (fileRef: File) => {
    if (!fileRef) return

    if (imageUrl.value) {
      const replaceExistingSubmission = window.confirm(
        'Replace existing submission?'
      )

      if (!replaceExistingSubmission) return
    }
    // disableSubmitRef.value = true
    isSubmittingRef.value = true

    const reader = new FileReader()
    reader.readAsDataURL(fileRef)
    reader.onload = async () => {
      const teamQuestionStoragePath = fbStorageRef(firebaseStorage, uuidv4())
      try {
        const uploadResponse = await fbStorageUploadBytes(
          teamQuestionStoragePath,
          fileRef as File
        )

        let imageUpdates: any = {}
        imageUpdates[Date.parse(uploadResponse.metadata.timeCreated)] = {
          id: uploadResponse.ref.name,
        }

        await fbUpdate(
          fbRef(
            fbDatabase,
            `teamsBank/${teamId}/questions/${currentQuestionId.value}`
          ),
          imageUpdates
        )

        fetchImage(currentQuestionId.value)

        window.alert('Upload successful!')
      } catch (error) {
        console.error(error, 'error')
        window.alert(`Upload failed; Pls try again.`)
      } finally {
        isUploadModalOpen.value = false
        isSubmittingRef.value = false
      }
    }
  }

  const onCloseUploadModal = () => {
    isUploadModalOpen.value = false
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
