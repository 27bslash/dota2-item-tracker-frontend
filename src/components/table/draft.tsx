/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { usePageContext } from '../stat_page/pageContext'
import DraftSearch from './table_search/draft_search'

const Draft = (props: any) => {
    const { totalMatchData, nameParam } = usePageContext()
    const dr = props.draft.includes(nameParam)
    const draftS = new DraftSearch()

    const updateData = (search: string, symbol: string) => {
        const dict: any = {}
        if (totalMatchData.length === 0) return
        const matches = new Set()
        // const data = draftS.handleDraftSearch(totalMatchData, nameParamList, search, nameParam)
        for (const match of totalMatchData) {
            const draf = draftS.draftChecker(match, nameParam, search, symbol)
            if (draf) {
                const key = `${symbol || ''}${search}`
                dict[key]
                    ? dict[key]['matches'].push(match)
                    : (dict[key] = { matches: [match] })
                matches.add(match)
            }
        }
        props.updateMatchData(Array.from(matches), { draft: dict })
    }
    return props.draft.map((x: string, i: number) => {
        // src\assets\images
        let searchPrefix = '-'
        if (dr) {
            searchPrefix = '+'
        }
        return x === nameParam || x === props.heroName ? (
            <img
                key={i}
                onError={(e) => {
                    try {
                        const target = e.target as HTMLImageElement
                        target.onerror = null
                        target.src = '/images/minimap_icons/error.jpg'
                    } catch (error) {
                        console.error('Image loading error:', error)
                    }
                }}
                alt={x}
                src={`/images/minimap_icons/${x}.jpg`}
                className="draft-icon icon-highlight"
            ></img>
        ) : (
            <img
                key={i}
                onError={(e) => {
                    try {
                        const target = e.target as HTMLImageElement
                        target.onerror = null
                        target.src = '/images/minimap_icons/error.jpg'
                    } catch (error) {
                        console.error('Image loading error:', error)
                    }
                }}
                alt={x}
                src={`/images/minimap_icons/${x}.jpg`}
                height={32}
                width={32}
                // src={require(`../../images/minimap_icons/${x}.jpg`).default}
                className="draft-icon"
                onClick={() => updateData(x, searchPrefix)}
            ></img>
        )
    })
}
export default Draft
