import { Box, Button, Tooltip, Typography } from "@mui/material";
import GuideGuide from "../guideDownload";
import { MatchDataAdj } from "../../stat_page/page";
import { useHeroBuilds } from "../buildHooks/buildHook";
import { useParseMatchData } from "../buildHooks/parseMatchDataHook";
import Hero from "../../types/heroList";
import DotaMatch from "../../types/matchData";
import { BuildCell } from "./buildCell";
import { useState } from "react";
import Items from "../../types/Item";
import { PageHeroData } from "../../types/heroData";
import { TableSearchResults } from "../../table/table_search/types/tableSearchResult.types";
import PickStats from "../../types/pickStats";
import { usePageContext } from "../../stat_page/pageContext";
import { RoleStrings } from "../../home/home";

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
    win?: number,
    patch:string,
}
const Build = (props: BuildProps) => {
    const [proData, setProData] = useState(false)
    const [open, setOpen] = useState(false)
    const { filteredData, itemData, heroData, nameParam, heroList, totalMatchData } = usePageContext()
    const fd = useParseMatchData(proData, totalMatchData, nameParam, props)
    const heroBuilds = useHeroBuilds(fd!, heroData, itemData!)
    const [guideGuide, setGuideGuide] = useState(false)

    const baseButtonStyle = {
        '&:hover': {
            backgroundColor: 'secondary.main',
        }, '&.Mui-disabled': {
            backgroundColor: 'secondary.main',
            color: 'white'
        }
    };
    const disabledOpacity = !fd ? 0.3 : 1
    const textShadow = {
        'textShadow': '1.5px 1.5px black',
    }
    return (
        <Box sx={textShadow} color={'white'} className="build-wrapper">
            <Box className="build-container" bgcolor={open ? 'secondary.dark' : 'inherit'} sx={{
                position: 'relative'
            }}>
                < Button variant='contained' color='primary' disabled={!fd} sx={{
                    ...baseButtonStyle,
                    marginRight: '4px',
                    opacity: disabledOpacity
                }} onClick={() => setOpen((prevstate) => !prevstate)} >Builds</Button>
                {open && fd && heroBuilds &&
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
                        {Object.entries(heroBuilds).map((build, index: number) => {
                            const role = build[0] as RoleStrings
                            const buildData = heroBuilds[role]
                            return (
                                <BuildCell key={index} data={fd[role]} updateMatchData={props.updateMatchData} buildData={buildData} role={role}
                                    dataLength={Object.entries(heroBuilds).length} />
                            )
                        })}
                    </>
                }
            </Box>
        </Box >
    )
}


export default Build