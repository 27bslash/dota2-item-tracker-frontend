import { baseApiUrl } from '../../../App'
import { fetchData } from '../../../utils/fetchData'
import { useEffect, useState } from 'react'
import { usePageContext } from '../../stat_page/pageContext'
import { Talent } from '../builds/buildCell'
import { RawItemBuildValues } from '../itemBuild/itemFitltering/itemFiltering'
import { NeutralItemsStats } from '../itemBuild/neutralItems/mostUsedNeutrals'

export type UnparsedBuilds = {
    abilities: { a_count: { [key: string]: number } }
    items: RawItemBuildValues[]
    talents: { [key: string]: Talent }
    starting_items: { [key: string]: number }
    neutral_items: NeutralItemsStats
    facets: {
        key: number
        count: number
        perc: string
    }[]
    length: number
}
const useShortBuilds = () => {
    const { nameParam } = usePageContext()
    const [shortBuilds, setShortBuilds] = useState<
        {
            [key: string]: UnparsedBuilds
        }[]
    >()
    useEffect(() => {
        async function gData() {
            const shortBuild = await fetchData(
                `${baseApiUrl}hero/${nameParam}/item_build?short=True`
            )
            setShortBuilds(shortBuild)
        }
        gData()
    }, [])

    if (shortBuilds) return shortBuilds[0]
}
export default useShortBuilds
