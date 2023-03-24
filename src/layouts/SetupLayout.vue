<template>
	<Card class="space-y-2">
		<div>
			<div class="text-lg">
				<label><span class="font-medium">Минут:</span> <input type="number" :min="0" class="bg-transparent w-10" v-model="totalMinutes"></label>
				<label><span class="font-medium">Секунд:</span> <input type="number" :min="0" :max="60" class="bg-transparent w-10" v-model="totalSeconds"></label>
			</div>
		</div>
		<div>
			<h2 class="text-2xl mb-3">Игроки</h2>
			<ul class="space-y-1 mb-3">
				<li v-for="player, idx in players" :key="player.id" class="p-1 border border-neutral-400 leading-tight">
					<button class="absolute top-1 right-1" @click="players.splice(idx, 1)">Удалить</button>
					<input type="text" class="bg-transparent text-lg font-medium block" v-model="player.name">
					{{ format(timePerPlayer) }}
				</li>
			</ul>
			<form @submit.prevent="addNewPlayer">
				<div class="flex gap-x-1">
					<input v-model="newPlayerName" type="text" class="bg-transparent grow border border-neutral-400 px-1" placeholder="Имя">
					<button type="submit" class="transition ease-in-out duration-300 bg-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded px-2">Добавить</button>
				</div>
			</form>
		</div>
	</Card>
	<button class="w-full text-4xl font-medium mt-3 bg-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded-lg p-2 align-middle" @click="$emit('complete', totalTime)">Готово</button>
</template>

<script setup lang="ts">
	import Card from '@/components/Card.vue'
	import { useTimeFormatter } from '@/composables/useTimeFormatter'
	import { usePlayersStore } from '@/stores/players'
	import { computed, ref, watch } from 'vue'

	const { players, addPlayer } = usePlayersStore()
	const newPlayerName = ref('')
	const totalMinutes = ref(6)
	const totalSeconds = ref(0)
	const totalTime = computed(() => Math.min(180 * 60 * 1000, Math.max(1000 * (totalSeconds.value + 60 * (totalMinutes.value)), 0)))
	const { format } = useTimeFormatter()

	defineEmits(['complete'])

	const addNewPlayer = () => {
		if (addPlayer(newPlayerName.value))
			newPlayerName.value = ''
	}

	const timePerPlayer = computed(() => totalTime.value / players.length)
</script>
