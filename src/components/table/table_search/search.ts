import { filterPlayers } from '../../nav/filterPlayers/filterPlayersHook';
import Items from '../../types/Item';
import Hero from '../../types/heroList';
import DotaMatch from '../../types/matchData';
import DraftSearch from './draft_search';
import itemSearch from './item_search';
import { TableSearchResults } from './types/tableSearchResult.types';

const playerSearch = (matchData: DotaMatch[], playerList: string[], searchValue: string, i = 0) => {
    const noSymbl = searchValue.replace('-', '')
    const symbolMatch = searchValue.match(/^-/)
    let symbol = ''
    if (symbolMatch) symbol = '-'
    const players = filterPlayers(playerList, noSymbl)
    const dict: { [playerName: string]: { index: number, matches: DotaMatch[], totalFilteredMatches: DotaMatch[] } } = {}
    const allPlayers = matchData.map((x) => x.name)
    players.forEach((player) => {
        const data = matchData.filter((match) => {
            const noSmurf = match.name.replace(/\(smurf.*\)/, '').trim()
            if (searchValue.startsWith('-')) {
                return player !== noSmurf && allPlayers.includes(player)
            } else {
                return player === noSmurf
            }
        })
        if (data.length) {
            const totalFilteredMatches = matchData.filter((match) => match['name'] === player)
            dict[`${symbol}${player}`] = { matches: data, index: i, totalFilteredMatches: totalFilteredMatches }
        }

    })
    return dict
}
const roleSearch = (matchData: DotaMatch[], searchValue: string, i = 0) => {
    const roles = ['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support']
    const dict: { [role: string]: { index: number, matches: DotaMatch[] } } = {}
    const partialMatches = roles.filter((x) => x.toLowerCase().includes(searchValue.toLowerCase()))
    for (const partialmatch of partialMatches) {
        const data = matchData.filter((match) => partialmatch.toLowerCase() === String(match.role).toLowerCase())
        if (data.length) {
            dict[partialmatch] = { 'matches': data, index: i }
        }
    }
    return dict
}

const search = (searchTerms: string[], matchData: DotaMatch[], itemData?: Items, herolist?: Hero[], playerList?: string[] | undefined, heroName?: string) => {
    const res: TableSearchResults = {
        items: {},
        draft: {},
        role: {},
        player: {}
    }
    searchTerms.forEach((term: string, i: number) => {
        if (itemData) {
            const itemSearchResults = itemSearch(term, matchData, itemData, undefined, i)
            res['items'] = { ...res['items'], ...itemSearchResults }
        }
        if (herolist && heroName) {
            const draftSearchResults = new DraftSearch().handleDraftSearch(matchData, herolist, term, heroName, i)
            res['draft'] = { ...res['draft'], ...draftSearchResults }
        }
        const roleSearchResults = roleSearch(matchData, term, i)
        if (playerList) {
            const playerSearchResults = playerSearch(matchData, playerList, term, i)
            res['player'] = { ...res['player'], ...playerSearchResults }
        }
        res['role'] = { ...res['role'], ...roleSearchResults }
    })
    return res
}

export default search