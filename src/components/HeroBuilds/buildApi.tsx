import { useParams } from "react-router"
import heroSwitcher from "../../utils/heroSwitcher"
import { useHeroBuilds } from "./buildHooks/buildHook"
import { useParseMatchData } from "./buildHooks/parseMatchDataHook"
import { fetchData } from "../../utils/fetchData"
import { useEffect, useState } from 'react';
import { baseApiUrl } from "../../App"
import Items from "../types/Item"
import { exists } from './../../utils/exists';
const BuildDataCom = (props: any) => {
    const filteredData = useParseMatchData(false, undefined, props.heroName, { 'picks': props.totalPicks }, 0.19)
    const updatedBuildData = useHeroBuilds(filteredData, props.itemData!)
    return (
        updatedBuildData ? (
            <div className="data">
                {JSON.stringify(updatedBuildData)}
            </div>
        ) : (
            <div className="nodata"></div>
        )
    )
}
export const BuildApi = () => {
    let t = useParams()
    const heroName = t['hero'] ? heroSwitcher(t['hero']) : ''
    const [totalPicks, setTotalPicks] = useState<any>()
    const [itemData, setItemData] = useState<Items>()
    useEffect(() => {
        const fData = async () => {
            const matchDataUrl = 'https://0f2ezc19w3.execute-api.eu-west-2.amazonaws.com/dev/'
            let url = `${matchDataUrl}hero/${heroName}/react-test?skip=0&length=10`
            const matches = await fetchData(url)
            setTotalPicks(matches['picks'])
            const itemResponse = await fetchData(`${baseApiUrl}files/items`)
            setItemData(itemResponse)
            if (matches && itemData) {
                console.log(matches, itemData)
            }
        }
        fData()
    }, [])
    return (
        totalPicks && heroName && itemData &&
        <BuildDataCom itemData={itemData} totalPicks={totalPicks} heroName={heroName} ></BuildDataCom>
    )
}
