import { useParams } from 'react-router'
import heroSwitcher from '../../utils/heroSwitcher'
import { useHeroBuilds } from './buildHooks/buildHook'
import { useParseMatchData } from './buildHooks/parseMatchDataHook'
import { fetchData } from '../../utils/fetchData'
import { useEffect, useState } from 'react'
import { baseApiUrl } from '../../App'
import { exists } from './../../utils/exists'
import { Items } from '../types/Item'

const BuildDataJson = (props: any) => {
    const filteredData = useParseMatchData(
        false,
        undefined,
        props.heroName,
        { picks: props.totalPicks },
        undefined,
        0.19,
        props.heroData
    )
    const updatedBuildData = useHeroBuilds(
        filteredData!,
        props.heroData!,
        props.itemData!
    )
    return exists(updatedBuildData) ? (
        <div className="data">{JSON.stringify(updatedBuildData)}</div>
    ) : (
        <div className="nodata"></div>
    )
}
export const BuildApi = () => {
    const params = useParams()
    const heroName = params['hero'] ? heroSwitcher(params['hero']) : ''
    const [totalPicks, setTotalPicks] = useState<any>()
    const [itemData, setItemData] = useState<Items>()
    const [heroData, setHeroData] = useState<any>({})
    useEffect(() => {
        const fData = async () => {
            const matchDataUrl =
                'https://0f2ezc19w3.execute-api.eu-west-2.amazonaws.com/dev/'
            const url = `${matchDataUrl}hero/${heroName}/react-test?skip=0&length=10`
            const matches = await fetchData(url)
            setTotalPicks(matches['picks'])
            const currentItemDataVersion =
                localStorage.getItem('item_list_version')
            const itemResponse = await fetchData(
                `${baseApiUrl}files/items?version=${currentItemDataVersion}&time=${Date.now()}`
            )
            setItemData(itemResponse)
            const hData = await fetch(
                `${baseApiUrl}files/hero-data/${heroName}`
            )
            const hJson = await hData.json()
            setHeroData({ [heroName]: hJson })
            if (matches && itemData) {
                console.log(matches, itemData)
            }
        }
        fData()
    }, [])
    return (
        totalPicks &&
        heroName &&
        itemData && (
            <BuildDataJson
                itemData={itemData}
                heroData={heroData}
                totalPicks={totalPicks}
                heroName={heroName}
            ></BuildDataJson>
        )
    )
}
