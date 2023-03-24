export type Player = {
	id: string
	name: string
}

export type TimedPlayer = Player & {
	timeLeft: number
}
