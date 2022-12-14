
const itemSearch = (item: string, data: any, itemData: any, role: string = '', i = 0) => {
    if (!data || !itemData) {
        return {}
    }
    const matches: object[] = []
    let searchRes = itemIdSearch(itemData, item)
    const itemRes: any = new Set()
    const dict: {
        [item: string]: {
            index: number,
            matches: any[],
        }
    } = {}
    if (role) {
        data = data.filter((match: any) => match.role === role)
    }
    data.forEach((match: any) => {
        const seenItems = new Set()
        for (let item of match['items']) {
            if (seenItems.has(item.key)) {
                continue
            }
            if (searchRes['names'].has(item.key) || searchRes['names'].has(`item_${item.key}`)) {
                const name = itemData[item.key] ? itemData[item.key] : item.key
                itemRes.add(name)
                seenItems.add(item.key)
                dict[name] ? dict[name]['matches'].push(match) : dict[name] = { 'matches': [match], 'index': i }
                // matches.push({ name: match })
                // {item: matches: [0]}
            }
        }
        // const m = match['items'].filter((x: any) => {
        //     // itemRes.push(x['key'])
        //     const seenItems = new Set()
        //     if (x.key in seenItems) {
        //         return false
        //     }
        //     if (searchRes['names'].has(x.key) || searchRes['names'].has(`item_${x.key}`)) {
        //         const name = displayNameFromName(itemData, x.key)
        //         itemRes.add(name)
        //         seenItems.add(x.key)
        //         dict[name] ? dict[name]['matches'].push(match) : dict[name] = { 'matches': [match] }
        //         // matches.push({ name: match })
        //         // {item: matches: [0]}
        //         return true
        //     }
        // })
        const neutral = searchRes['names'].has(match['item_neutral']) || searchRes['names'].has(`item_${match['item_neutral']}`)
        if (neutral) {
            matches.push(match)
            dict[match['item_neutral']] ? dict[match['item_neutral']]['matches'].push(match) : dict[match['item_neutral']] = { 'matches': [match], index: i }

            // {item: match}
        }
    })
    return dict

}
const displayNameFromName = (itemsArr: any, name: string) => {
    for (let item of itemsArr["items"]) {
        if (item['name'] === `item_${name}`) {
            // console.log('item ', item['name'], 'name: ', name)
            return item['displayName']
        }
    }
}
const itemIdSearch = (itemsArr: { [x: string]: { [x: string]: any } }, search: string) => {
    const names: Set<string> = new Set();
    const displayNames: Set<string> = new Set();
    for (let key of Object.keys(itemsArr["items"])) {
        const item = itemsArr["items"][key]
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