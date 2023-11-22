/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import DraftSearch from "./table_search/draft_search";

const Draft = (props: any) => {
    const dr = props.draft.includes(props.hero)
    const draftS = new DraftSearch()
    const updateData = (search: string, symbol: string) => {
        const dict: any = {}
        if (props.totalMatchData.length === 0) return;
        const matches = new Set()
        // const data = draftS.handleDraftSearch(props.totalMatchData, props.heroList, search, props.hero)
        for (const match of props.totalMatchData) {
            const draf = draftS.draftChecker(match, props.hero, search, symbol)
            if (draf) {
                const key = `${symbol || ''}${search}`
                dict[key] ? dict[key]['matches'].push(match) : dict[key] = { 'matches': [match] }
                matches.add(match)
            }
        }
        props.updateMatchData(Array.from(matches), { 'draft': dict })
    }
    return (
        props.draft.map((x: any, i: number) => {
            // src\assets\images
            let searchPrefix = '-'
            if (dr) {
                searchPrefix = '+'
            }
            return (
                x === props.hero ? (
                    <img key={i} alt={x} src={require(`../../images/minimap_icons/${x}.jpg`).default} className='icon-highlight' ></img>
                ) : (
                    <img key={i} alt={x} src={require(`../../images/minimap_icons/${x}.jpg`).default} onClick={() => updateData(x, searchPrefix)}></img>
                )

            )
        })

    )
}
export default Draft