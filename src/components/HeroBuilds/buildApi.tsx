import { useParams } from "react-router"
import heroSwitcher from "../../utils/heroSwitcher"
import { useHeroBuilds } from "./buildHooks/buildHook"
import { useParseMatchData } from "./buildHooks/parseMatchDataHook"
import { fetchData } from "../../utils/fetchData"
import { useEffect, useState } from 'react';
import { baseApiUrl } from "../../App"
import Items from "../types/Item"
import { exists } from './../../utils/exists';

export const BuildApi = () => {
    let t = useParams()
    const heroName = t['hero'] ? heroSwitcher(t['hero']) : ''
    const [totalPicks, setTotalPicks] = useState([])
    const [itemData, setItemData] = useState<Items>()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fData = async () => {
            const matchDataUrl = 'https://0f2ezc19w3.execute-api.eu-west-2.amazonaws.com/dev/'
            let url = `${matchDataUrl}hero/${heroName}/react-test?skip=0&length=10`
            const matches = await fetchData(url)
            setTotalPicks(matches['picks'])
            const itemData = await fetchData(`${baseApiUrl}files/items`)
            setItemData(itemData)
            setLoading(false) // Set loading to false once data is fetched

        }
        fData()
    }, [heroName])
    const filteredData = useParseMatchData(false, undefined, heroName, { 'picks': totalPicks }, 0.19)
    const buildData = useHeroBuilds(filteredData, itemData!)
    if (loading || !exists(buildData)) {
        return null; // Render nothing
    }
    return (
        <>
            {JSON.stringify(buildData)}
        </>
    )
}
