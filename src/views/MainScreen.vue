<template>
  Main Screen (in progress)
  <img :src="imageUrl" class="h-1/2 object-scale-down" />
</template>

<script setup lang="ts">
  import { firebaseApp, firebaseStorage } from '../firebase'
  import {
    getDatabase,
    ref as fbRef,
    update as fbUpdate,
  } from 'firebase/database'
  import {
    ref as fbStorageRef,
    uploadBytes as fbStorageUploadBytes,
    list as fbStorageList,
    getDownloadURL as fbStorageGetDownloadURL,
  } from 'firebase/storage'
  import { Ref, ref } from 'vue'

  const imageUrl: Ref<string> = ref('')
  const teamQuestionStoragePath = fbStorageRef(
    firebaseStorage,
    '/t29/q1'
    // `/t${teamId}/q${currentQuestionId}`
  )

  fbStorageGetDownloadURL(fbStorageRef(teamQuestionStoragePath))
    .then((url) => {
      imageUrl.value = url
    })
    .catch((error) => {
      console.error(error)
    })
</script>
