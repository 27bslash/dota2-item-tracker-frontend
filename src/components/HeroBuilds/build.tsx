import ItemBuild from "./itemBuild/itemBuild"
import AbilityBuilds from './abillityBuild/abilityBuild';
import { useState } from "react";
import StartingItems from "./itemBuild/startingItems/startingItems";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import GuideGuide from "./guideDownload";
import { MatchDataAdj } from "../stat_page/page";
import { NeutralItems } from "./itemBuild/neutralItems/neutralItems";
import { useHeroBuilds } from "./buildHooks/buildHook";
import { useParseMatchData } from "./buildHooks/parseMatchDataHook";
import { TableContextProvider } from "../table/tableContext";
import { RoleStrings } from "../home/home";
import { PageHeroData } from "../types/heroData";
import Items from "../types/Item";
import Hero from "../types/heroList";
import DotaMatch from "../types/matchData";

export interface BuildProps extends MatchDataAdj {
    data?: any,
    itemData: any,
    heroName: string,
    heroData: any,
    role: string,
    searchRes?: any,
    picks: { [key: string]: any }
    heroList: Hero[],
    totalMatchData?: DotaMatch[]
}
// heroData: heroData, nameParam: nameParam,
// totalMatchData: totalMatchData, filteredData: filteredData,
// itemData: itemData, role: Role, updateMatchData: updateMatchData,
// type: type, heroList: heroList, playerList: playerList
export type NonProDataType = {
    abilities: [{ id: string, img: string, key: string, level: number, type: string, slot?: number }],
    hero: string,
    id: number,
    items: [{ id: string, key: string, time: number }],
    match_id: number,
    starting_items: [{ id: string, key: string, time: number }],
    role: string,
    item_neutral?: string,
    win?: number
}
const Build = (props: BuildProps) => {
    const [proData, setProData] = useState(false)
    const [open, setOpen] = useState(false)

    const filteredData = useParseMatchData(proData, props.data, props.heroName, props)
    const heroBuilds = useHeroBuilds(filteredData!, props.heroData, props.itemData)
    const [guideGuide, setGuideGuide] = useState(false)

    const baseButtonStyle = {
        '&:hover': {
            backgroundColor: 'secondary.main',
        }, '&.Mui-disabled': {
            backgroundColor: 'secondary.main',
            color: 'white'
        }
    };
    const disabledOpacity = !filteredData ? 0.3 : 1
    const textShadow = {
        'textShadow': '1.5px 1.5px black',
    }
    return (
        <Box sx={textShadow} color={'white'} className="build-wrapper">
            <Box className="build-container" bgcolor={open ? 'secondary.dark' : 'inherit'} sx={{
                position: 'relative'
            }}>
                < Button variant='contained' color='primary' disabled={!filteredData} sx={{
                    ...baseButtonStyle,
                    marginRight: '4px',
                    opacity: disabledOpacity
                }} onClick={() => setOpen((prevstate) => !prevstate)} >Builds</Button>
                {open && filteredData &&
                    <>
                        <Button variant='contained' color='primary' onClick={() => setProData((prevstate) => !prevstate)}
                            sx={baseButtonStyle} >{!proData ? ' Pro data' : 'non pro'}</Button>
                        <Button variant='contained' color={'success'}
                            sx={{ marginLeft: '840px' }} onClick={() => setGuideGuide((prev) => !prev)}>get all guides</Button>
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
                                <BuildCell totalMatchData={props.totalMatchData} heroList={props.heroList} key={index} data={filteredData[role]} updateMatchData={props.updateMatchData} buildData={buildData} role={role} heroName={props.heroName} itemData={props.itemData} dataLength={Object.entries(heroBuilds).length} heroData={props.heroData} />
                            )
                        })}
                    </>
                }
            </Box>
        </Box >
    )
}
type BuildCellProps = {
    dataLength: number
    itemData: Items,
    role: RoleStrings,
    data: any,
    buildData: any,
    heroData: PageHeroData,
    updateMatchData: MatchDataAdj['updateMatchData']
    heroName: string
    heroList: Hero[]
    totalMatchData?: DotaMatch[]
}
const BuildCell = ({ dataLength, data, totalMatchData, heroList, itemData, role, buildData, heroData, updateMatchData, heroName }: BuildCellProps) => {
    const [open, setOpen] = useState(dataLength === 1)
    // maybe a hook for once
    const contextValues = {
        items: itemData,
        role: role,
        heroData: heroData,
        updateMatchData: updateMatchData,
        showStarter: false,
        filteredData: totalMatchData!,
        totalMatchData: totalMatchData!,
        heroList: heroList
    }

    return (
        <TableContextProvider value={contextValues} >
            <div className="buildData">
                <Typography variant="h4" fontWeight='bold' padding={1.3} sx={{ '&:hover': { cursor: 'pointer', 'opacity': 0.7 } }} onClick={() => setOpen(prev => !prev)}>{role}
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
                </Typography >
                {open &&
                    <div className="builds" >
                        <StartingItems data={data} startingItemData={buildData['starting_items']} itemData={itemData} />
                        <ItemBuild data={buildData['item_builds']} itemData={itemData} />
                        <NeutralItems neutralItems={buildData['neutral_items']} data={data} itemData={itemData} />
                        <AbilityBuilds data={data} abilityBuilds={buildData['ability_builds']} heroData={heroData} heroName={heroName} updateMatchData={updateMatchData} />
                    </div>
                }
            </div>
        </TableContextProvider>
    )
}
export default Build