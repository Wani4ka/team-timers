<template>
	<div>
		<div class="grid grid-cols-2 sm:grid-cols-5 gap-1 md:gap-3 place-content-around select-none">
			<div v-for="player, idx in players" class="w-[10vw] min-w-[125px] text-center p-1" :class="{
				'bg-neutral-800 text-black': player.timeLeft <= 0,
				'bg-neutral-600 text-white': player.timeLeft > 0 && currentPlayer !== idx,
				'bg-blue-400 text-black': currentPlayer === idx,
			}" @click="currentPlayer = idx">
				<h2 class="text-2xl text-truncate">{{ player.name }}</h2>
				<span class="text-xl tabular-nums">{{ format(player.timeLeft) }}</span>.<span class="text-lg tabular-nums">{{ formatMillis(player.timeLeft) }}</span>
			</div>
		</div>
		<div class="w-full mt-8 text-white text-center tabular-nums select-none">
			<svg class="absolute top-0 left-0 w-full h-full">
				<linearGradient id="main" x1="0" x2="0" y1="0" y2="1">
					<stop v-for="(step, index) in timerColors[color].main" :key="index" :stop-color="step" :offset="`${index / (timerColors[color].main.length-1) * 100}%`"></stop>
				</linearGradient>
				<linearGradient id="background" x1="0" x2="0" y1="0" y2="1">
					<stop v-for="(step, index) in timerColors[color].background" :key="index" :stop-color="step" :offset="`${index / (timerColors[color].background.length-1) * 100}%`"></stop>
				</linearGradient>
				<rect x="2" y="2" :width="`calc(100% - 4px)`" height="calc(100% - 4px)"
				fill="url(#background)" />
				<rect x="2" y="2" :width="`calc(${timeLeft / totalTime * 100}% - 4px)`" height="calc(100% - 4px)"
				fill="url(#main)" />
				<rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
					:stroke="timerColors[color].stroke"
					stroke-width="2"
					fill="none" />
			</svg>
			<span class="text-5xl">{{ format(timeLeft) }}</span>.<span class="text-3xl">{{ formatMillis(timeLeft) }}</span>
		</div>
		<div class="flex">
			<button
				@click="next"
				class="mx-auto w-40 h-20 rounded-full mt-8 text-4xl bg-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded-lg p-2 align-middle"
			>Далее</button>
		</div>
		<div class="flex mt-8 gap-x-6 text-xl">
			<button
				@click="back"
				class="basis-1/3 bg-neutral-400 dark:bg-neutral-800 rounded-lg p-2 align-middle"
				:class="{
					'hover:bg-neutral-200 dark:hover:bg-neutral-600': !launched,
					'cursor-default': launched,
				}"
			>Назад</button>
			<button
				@click="togglePause"
				class="basis-1/3 bg-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded-lg p-2 align-middle"
			>{{ launched ? 'Пауза' : 'Запуск' }}</button>
			<button
				@click="reset"
				class="basis-1/3 bg-neutral-400 dark:bg-neutral-800 rounded-lg p-2 align-middle"
				:class="{
					'hover:bg-neutral-200 dark:hover:bg-neutral-600': !launched,
					'cursor-default': launched,
				}"
			>Сброс</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTimeFormatter } from '@/composables/useTimeFormatter'
import type { TimedPlayer } from '@/interfaces/player'
import { usePlayersStore } from '@/stores/players'
import { computed, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
	totalTime: {
		type: Number,
		required: true
	}
})

interface ColorScheme {
	main: string[]
	background: string[]
	stroke: string
}

const timerColors: { [k: string]: ColorScheme } = {
	blue: {
		main: ['#2563eb', '#1d4ed8', '#2563eb'],		// blue 600-700-600
		background: ['#075985', '#0c4a6e', '#075985'],	// sky 800-900-800
		stroke: '#164e63'								// cyan 900
	},
	yellow: {
		main: ['#ca8a04', '#a16207', '#ca8a04'],		// yellow 600-700-600
		background: ['#92400e', '#78350f', '#92400e'],	// amber 800-900-800
		stroke: '#7c2d12'								// cyan 900
	},
	red: {
		main: ['#dc2626', '#b91c1c', '#dc2626'],		// red 600-700-600
		background: ['#9f1239', '#881337', '#9f1239'],	// rose 800-900-800
		stroke: '#831843'								// ping 900
	},
}

const emit = defineEmits(['back'])
const refPlayers = usePlayersStore().players
const players = ref<TimedPlayer[]>([])
const timeLeft = computed(() => players.value.reduce((sum, p) => sum + p.timeLeft, 0))
const currentPlayer = ref(0)
const { format, formatMillis } = useTimeFormatter()
const launched = ref(false)
let tween: gsap.core.Tween

const audio = new Audio('/assets/sounds/next.wav')

const findNextAvailablePlayer = () => {
	for (let i = currentPlayer.value + 1; i < players.value.length; ++i)
		if (players.value[i].timeLeft > 0)
			return i
	for (let i = 0; i < currentPlayer.value; ++i)
		if (players.value[i].timeLeft > 0)
				return i
	return -1
}

const back = () => {
	if (!launched.value)
		emit('back')
}

const reset = () => {
	if (launched.value)
		return
	const tpp = props.totalTime / refPlayers.length
	players.value = refPlayers.map(p => ({...p, timeLeft: tpp}))
	currentPlayer.value = 0
}

const delay = () => {
	if (tween)
		tween.pause()
	tween = gsap.to(players.value[currentPlayer.value], {
		duration: Math.floor(players.value[currentPlayer.value].timeLeft / 1000),
		timeLeft: 0,
		ease: 'none',
		onComplete: () => {
			next()
			audio.play()
		},
	})
}

const togglePause = () => {
	launched.value = !launched.value
	if (launched.value)
		delay()
	else tween.pause()
}

watch(currentPlayer, () => {
	if (launched.value)
		delay()
})

const next = () => {
	const nxt = findNextAvailablePlayer()
	if (nxt === -1) {
		launched.value = false
		tween.pause()
		return
	}
	currentPlayer.value = nxt
}

const color = computed(() => {
	if (timeLeft.value > props.totalTime * 0.5)
		return 'blue'
	if (timeLeft.value > props.totalTime * 0.25)
		return 'yellow'
	return 'red'
})

onMounted(reset)
</script>
