import DraftSearch from "./table_search/draft_search";

const Draft = (props: any) => {
    const dr = props.draft.includes(props.hero)
    const draftS = new DraftSearch()
    const updateData = (search: string, symbol: string) => {
        if (props.totalMatchData.length === 0) return;
        const matches = new Set()
        // const data = draftS.handleDraftSearch(props.totalMatchData, props.heroList, search, props.hero)
        for (let match of props.totalMatchData) {
            const draf = draftS.draftChecker(match, props.hero, search, symbol)
            if (draf) {
                matches.add(match)
            }
        }
        // console.log(matches.size)
        props.updateMatchData(Array.from(matches))
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