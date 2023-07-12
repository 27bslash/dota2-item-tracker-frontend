import ItemBuild from "./itemBuild/itemBuild"
import AbilityBuild from './abillityBuild/abilityBuild';
import { useEffect, useMemo, useReducer, useState } from "react";
import StartingItems from "./itemBuild/startingItems/startingItems";
import { Box, Button, Tooltip } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import filterItems from "./itemBuild/itemFitltering/itemFiltering";
import abilityFilter from "./abillityBuild/abilityFiltering";
import countStartingItems from "./itemBuild/startingItems/startingItemsFilter";
import { bulkRequest, fetchData } from "../fetchData";
import GuideGuide from "./guideDownload";
import { MatchDataAdj } from "../page";

interface BuildProps extends MatchDataAdj {
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
    const [heroBuilds, setHeroBuilds] = useReducer((states: any, updates: any) => {
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
            let merged = []
            let data = []
            if (docLength > 50) {
                data = await bulkRequest(`${props.baseApiUrl}hero/${props.heroName}/item_build`, docLength)
                merged = data.flat()
            } else {
                data = await fetchData(`${props.baseApiUrl}hero/${props.heroName}/item_build`)
                merged = data.flat()
            }
            setNonProData(merged.filter((x: any) => x.abilities && x.items))
        })()
    }, [])

    useEffect(() => {
        if (props.role && data) {
            const filtered = data.filter(((item: NonProDataType) => item.role === props.role))
            const o = { [props.role]: filtered }
            setFilteredData(o)
        } else if (data) {
            const tempObject: { [role: string]: NonProDataType[] } = {}
            for (let role of roles) {
                const roleFiltered = data.filter(((item: NonProDataType) => item.role === role || (combinedRoles.includes(role) && combinedRoles.includes(item.role))))
                tempObject[role] = roleFiltered
            }
            setFilteredData(tempObject)
        }
    }, [props.role, data])
    useEffect(() => {
        setHeroBuilds({ type: 'clear' })
        for (let key in filteredData) {
            const buildData = filteredData[key]
            const itemBuild = filterItems(buildData, props.itemData)
            const abilityBuilds = abilityFilter(buildData)
            const startingItemBuilds = countStartingItems(buildData)
            const res = [itemBuild, abilityBuilds, startingItemBuilds]
            setHeroBuilds({ [key]: res })

        }
    }, [filteredData])
    const [guideGuide, setGuideGuide] = useState(false)
    return (
        <Box className="build-wrapper" style={{ marginTop: '20px' }} >
            {filteredData &&
                <Box className="build-container" bgcolor={open ? 'secondary.dark' : 'inherit'} sx={{
                    position: 'relative'
                }}>
                    < Button variant='contained' color='primary' sx={{
                        '&:hover': {
                            backgroundColor: 'secondary.main',
                        },
                    }} onClick={() => setOpen((prevstate) => !prevstate)} >Builds</Button>
                    {open &&
                        <>
                            <Button variant='contained' color='primary' onClick={() => setProData((prevstate) => !prevstate)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'secondary.main',
                                    }
                                }} >{!proData ? ' Pro data' : 'non pro'}</Button>
                            <Button variant='contained' color={'success'}
                                sx={{
                                    marginLeft: '840px',
                                }} onClick={() => setGuideGuide((prev) => !prev)}>get all guides</Button>
                            {guideGuide &&
                                <Tooltip title=''>
                                    <div className='download-guides-help-text' style={{ position: 'absolute', right: '16px', zIndex: 99 }} >
                                        <GuideGuide />
                                    </div>
                                </Tooltip>
                            }
                            {Object.entries(heroBuilds).map((build: any, index: number) => {
                                const role = build[0]
                                const buildData = heroBuilds[role]
                                return (
                                    <BuildCell key={index} data={filteredData[role]} buildData={buildData} role={role} heroName={props.heroName} itemData={props.itemData} dataLength={Object.entries(heroBuilds).length} heroData={props.heroData} />
                                )
                            })}
                        </>
                    }
                </Box>
            }
        </Box >
    )
}
const BuildCell = (props: any) => {
    const [open, setOpen] = useState(props.dataLength === 1)
    // maybe a hook for once
    return (
        <div className="builds" >
            <h1 onClick={() => setOpen(prev => !prev)}>{props.role}
                {/* <svg height="30" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.442 18.141l2.167-1.25c.398-.23.898-.219 1.286.03l1.93 1.238a.373.373 0 01.005.63c-1.77 1.183-8 5.211-10.744 5.211-.926 0-7.725-2.034-7.725-2.034v-6.999h2.704c.881 0 1.741.265 2.46.755l1.635 1.117h3.671c.438 0 1.482 0 1.482 1.302 0 1.41-1.14 1.41-1.482 1.41h-5.395a.555.555 0 00-.565.543c0 .3.254.543.565.543h5.75s.82.004 1.473-.56c.414-.359.783-.944.783-1.936z" fill="#FFFFFF"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.399 15.02c0-.583-.494-1.058-1.1-1.058h-2.2c-.606 0-1.099.475-1.099 1.059v6.998c0 .583.493 1.057 1.099 1.057h2.2c.606 0 1.1-.474 1.1-1.057v-6.998z" fill="url(#wrist_66_dark)" fill-opacity="0.7"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.895 6.395a.32.32 0 00-.202-.246.336.336 0 00-.32.043c-.91.64-1.942.965-1.942.965.04-3.622-2.211-5.914-5.873-7.13a.51.51 0 00-.541.141.463.463 0 00-.065.537c.833 1.5 1.205 2.868 1.068 4.825 0 0-.924-.426-1.26-1.51a.314.314 0 00-.205-.21.344.344 0 00-.3.043c-3.528 2.588-2.893 10.11 4.131 10.11 5.095 0 5.928-4.594 5.51-7.568zm-5.31-.56a.14.14 0 00-.03-.152.149.149 0 00-.158-.03c-2.764 1.222-3.878 6.061-.325 6.061 3.384 0 2.143-3.47.852-4.149a.111.111 0 00-.116.01.108.108 0 00-.05.106c.065.512-.148.819-.686.779-.209-.812.152-1.83.513-2.624z" fill="url(#flame_66_dark)"></path>
                    <defs>
                        <linearGradient id="wrist_66_dark" x1="2.19928" y1="13.9623" x2="2.19928" y2="23.0759" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#DEDEDE"></stop>
                            <stop offset="1" stop-color="#7B7373"></stop>
                        </linearGradient>
                        <linearGradient id="flame_66_dark" x1="20.1087" y1="-1.17264e-7" x2="10.053" y2="15.0821" gradientUnits="userSpaceOnUse">
                            <stop stop-color="hsl(29,76%,39%)"></stop>
                            <stop offset="1" stop-color="hsl(335,57.99999999999999%,51%)"></stop>
                        </linearGradient>
                    </defs>
                </svg> */}
            </h1>
            {open &&
                <div className="buildData">
                    <StartingItems data={props.buildData[2]} itemData={props.itemData} />
                    <ItemBuild data={props.buildData[0]} itemData={props.itemData} />
                    <AbilityBuild data={props.data} abilityBuild={props.buildData[1]} heroData={props.heroData} heroName={props.heroName} updateMatchData={props.updateMatchData} />
                </div>
            }
        </div>
    )
}
export default Build