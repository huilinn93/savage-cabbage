<template>
  <h1 class="text-grey font-header text-xxl mt-16">Scavenger Hunt</h1>
  <MoonLoader
    v-if="isLoadingRef"
    :loading="isLoadingRef"
    color="#3F474F"
    class="mx-auto"
  />
  <div v-else class="font-sans">
    table
    <select
      id="teams"
      class="p-1 font-serif opacity-80 rounded-lg"
      v-model="teamIdRef"
    >
      <option v-for="TeamId in totalTeams" :key="TeamId" :value="TeamId">
        {{ TeamId }}
      </option>
    </select>
    ,
    <div class="pt-2">also known as</div>
    <textarea
      name="description"
      type="text"
      class="p-3 font-serif italic opacity-80 rounded-lg"
      :placeholder="teamDescPlaceholderRef"
      v-model="descriptionRef"
      maxlength="40"
    />
  </div>
  <div class="flex flex-col my-16">
    <button @click="login()" :disabled="disabledLoginRef" class="w-full">
      Login
    </button>
    <button
      @click="() => (isInstructionsModalOpen = true)"
      class="w-full bg-grey"
    >
      Instructions
    </button>
    <Modal :dialogState="isInstructionsModalOpen">
      <Instructions @closeInstructionsModal="isInstructionsModalOpen = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { MoonLoader } from 'vue3-spinner'
  import Modal from '../components/Modal.vue'
  import Instructions from '../components/InstructionsModal.vue'

  const isLoadingRef = ref(false)

  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
  } from 'firebase/database'
  import { firebaseApp, firebaseStorage } from '../firebase'

  const fbDatabase = getDatabase(firebaseApp)

  import { ref as fbStorageRef, list as fbStorageList } from 'firebase/storage'

  import { computed } from 'vue'
  import { useStore } from 'vuex'

  import { Team } from '../types'

  import questionBank from '../data/QuestionBank'
  const MAX_QUESTIONS = questionBank.length

  const teamIdRef = ref(undefined as unknown as number)
  const teamProgressRef = ref(0)
  const teamDescPlaceholderRef = ref('the best crew')
  const descriptionRef = ref('')
  const disabledLoginRef = ref(true)

  const totalTeams = Array.from({ length: 30 }, (_, i) => i + 1)

  const store = useStore()
  const teams = computed(() => store.getters.getTeams)

  import { useRoute, useRouter } from 'vue-router'
  const router = useRouter()

  const route = useRoute()
  const teamId: number = parseInt(route.query.tid as string)
  store.dispatch('setCurrentTeam', { teamId: teamId })

  watch(teamIdRef, (currentValue: number) => {
    disabledLoginRef.value = false

    if (!teams.value) {
      return createOrUpdateTeam()
    }

    const team: Team = teams.value[currentValue]

    if (!team) return

    teamDescPlaceholderRef.value = team.description

    const teamSubmissionStoragePath = fbStorageRef(
      firebaseStorage,
      `/t${currentValue}`
    )

    fbStorageList(teamSubmissionStoragePath).then((fetchTeamImages) => {
      if (fetchTeamImages.items.length === MAX_QUESTIONS) {
        return (disabledLoginRef.value = true)
      }
    })

    teamProgressRef.value =
      team.questions && Object.keys(team.questions)
        ? Object.keys(team.questions).length + 1
        : 1
  })

  const createOrUpdateTeam = async () => {
    await fbUpdate(fbRef(fbDatabase, 'teamsBank/' + teamIdRef.value), {
      description: descriptionRef.value,
    })
  }

  const login = async () => {
    isLoadingRef.value = true

    if (!descriptionRef.value) {
      descriptionRef.value = teamDescPlaceholderRef.value
    }

    await createOrUpdateTeam()

    await store.dispatch('setCurrentTeam', { teamId: teamIdRef.value })
    router.push({
      path: '/question',
      query: { tid: teamIdRef.value, qid: teamProgressRef.value },
    })

    isLoadingRef.value = false
  }

  const isInstructionsModalOpen = ref(false)
</script>
