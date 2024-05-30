import { NonProDataType } from '../types'

export const facetFilter = (buildData: NonProDataType[]) => {
    const facetCount: { [key: string]: number } = {}
    let total = 0
    for (const match of buildData) {
        if (match['variant']) {
            total += 1
            if (match['variant'] in facetCount) {
                facetCount[String(match['variant'])] += 1
            } else {
                facetCount[String(match['variant'])] = 1
            }
        }
    }
    // [{key: 1, count: 42, perc: 95}]
    const facets = []
    for (const k in facetCount) {
        const o = {
            key: +k,
            count: facetCount[k],
            perc: ((facetCount[k] / total) * 100).toFixed(2),
        }
        facets.push(o)
    }
    return facets
}
