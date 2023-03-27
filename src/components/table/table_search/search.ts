import DraftSearch from './draft_search';
import itemSearch from './item_search';
import { filterPlayers } from './../../nav/search';

const playerSearch = (matchData: any, playerList: string[], searchValue: string, i = 0) => {
    const noSymbl = searchValue.replace('-', '')
    const symbolMatch = searchValue.match(/^-/)
    let symbol = ''
    if (symbolMatch) symbol = '-'
    const players = filterPlayers(playerList, noSymbl)
    const dict: { [playerName: string]: { index: number, matches: any[], totalFilteredMatches: any[] } } = {}
    const allPlayers = matchData.map((x: any) => x.name)
    players.forEach((player) => {
        const data = matchData.filter((match: any) => {
            const noSmurf = match.name.replace(/\(smurf.*\)/, '').trim()
            if (searchValue.startsWith('-')) {
                return player !== noSmurf && allPlayers.includes(player)
            } else {
                return player === noSmurf
            }
        })
        if (data.length) {
            const totalFilteredMatches = matchData.filter((match: any) => match['name'] === player)
            dict[`${symbol}${player}`] = { 'matches': data, index: i, totalFilteredMatches: totalFilteredMatches }
        }

    })
    return dict
}
const roleSearch = (matchData: any, searchValue: string, i = 0) => {
    const roles = ['Safelane', 'Midlane', 'Offlane', 'Roaming', 'Support', 'Hard Support']
    const dict: { [role: string]: { index: number, matches: any[] } } = {}
    const partialMatches = roles.filter((x) => x.toLowerCase().includes(searchValue.toLowerCase()))
    for (let partialmatch of partialMatches) {
        const data = matchData.filter((match: any) => partialmatch.toLowerCase() === String(match.role).toLowerCase())
        if (data.length) {
            dict[partialmatch] = { 'matches': data, index: i }
        }
    }
    return dict
}
const search = (searchTerms: string[], matchData: any, itemData: any, herolist: any, playerList: any, heroName: string) => {
    let res: any = {}
    searchTerms.forEach((term: string, i: number) => {
        const itemSearchResults = itemSearch(term, matchData, itemData, undefined, i)
        const draftSearchResults = new DraftSearch().handleDraftSearch(matchData, herolist, term, heroName, i)
        const roleSearchResults = roleSearch(matchData, term, i)
        const playerSearchResults = playerSearch(matchData, playerList, term, i)
        res['items'] = { ...res['items'], ...itemSearchResults }
        res['draft'] = { ...res['draft'], ...draftSearchResults }
        res['role'] = { ...res['role'], ...roleSearchResults }
        res['player'] = { ...res['player'], ...playerSearchResults }
    })
    return res
}

export default search