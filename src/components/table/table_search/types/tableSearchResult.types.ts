import DotaMatch from '../../../types/matchData'

export type TableSearchResult = {
    [key: string]: {
        index: number
        matches: DotaMatch[]
        totalFilteredMatches?: DotaMatch[]
        displayKey?: string
    }
}

export type TableSearchResults = {
    [key: string]: TableSearchResult
}
