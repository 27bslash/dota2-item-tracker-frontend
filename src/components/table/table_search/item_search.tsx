import Items from "../../types/Item"
import DotaMatch from "../../types/matchData"

const itemSearch = (item: string, data: DotaMatch[], itemData: any, role = '', i = 0) => {
    if (!data || !itemData) {
        return {}
    }
    data = data.filter((match) => match['items'])
    const matches = []
    const noSymbl = item.replace('-', '')
    const symbolMatch = item.match(/^-/)
    let symbol = ''
    if (symbolMatch) symbol = '-'
    let searchRes = itemIdSearch(itemData, noSymbl)
    const dict: {
        [item: string]: {
            index: number,
            matches: DotaMatch[],
        }
    } = {}
    if (role) {
        data = data.filter((match) => match.role === role)
    }
    const allItems = data.map((match) => match['items'].map((item) => item.key)).flat()
    data.forEach((match) => {
        const seenItems = new Set()
        for (const item of match['items']) {
            if (seenItems.has(item.key)) {
                continue
            }
            if (!symbol && (searchRes['names'].has(item.key) || searchRes['names'].has(`item_${item.key}`))) {
                const name = itemData[item.key] ? itemData[item.key] : item.key
                seenItems.add(item.key)
                dict[`${symbol}${name}`] ? dict[`${symbol}${name}`]['matches'].push(match) : dict[`${symbol}${name}`] = { 'matches': [match], 'index': i }
                // matches.push({ name: match })
                // {item: matches: [0]}
            }
        }
        const neutral = searchRes['names'].has(match['item_neutral']) || searchRes['names'].has(`item_${match['item_neutral']}`)
        if (neutral) {
            matches.push(match)
            dict[match['item_neutral']] ? dict[match['item_neutral']]['matches'].push(match) : dict[match['item_neutral']] = { 'matches': [match], index: i }

            // {item: match}
        }
    })
    if (symbol === '-') {
        for (const item of searchRes['names']) {
            const filteredMatches = data.filter((match) => match['items'].map((x) => x.key).every((x: string) =>
                allItems.includes(item) && item !== x
            ))
            if (filteredMatches.length) {
                dict[`${symbol}${item}`] = { 'matches': filteredMatches, index: 0 }
            }
        }
    }
    return dict

}
const itemIdSearch = (itemsArr: { [x: string]: { [x: string]: any } }, search: string) => {
    const names: Set<string> = new Set();
    const displayNames: Set<string> = new Set();
    for (let key of Object.keys(itemsArr["items"])) {
        const item = itemsArr["items"][key]
        if (key.includes('recipe')) continue
        if (!('dname' in item)) {
            continue
        }
        const acronymRes: boolean = acronym(search, item)
        if (
            key.includes(search) || acronymRes ||
            item['dname'].toLowerCase().includes(search.replace(/_-/g, " "))
        ) {
            names.add(key);
            if (item['dname']) displayNames.add(item['dname'])
        }
    }
    return { 'names': names, displayNames: displayNames }
};
const acronym = (search: string, item: any) => {
    let displayNameAcronym = item['dname'].split(/\s|_|-/g).map((char: string) => char[0]).join('').toLowerCase()
    if (displayNameAcronym === search.toLowerCase().replace(/\s/g, '')) {
        return true
    }
    return false
}
export default itemSearch