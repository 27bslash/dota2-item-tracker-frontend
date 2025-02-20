import { combineMatches } from "../../table/table_search/table_search"
import { TableSearchResults } from "../../table/table_search/types/tableSearchResult.types"
import DotaMatch from "../../types/matchData"
import { useState } from "react"

export const useUpdateSearchResults = (searchObj?: TableSearchResults | string, searchResKey?: string, matchKey?: 'items' | 'item_neutral' | 'starting_items' | 'name' | 'role' | 'hero' | 'abilities') => {
    const [filteredData, setFilteredData] = useState<DotaMatch[]>([])
    const [totalMatchData] = useState<DotaMatch[]>([])
    const [searchResults, setSearchResults] = useState<TableSearchResults>()
    const [count, setCount] = useState<number>()

    if (!searchObj && !searchResKey) {
        setFilteredData(totalMatchData)
        setSearchResults(undefined)
        return
    }
    let newFilteredData: DotaMatch[] = []
    if (typeof (searchObj) === 'string' && matchKey && searchResKey) {
        if (['name', 'role', 'hero', 'item_neutral'].includes(matchKey)) {
            newFilteredData = totalMatchData.filter((x) => x[matchKey] === searchObj)
            console.log(searchObj, newFilteredData, { [matchKey]: { [searchObj]: { 'index': 0, 'matches': newFilteredData } } })
            setSearchResults({ [searchResKey]: { [searchObj]: { 'index': 0, 'matches': newFilteredData } } })

        } else if ((matchKey === 'items' || matchKey === 'abilities')) {
            newFilteredData = totalMatchData.filter((x) => x[matchKey] && x[matchKey].map((item) => item['key']).includes(searchObj))
            setSearchResults({ [searchResKey]: { [searchObj]: { 'index': 0, 'matches': newFilteredData } } })
        }
    }
    else if (typeof (searchObj) === 'object' && !matchKey) {
        newFilteredData = totalMatchData.filter((x) => combineMatches(searchObj).flat().includes(x.id))
        setSearchResults(searchObj)

    }
    setFilteredData(newFilteredData)
    setCount(newFilteredData.length)
    return { newFilteredData, count, searchResults, filteredData }
}