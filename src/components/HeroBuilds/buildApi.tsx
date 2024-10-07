import { useParams } from 'react-router'
import heroSwitcher from '../../utils/heroSwitcher'
import { useHeroBuilds } from './buildHooks/buildHook'
import { useParseMatchData } from './buildHooks/parseMatchDataHook'
import { fetchData } from '../../utils/fetchData'
import { useEffect, useState } from 'react'
import { baseApiUrl } from '../../App'
import { exists } from './../../utils/exists'
import { Items } from '../types/Item'
import { PageHeroData } from '../types/heroData'

const BuildDataJson = ({
    heroName,
    totalPicks,
    heroData,
    itemData,
    patchObj,
}: {
    heroName: string
    totalPicks: any
    patchObj: { [x: string]: string }
    heroData: PageHeroData
    itemData: Items
}) => {
    const filteredData = useParseMatchData(
        false,
        undefined,
        heroName,
        { picks: totalPicks },
        undefined,
        0.19
    )

    for (const k in filteredData) {
        filteredData[k] = filteredData[k].filter(
            (x) => x.patch === patchObj['patch']
        )
    }
    // filteredData!.forEach((element) => {
    //     console.log(patch)
    //     return filteredData!.element.filter((x) => x.patch === patch)
    // })
    const updatedBuildData = useHeroBuilds(
        filteredData!,
        heroData!,
        itemData!,
        true
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
    const [patch, setPatch] = useState<{ [key: string]: string }>()
    useEffect(() => {
        const fData = async () => {
            const url = `${baseApiUrl}hero/${heroName}/react-test?skip=0&length=10`
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
            const currentPatch = await fetchData(`${baseApiUrl}files/patch`)
            setPatch(currentPatch)
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
        patch &&
        itemData && (
            <BuildDataJson
                itemData={itemData}
                heroData={heroData}
                totalPicks={totalPicks}
                heroName={heroName}
                patchObj={patch}
            ></BuildDataJson>
        )
    )
}
