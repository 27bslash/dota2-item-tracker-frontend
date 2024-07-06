import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { baseApiUrl } from '../../../App'
import { fetchData, bulkRequest } from '../../../utils/fetchData'
import heroSwitcher from '../../../utils/heroSwitcher'
import DotaMatch from '../../types/matchData'
import PickStats from '../../types/pickStats'
import { Items } from '../../types/Item'
import { UnparsedBuilds } from '../../HeroBuilds/buildHooks/shortBuildHook'

export const useFetchAllData = (type: string) => {
    const [filteredMatchData, setfilteredMatchData] = useState<DotaMatch[]>()
    const [totalMatches, setTotalMatches] = useState<DotaMatch[]>()
    const [itemData, setItemData] = useState<Items>()
    const [totalPicks, setTotalPicks] = useState<PickStats>()
    const [shortBuilds, setShortBuilds] = useState<{
        [key: string]: UnparsedBuilds
    }>()

    const params = useParams()
    const [query] = useSearchParams()
    const role = query.get('role') || ''
    const nameParam = params['name'] ? heroSwitcher(params['name']) : ''
    const [patch, setPatch] = useState({ patch: '', patch_timestamp: 0 })
    const getData = async () => {
        let merged
        let url = `${baseApiUrl}${type}/${nameParam}/react-test?skip=0&length=10`

        const countDocsUrl = `${baseApiUrl}hero/${nameParam}/count_docs?collection=heroes`
        const matches: { data: DotaMatch[]; picks: PickStats } =
            await fetchData(url)
        setfilteredMatchData(matches['data'])
        const docLength = await fetchData(countDocsUrl)
        setTotalPicks(matches['picks'])
        let allMatches
        const shortBuild = await fetchData(
            `${baseApiUrl}hero/${nameParam}/item_build?short=True`
        )
        setShortBuilds(shortBuild[0])
        if (docLength > 35 && type === 'hero') {
            // const worker = new Worker('./fetchData.ts')
            allMatches = await bulkRequest(
                `${baseApiUrl}${type}/${nameParam}/react-test`,
                docLength,
                10
            )
            merged = allMatches
                .map((x: { [x: string]: DotaMatch[] }) => x['data'])
                .flat()
            merged = matches['data'].concat(merged)
        } else if (docLength <= 10 && type === 'hero') {
            merged = matches['data']
        } else {
            allMatches = await fetchData(
                `${baseApiUrl}${type}/${nameParam}/react-test?skip=10&length=${docLength}`
            )
            merged = matches['data'].concat(allMatches['data'])
        }
        setTotalMatches(merged)
        const currentPatch = await fetchData(`${baseApiUrl}files/patch`)
        setPatch(currentPatch)
        localStorage.setItem('patch', currentPatch)
        const currentItemDataVersion = localStorage.getItem('item_list_version')
        const itemData = await fetchData(
            `${baseApiUrl}files/items?version=${currentItemDataVersion}&time=${Date.now()}`
        )
        localStorage.setItem('item_list_version', itemData['version'])
        setItemData(itemData)
    }
    useEffect(() => {
        getData()
    }, [])
    return {
        filteredMatchData,
        totalMatches,
        patch,
        itemData,
        totalPicks,
        shortBuilds,
    }
}
