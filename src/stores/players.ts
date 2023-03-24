import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Player } from '@/interfaces/player'
import { uuid } from 'vue-uuid'

export const usePlayersStore = defineStore('players', () => {
	const players = ref<Player[]>([])

	const addPlayer = (name: string) => {
		name = name.trim()
		if (name.length < 2) {
			alert('Имя не должно быть короче двух букв!')
			return false
		}
		players.value.push({ name, id: uuid.v4() })
		return true
	}

	return { players, addPlayer }
})
