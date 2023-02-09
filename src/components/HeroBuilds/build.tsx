import ItemBuild from "./itemBuild/itemBuild"
import AbilityBuild from './abillityBuild/abilityBuild';
import { useEffect, useMemo, useState } from "react";
import StartingItems from "./itemBuild/startingItems/startingItems";
import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import filterItems from "./itemBuild/itemFitltering/itemFiltering";
import abilityFilter from "./abillityBuild/abilityFiltering";
import countStartingItems from "./itemBuild/startingItems/startingItemsFilter";
type BuildProps = {
    data?: any,
    itemData: any,
    heroName: string,
    heroData: any,
    baseApiUrl: string
    role: string,
    searchRes?: any,
    picks: { [key: string]: any }
}
type NonProDataType = {
    abilities: [{ id: string, img: string, key: string, level: number, type: string }],
    hero: string,
    id: number,
    items: [{ id: string, key: string, time: number }],
    match_id: number,
    starting_items: [{ id: string, key: string, time: number }],
    role?: string
}
async function fetchData(url: string) {
    const response = await fetch(url);
    return await response.json();
}
const Build = (props: BuildProps) => {
    const [filteredData, setFilteredData] = useState<{ [k: string]: NonProDataType[] }>()
    const [data, setData] = useState<NonProDataType[]>()
    const [nonProData, setNonProData] = useState<NonProDataType[]>()
    const [proData, setProData] = useState(false)
    const [open, setOpen] = useState(false)

    // switch to toggle only known pro accounts
    const calc_common_roles = () => {
        const picks = props.picks.picks
        const roles: string[] = []
        const sorted = Object.entries(props.picks).filter((x) => typeof (x[1]) === 'object').sort((a, b) => b[1]['picks'] - a[1]['picks'])
        for (let k of sorted) {
            const perc = props.picks[k[0]].picks / picks
            if (perc > 0.2) {
                roles.push(k[0])
            }
        }
        return roles
    }
    const roles = useMemo(() => calc_common_roles(), [props.picks])
    useEffect(() => {
    }, [props.picks, proData, data, filteredData, props.role, roles, nonProData])
    useEffect(() => {
        if (proData) {
            setData(props.data)
        } else {
            setData(nonProData)
        }
    }, [proData, nonProData, props.data])
    useEffect(() => {
        (async () => {
            const itemUrl = `${props.baseApiUrl}hero/${props.heroName}/item_build`
            const skillUrl = `${props.baseApiUrl}hero/${props.heroName}/skill_build`
            const [items, skills] = await Promise.all([fetchData(itemUrl), fetchData(skillUrl)])
            const merged = items.map((_: any, i: number) => {
                return { ...items[i], ...skills[i] }
            })
            setNonProData(merged.filter((x: any) => x.abilities && x.items))
        })()
    }, [])

    useEffect(() => {
        if (props.role && data) {
            const filtered = data.filter(((item: NonProDataType) => item.role === props.role))
            const o = { [props.role]: filtered }
            setFilteredData(o)
        } else if (data) {
            console.log(props.role, roles)
            const tempObject: { [role: string]: NonProDataType[] } = {}
            for (let role of roles) {
                const roleFiltered = data.filter(((item: NonProDataType) => item.role === role))
                tempObject[role] = roleFiltered
            }
            setFilteredData(tempObject)
        }
    }, [props.role, data])
    return (
        <>
            {filteredData &&
                <div>
                    < Button sx={{
                        backgroundColor: grey[800],
                        '&:hover': {
                            backgroundColor: grey[700],
                        },
                    }} onClick={() => setOpen((prevstate) => !prevstate)} variant='contained'>Builds</Button>
                    {open &&
                        <>
                            <Button sx={{
                                backgroundColor: grey[800],
                                '&:hover': {
                                    backgroundColor: grey[700],
                                }
                            }} onClick={() => setProData((prevstate) => !prevstate)} variant='contained'>{!proData ? ' Pro data' : 'non pro'}</Button>
                            {Object.entries(filteredData).map((object: any, index: number) => {
                                const k = object[0]
                                const buildData = filteredData[k]
                                return (
                                    <BuildCell key={index} buildData={buildData} k={k} heroName={props.heroName} itemData={props.itemData} dataLength={roles.length} heroData={props.heroData} />
                                )
                            })}
                        </>
                    }
                </div>
            }
        </>
    )
}
const BuildCell = (props: any) => {
    const [open, setOpen] = useState(props.dataLength === 1)
    // maybe a hook for once
    const itemBuild = useMemo(() => filterItems(props.buildData, props.itemData), [props.data])
    const abilityBuilds = abilityFilter(props.buildData)
    const startingItemBuilds = countStartingItems(props.buildData)
    return (
        <div className="builds" >
            <h1 onClick={() => setOpen(prev => !prev)}>{props.k}</h1>
            {open &&
                <div className="buildData">
                    <StartingItems data={startingItemBuilds} itemData={props.itemData} />
                    <ItemBuild data={itemBuild} itemData={props.itemData} />
                    <AbilityBuild data={props.buildData} abilityBuild={abilityBuilds} heroData={props.heroData} heroName={props.heroName} />
                </div>
            }
        </div>
    )
}
export default Build