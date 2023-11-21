import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import { baseApiUrl } from "../../../App"
import { fetchData, bulkRequest } from "../../../utils/fetchData"
import heroSwitcher from "../../../utils/heroSwitcher"
import DotaMatch from "../../types/matchData"
import PickStats from "../../types/pickStats"
import { Items } from "../../types/Item"

export const useFetchAllData = (type: string) => {
    const [filteredMatchData, setfilteredMatchData] = useState<DotaMatch[]>()
    const [totalMatches, setTotalMatches] = useState<DotaMatch[]>()
    const [itemData, setItemData] = useState<Items>()
    const [totalPicks, setTotalPicks] = useState<PickStats>()
    const params = useParams()
    const [query] = useSearchParams();
    const role = query.get('role') || ''
    const nameParam = params['name'] ? heroSwitcher(params['name']) : ''
    const [patch, setPatch] = useState({ 'patch': '', 'patch_timestamp': 0 })
    const getData = async () => {
        const matchDataUrl = type === 'hero' ? 'https://0f2ezc19w3.execute-api.eu-west-2.amazonaws.com/dev/' : baseApiUrl
        let url = `${matchDataUrl}${type}/${nameParam}/react-test?skip=0&length=10`
        if (role) {
            url = `${matchDataUrl}${type}/${nameParam}/react-test?role=${role}&skip=0&length=10`
        }
        const countDocsUrl = `${baseApiUrl}hero/${nameParam}/count_docs?collection=heroes`
        const matches = await fetchData(url)
        setfilteredMatchData(matches['data'])
        const docLength = await fetchData(countDocsUrl)
        setTotalPicks(matches['picks'])
        let allMatches
        if (docLength > 15 && type === 'hero') {
            // const worker = new Worker('./fetchData.ts')
            allMatches = await bulkRequest(`${matchDataUrl}${type}/${nameParam}/react-test`, docLength)
            const merged = allMatches.map((x: { [x: string]: DotaMatch[] }) => x['data']).flat()
            setTotalMatches(merged.filter((x) => x))
        } else if (docLength <= 10 && type === 'hero') {
            setTotalMatches(matches['data'].filter((x: DotaMatch | undefined) => x))
        } else {
            allMatches = await fetchData(`${matchDataUrl}${type}/${nameParam}/react-test`)
            setTotalMatches(allMatches['data'].filter((x: DotaMatch | undefined) => x))
        }
        const currentPatch = await fetchData(`${baseApiUrl}files/patch`)
        setPatch(currentPatch)
        const itemData = await fetchData(`${baseApiUrl}files/items`)
        setItemData(itemData)
    }
    useEffect(() => {
        getData()
    }, [])
    return { filteredMatchData, totalMatches, patch, itemData, totalPicks }
}