/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { usePageContext } from '../stat_page/pageContext'
import DraftImage from './draftImg'
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
        let searchPrefix: '+' | '-' = '-'
        if (dr) {
            searchPrefix = '+'
        }
        return x === nameParam || x === props.heroName ? (
            <DraftImage key={i} highlight={true} heroName={x}></DraftImage>
        ) : (
            <DraftImage
                key={i}
                heroName={x}
                highlight={false}
                onClick={() => updateData(x, searchPrefix)}
            ></DraftImage>
        )
    })
}
export default Draft
