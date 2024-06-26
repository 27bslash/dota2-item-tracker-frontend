import { Box, Button, Tooltip, Typography } from '@mui/material'
import GuideGuide from '../guideDownload'
import { MatchDataAdj } from '../../stat_page/page'
import { useHeroBuilds } from '../buildHooks/buildHook'
import { useParseMatchData } from '../buildHooks/parseMatchDataHook'
import Hero from '../../types/heroList'
import DotaMatch from '../../types/matchData'
import { BuildCell } from './buildCell'
import { useState } from 'react'
import Items from '../../types/Item'
import { PageHeroData } from '../../types/heroData'
import { TableSearchResults } from '../../table/table_search/types/tableSearchResult.types'
import PickStats from '../../types/pickStats'
import { usePageContext } from '../../stat_page/pageContext'
import { RoleStrings } from '../../home/home'
import useShortBuilds from '../buildHooks/shortBuildHook'

export interface BuildProps extends MatchDataAdj {
    data?: any
    itemData?: Items
    heroName: string
    heroData: PageHeroData
    role: string
    searchRes?: TableSearchResults
    picks?: PickStats
    heroList: Hero[]
    totalMatchData?: DotaMatch[]
}
// heroData: heroData, nameParam: nameParam,
// totalMatchData: totalMatchData, filteredData: filteredData,
// itemData: itemData, role: Role, updateMatchData: updateMatchData,
// type: type, heroList: heroList, playerList: playerList

const Build = (props: BuildProps) => {
    const [proData, setProData] = useState(false)
    const [open, setOpen] = useState(false)
    const {
        filteredData,
        itemData,
        heroData,
        nameParam,
        heroList,
        totalMatchData,
        searchRes,
    } = usePageContext()
    const shortBuild = useShortBuilds()
    const buildsData = useParseMatchData(
        proData,
        totalMatchData,
        nameParam,
        props,
        searchRes
    )
    const heroBuilds = useHeroBuilds(
        buildsData!,
        heroData,
        itemData!,
        false,
        shortBuild
    )
    const [guideGuide, setGuideGuide] = useState(false)

    const textShadow = {
        textShadow: '1.5px 1.5px black !important',
    }

    const baseButtonStyle = {
        border: 'solid 2px black',
        '&:hover': {
            backgroundColor: 'secondary.main',
        },
        '&.Mui-disabled': {
            backgroundColor: 'secondary.main',
            color: 'white',
        },
    }
    const disabledOpacity = !heroBuilds ? 0.3 : 1
    return (
        <Box color={'white'} className="build-wrapper">
            <Box
                className="build-container"
                bgcolor={open ? 'secondary.dark' : 'inherit'}
                sx={{
                    position: 'relative',
                }}
            >
                {!open && (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!heroBuilds}
                        sx={{
                            ...baseButtonStyle,
                            marginRight: '4px',
                            opacity: disabledOpacity,
                        }}
                        onClick={() => setOpen((prevstate) => !prevstate)}
                    >
                        <Typography>builds</Typography>
                    </Button>
                )}
                {open && heroBuilds && (
                    <>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    setOpen((prevstate) => !prevstate)
                                }
                                sx={{
                                    ...baseButtonStyle,
                                    marginRight: '4px',
                                }}
                            >
                                <Typography>builds</Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    setProData((prevstate) => !prevstate)
                                }
                                sx={baseButtonStyle}
                            >
                                <Typography>
                                    {!proData ? ' Pro data' : 'non pro'}
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color={'success'}
                                sx={{
                                    marginLeft: 'auto',
                                    border: 'solid 2px black',
                                }}
                                onClick={() => setGuideGuide((prev) => !prev)}
                            >
                                <Typography>get all guides</Typography>
                            </Button>
                            {guideGuide && (
                                <Tooltip title="">
                                    <div
                                        className="download-guides-help-text"
                                        style={{
                                            position: 'absolute',
                                            right: '22px',
                                            top: '50px',
                                            zIndex: 99,
                                        }}
                                    >
                                        <GuideGuide />
                                    </div>
                                </Tooltip>
                            )}
                        </Box>
                        {Object.entries(heroBuilds).map(
                            (build, index: number) => {
                                const role = build[0] as RoleStrings
                                const buildData = heroBuilds[role]
                                return (
                                    <BuildCell
                                        key={index}
                                        data={
                                            buildsData
                                                ? buildsData![role]
                                                : undefined
                                        }
                                        updateMatchData={props.updateMatchData}
                                        buildData={buildData}
                                        role={role}
                                        dataLength={
                                            Object.entries(heroBuilds).length
                                        }
                                    />
                                )
                            }
                        )}
                    </>
                )}
            </Box>
        </Box>
    )
}

export default Build
