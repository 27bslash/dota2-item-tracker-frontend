const itemSearch = (item: string, data: any, itemData: any = null, role: string = '') => {
    const matches: object[] = []
    let searchRes = itemIdSearch(itemData, item)
    if (role) {
        data = data.filter((match: any) => match.role === role)
    }
    data.forEach((match: any) => {
        const m = match['items'].filter((x: any) => {
            return searchRes.has(x.key) || searchRes.has(`item_${x.key}`)
        })
        const neutral = searchRes.has(match['item_neutral']) || searchRes.has(`item_${match['item_neutral']}`)
        if (m.length || neutral) {
            matches.push(match)
        }
    })
    return matches
}
const itemIdSearch = (itemsArr: { items: [{ 'name': string, 'displayName': string }] }, search: string) => {
    const l: Set<string> = new Set();
    for (let item of itemsArr["items"]) {
        const acronyRes: boolean = acronym(search, item)
        if (
            item["name"].includes(search) || acronyRes ||
            item["displayName"].toLowerCase().includes(search.replace(/_-/g, " "))
        ) {
            l.add(item["name"]);
        }
    }
    return l;
};
const acronym = (search: string, item: any) => {
    let displayNameAcronym = item['displayName'].split(/\s|_|-/g).map((char: string) => char[0]).join('').toLowerCase()
    if (displayNameAcronym === search.toLowerCase()) {
        return true
    }
    return false
}
export default itemSearch