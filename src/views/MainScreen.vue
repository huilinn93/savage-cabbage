<template>Main Screen</template>

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
  } from 'firebase/storage'

  async function pageTokenExample() {
    const teamQuestionStoragePath = fbStorageRef(
      firebaseStorage,
      '/t29'
      // `/t${teamId}/q${currentQuestionId}`
    )

    // Fetch the first page of 100.
    const firstPage = await fbStorageList(teamQuestionStoragePath, { maxResults: 100 })
    console.log(firstPage, 'firstPage')
    // Use the result.
    // processItems(firstPage.items)
    // processPrefixes(firstPage.prefixes)

    // Fetch the second page if there are more elements.
    if (firstPage.nextPageToken) {
      const secondPage = await fbStorageList(teamQuestionStoragePath, {
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      })
      // processItems(secondPage.items)
      // processPrefixes(secondPage.prefixes)
    }
  }
  pageTokenExample()
</script>
