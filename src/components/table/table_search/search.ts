import DraftSearch from './draft_search';
import itemSearch from './item_search';
import { filterPlayers } from './../../nav/search';

const playerSearch = (matchData: any, playerList: string[], searchValue: string, i = 0) => {
    const players = filterPlayers(playerList, searchValue)
    const dict: { [playerName: string]: { index: number, matches: any[] } } = {}
    players.forEach((player) => {
        const data = matchData.filter((match: any) => {
            if (player === match.name.replace(/\(smurf.*\)/, '').trim()) {
                return match
            }
        })
        if (data.length) {
            dict[player] = { 'matches': data, index: i }
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
