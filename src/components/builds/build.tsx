import { Box, Button, Tooltip, Typography } from "@mui/material";
import GuideGuide from "../HeroBuilds/guideDownload";
import { MatchDataAdj } from "../stat_page/page";
import { useHeroBuilds } from "../HeroBuilds/buildHooks/buildHook";
import { useParseMatchData } from "../HeroBuilds/buildHooks/parseMatchDataHook";
import Hero from "../types/heroList";
import DotaMatch from "../types/matchData";
import { BuildCell } from "./buildCell";
import { useState } from "react";
import Items from "../types/Item";
import { PageHeroData } from "../types/heroData";
import { TableSearchResults } from "../table/table_search/types/tableSearchResult.types";
import PickStats from "../types/pickStats";

export interface BuildProps extends MatchDataAdj {
    data?: any,
    itemData: Items,
    heroName: string,
    heroData: PageHeroData,
    role: string,
    searchRes?: TableSearchResults,
    picks: PickStats,
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


export default Build