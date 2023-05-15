import ItemBuild from "./itemBuild/itemBuild"
import AbilityBuild from './abillityBuild/abilityBuild';
import { useEffect, useMemo, useReducer, useState } from "react";
import StartingItems from "./itemBuild/startingItems/startingItems";
import { Box, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import filterItems from "./itemBuild/itemFitltering/itemFiltering";
import abilityFilter from "./abillityBuild/abilityFiltering";
import countStartingItems from "./itemBuild/startingItems/startingItemsFilter";
import { bulkRequest, fetchData } from "../fetchData";

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
    role: string
}
const Build = (props: BuildProps) => {
    const [filteredData, setFilteredData] = useState<{ [k: string]: NonProDataType[] }>()
    const [data, setData] = useState<NonProDataType[]>()
    const [nonProData, setNonProData] = useState<NonProDataType[]>()
    const [proData, setProData] = useState(false)
    const [open, setOpen] = useState(false)
    const [build, setBuild] = useReducer((states: any, updates: any) => {
        switch (updates.type) {
            case 'clear':
                return ({})
            default:
                return ({ ...states, ...updates })
        }
    }, {})
    // switch to toggle only known pro accounts
    const combinedRoles = ['Support', 'Roaming']
    const calc_common_roles = () => {
        const picks = props.picks.picks
        const roles: string[] = []
        const sorted = Object.entries(props.picks).filter((x) => typeof (x[1]) === 'object').sort((a, b) => b[1]['picks'] - a[1]['picks'])
        let combinedRole = null
        for (let k of sorted) {
            const role = k[0]
            let totalRolePicks = props.picks[role].picks
            if (!combinedRole && combinedRoles.includes(role)) {
                const otherRole: string | undefined = combinedRoles.find((pos) => pos !== role && pos in props.picks)
                const otherRolePicks = otherRole ? props.picks[otherRole].picks : 0
                totalRolePicks = props.picks[role].picks + otherRolePicks
                combinedRole = true
            }
            let perc = totalRolePicks / picks
            if (perc > 0.1) {
                roles.push(role)
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
            const countDocsUrl = `${props.baseApiUrl}hero/${props.heroName}/count_docs?collection=non-pro`
            const docLength = await fetchData(countDocsUrl)
            const data = await bulkRequest(`${props.baseApiUrl}hero/${props.heroName}/item_build`, docLength)
            const merged = data.flat()
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
                const roleFiltered = data.filter(((item: NonProDataType) => item.role === role || (combinedRoles.includes(role) && combinedRoles.includes(item.role))))
                tempObject[role] = roleFiltered
            }
            setFilteredData(tempObject)
        }
    }, [props.role, data])
    useEffect(() => {
        setBuild({ type: 'clear' })
        for (let key in filteredData) {
            const buildData = filteredData[key]
            const itemBuild = filterItems(buildData, props.itemData)
            const abilityBuilds = abilityFilter(buildData)
            const startingItemBuilds = countStartingItems(buildData)
            const res = [itemBuild, abilityBuilds, startingItemBuilds]
            setBuild({ [key]: res })
        }
    }, [filteredData])
    return (
        <div className="build-wrapper">
            {filteredData &&
                <div className="build-container">
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
                            {Object.entries(build).map((object: any, index: number) => {
                                const k = object[0]
                                const buildData = build[k]
                                return (
                                    <BuildCell key={index} data={filteredData[k]} buildData={buildData} k={k} heroName={props.heroName} itemData={props.itemData} dataLength={roles.length} heroData={props.heroData} />
                                )
                            })}
                        </>
                    }
                </div>
            }
        </div>
    )
}
const BuildCell = (props: any) => {
    const [open, setOpen] = useState(props.dataLength === 1)
    // maybe a hook for once
    return (
        <div className="builds" >
            <h1 onClick={() => setOpen(prev => !prev)}>{props.k}</h1>
            {open &&
                <div className="buildData">
                    <StartingItems data={props.buildData[2]} itemData={props.itemData} />
                    <ItemBuild data={props.buildData[0]} itemData={props.itemData} />
                    <AbilityBuild data={props.data} abilityBuild={props.buildData[1]} heroData={props.heroData} heroName={props.heroName} />
                </div>
            }
        </div>
    )
}
export default Build