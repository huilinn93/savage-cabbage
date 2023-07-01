<template>
  <div>
    <h1 class="text-header italic text-sm">Hunt {{ currentQuestionIdRef }}</h1>
    <h1 class="text-header">{{ questionBank[currentQuestionIdRef - 1] }}</h1>
  </div>
  <div class="flex flex-col">
    <div v-if="justUploadedRef">Choose an Image</div>
    <div v-else>Uploaded; Replace Image?</div>
    <input type="file" @change="uploadFile" ref="file" />
    <button
      @click="uploadImage()"
      :disabled="disableUploadRef"
      class="w-1/2 mx-auto bg-green"
    >
      Upload
    </button>
  </div>
  <div class="justify-between flex flex-row">
    <button
      v-if="hasPrevQuestion"
      @click="
        currentQuestionIdRef -= 1;
        router.push({
          query: {
            tid: teamId,
            qid: currentQuestionIdRef,
          },
        })
      "
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
      v-if="hasNextQuestion"
      @click="
        currentQuestionIdRef += 1;
        router.push({
          query: {
            tid: teamId,
            qid: currentQuestionIdRef,
          },
        })
      "
    >
      Next Clue!
    </button>
    <button
      v-else
      @click="
        router.push('/endHunt')
      "
    >
      End Hunt!
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { Ref, computed, ref } from 'vue'
  import { useStore } from 'vuex'
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

  const fbDatabase = getDatabase(firebaseApp)

  const MAX_QUESTIONS = questionBank.length

  const store = useStore()
  const getTeams = computed(() => store.getters.getTeams)
  const getCurrentTeam = computed(() => store.getters.getCurrentTeam)

  const route = useRoute()
  const teamId = route.query.tid as string
  const currentQuestionId: number = parseInt(route.query.qid as string)
  const currentQuestionIdRef = ref(currentQuestionId)

  const router = useRouter()
  if (getCurrentTeam.value.toString() !== teamId) {
    router.push('/goHomeToLogin')
  }

  const uploadFileRef: Ref<File | undefined> = ref()

  const disableUploadRef = ref(true)
  const uploadFile = (payload: Event) => {
    if (!payload.target || !(payload.target as HTMLInputElement).files) return

    uploadFileRef.value = (payload.target as HTMLInputElement).files![0]
    return (disableUploadRef.value = false)
  }

  const justUploadedRef = ref(true)
  const uploadImage = () => {
    if (
      (getTeams.value[`t${teamId}`] as Team).questions &&
      (getTeams.value[`t${teamId}`] as Team).questions[`q${currentQuestionId}`]
    ) {
      const replaceExistingSubmission = window.confirm(
        'Replace existing submission?'
      )

      if (!replaceExistingSubmission) return
    }

    const teamQuestionStoragePath = fbStorageRef(
      firebaseStorage,
      `/t${teamId}/q${currentQuestionId}`
    )

    uploadFileRef.value &&
      fbStorageUploadBytes(teamQuestionStoragePath, uploadFileRef.value).then(
        (snapshot) => {
          fbUpdate(
            fbRef(
              fbDatabase,
              'teamsBank/' + teamId + '/questions/' + snapshot.ref.name
            ),
            {
              storagePath: snapshot.ref.fullPath,
            }
          )
        }
      )

    return (justUploadedRef.value = false)
  }
  const hasPrevQuestion = computed(() => currentQuestionIdRef.value - 1 > 0)
  const hasNextQuestion = computed(() => currentQuestionIdRef.value < MAX_QUESTIONS)
</script>
