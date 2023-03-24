<script setup lang="ts">
import SetupLayout from '@/layouts/SetupLayout.vue'
import PlayLayout from './layouts/PlayLayout.vue'
import { ref } from 'vue'

const enum Stage {
	Setup,
	Play
}

const stage = ref(Stage.Setup)
const totalTime = ref(0)

const start = (time: number) => {
	totalTime.value = time
	stage.value = Stage.Play
}

</script>

<template>

  <main>
	<SetupLayout v-if="stage === Stage.Setup" @complete="start" />
	<PlayLayout :total-time="totalTime" v-if="stage === Stage.Play" @back="stage = Stage.Setup" />
  </main>
</template>
