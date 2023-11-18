export type PickStats = {
	'Hard Support_picks'?: number,
	'Hard Support_wins'?: number,
	'Support_picks'?: number,
	'Support_wins'?: number,
	'Roaming_picks'?: number,
	'Roaming_wins'?: number,
	'Offlane_picks'?: number,
	'Offlane_wins'?: number,
	'Midlane_picks'?: number,
	'Midlane_wins'?: number,
	'Safelane_picks'?: number,
	'Safelane_wins'?: number,
	picks: number,
	bans: number,
	wins: number,
	winrate?: number,
	hero: string
}