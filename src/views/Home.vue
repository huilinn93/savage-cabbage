<template>
  <h1 class="text-grey font-header text-xxl mt-16">Scavenger Hunt</h1>
  <MoonLoader
    v-if="isLoadingRef"
    :loading="isLoadingRef"
    color="#3F474F"
    class="m-auto"
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
  import { ref, Ref, watch } from 'vue'
  import { MoonLoader } from 'vue3-spinner'
  import Modal from '../components/Modal.vue'
  import Instructions from '../components/InstructionsModal.vue'

  const isLoadingRef = ref(false)

  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
    onValue as fbOnValue,
  } from 'firebase/database'
  import { firebaseApp } from '../firebase'

  const fbDatabase = getDatabase(firebaseApp)

  import { computed } from 'vue'
  import { useStore } from 'vuex'

  import { Team, TOTAL_QUESTIONS } from '../types'

  const teamIdRef = ref(undefined as unknown as number)
  const teamProgressRef = ref(1)
  const teamDescPlaceholderRef = ref('the best crew')
  const descriptionRef = ref('')
  const disabledLoginRef = ref(true)

  const totalTeams = Array.from({ length: 30 }, (_, i) => i + 1)

  const totalQuestions: number = TOTAL_QUESTIONS

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

    if (team.questions && Object.keys(team.questions)) {
      if (Object.keys(team.questions).length < totalQuestions) {
        teamProgressRef.value = Object.keys(team.questions).length + 1
      } else {
        teamProgressRef.value = totalQuestions
      }
    } else {
      teamProgressRef.value = 1
    }
  })

  const createOrUpdateTeam = async () => {
    const targetDescription: string = descriptionRef.value || teamDescPlaceholderRef.value

    await fbUpdate(fbRef(fbDatabase, 'teamsBank/' + teamIdRef.value), {
      description: targetDescription,
    })
  }

  const login = async () => {
    isLoadingRef.value = true

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
