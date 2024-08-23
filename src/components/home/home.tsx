import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Nav from '../nav/nav'
import ControlPanel from './control'
import { baseApiUrl } from '../../App'
import { theme } from '../..'
import { cleanDecimal } from '../../utils/cleanDecimal'
import GridContainer from './heroGrid/gridContainer'
import HeroCard from './heroGrid/heroCard'
import Hero from '../types/heroList'
import PickStats, { Trend } from '../types/pickStats'
import { SortTitle } from './sortTitle'
import { SideBar } from './sideBar/sideBar'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { bulkRequest, fetchData } from '../../utils/fetchData'
// import { PickStats } from './types/pickStats.types';

type HomeProps = {
    heroList: Hero[]
    playerList: string[]
}
export type RoleStrings =
    | ''
    | 'Hard Support'
    | 'Support'
    | 'Roaming'
    | 'Offlane'
    | 'Midlane'
    | 'Safelane'

function Home({ heroList, playerList }: HomeProps) {
    const [winStats, setWinStats] = useState<PickStats[]>()
    const [filteredHeroes, setFilteredHeroes] = useState<string[]>()
    const [filteredByButton, setfilteredByButton] = useState<string[]>()
    const [roleFilter, setRoleFilter] = useState<RoleStrings>('')
    const [searching, setSearching] = useState(false)
    const [highlight, setHighlight] = useState<number>()
    const [sort, setSearchVal] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const paramPatch = useParams()['patch']
    const [patch, setPatch] = useState({ patch: '', patch_timestamp: 0 })

    useEffect(() => {
        const async_get = async () => {
            const currentPatch = await fetchData(`${baseApiUrl}files/patch`)
            setPatch(currentPatch)
        }
        async_get()
    }, [])
    useEffect(() => {
        document.title = 'Dota2 Item Tracker'
        const async_get = async () => {
            if (!heroList.length) return
            const version = localStorage.getItem('winStatsVersion')
            let url = `${baseApiUrl}files/win-stats?version=${version}&time=${Date.now()}`
            const jsdon = await fetchData(url)
            if (version! === jsdon['version']) {
                url = `${baseApiUrl}files/win-stats?version=${version}`
            }
            const data = await bulkRequest(url, heroList.length - 1, 0)
            const m = data.map((x) => x['win_stats'])
            const json = { win_stats: m.flat(), version: jsdon['version'] }
            const pickStats = json['win_stats']
                .filter((doc) => (paramPatch ? doc.patch === paramPatch : doc))
                .sort((a, b) => a.hero.localeCompare(b.hero))
            localStorage.setItem('winStatsVersion', String(json['version']))
            setWinStats(pickStats)
        }
        async_get()
    }, [heroList, paramPatch])

    useEffect(() => {
        if (!heroList.length) {
            return
        }
        const m = heroList.map((hero: Hero) => hero.name.replace(/\s/g, '_'))
        const hList = m.sort((a, b) => a.localeCompare(b))
        setFilteredHeroes(hList)
    }, [heroList])
    const filterHeroes = (list: string[]) => {
        const newList = list.map((x) => x.replace(/\s/g, '_'))
        setFilteredHeroes(newList)
        if (!filteredByButton && newList.length !== heroList.length) {
            setSearching(true)
        } else if (!filteredByButton) {
            const hList = newList.sort((a, b) => a.localeCompare(b))
            setFilteredHeroes(hList)
            setSearching(false)
        } else if (filteredByButton.length === list.length) {
            setSearching(false)
        } else if (
            filteredByButton &&
            filteredByButton.length !== list.length
        ) {
            setSearching(true)
        }
    }
    const sortHeroes = (list: string[], search: string, role?: RoleStrings) => {
        setFilteredHeroes(list)
        setfilteredByButton(list)
        setSearchVal(search)
        setRoleFilter('')
        if (role) {
            const roleF = `${role}`
            setRoleFilter(role)
        }
    }
    let className: '' | 'right' = ''
    let width = '1800px'
    if (searching) {
        className = 'right'
        width = '1000px'
    }
    const highlightHero = (idx: number) => {
        setHighlight(idx)
    }
    let pickStats: { [key: string]: number }
    document.body.style.background = theme.palette.background.default
    theme.palette.primary.main = '#1d5455'
    theme.palette.secondary.main = '#486869'

    const calcTrends = (heroName: string, role?: RoleStrings) => {
        if (!winStats) return

        const heroPickData = winStats.filter(
            (x) => x.hero === heroName.replace(/\s/g, '_')
        )
        const currentTrend = heroPickData[0]['trends'][0]
        let viableTrends = heroPickData[0]['trends']
        if (paramPatch) {
            viableTrends = viableTrends.filter(
                (x) => x.patch === currentTrend.patch
            )
        }
        const lastTrend = heroPickData[0]['trends'][viableTrends.length - 1]
        const { bans, winrate, picks, wins } = formatTrend(currentTrend, role)
        const lastTrendStats = formatTrend(lastTrend, role)
        const newBans = bans - lastTrendStats.bans
        const newWins = wins - lastTrendStats.wins
        const newWinrate = +cleanDecimal(
            winrate - Math.abs(winrate - lastTrendStats.winrate)
        )
        const newPicks = picks - lastTrendStats.picks
        // console.log(newPicks)
        return (pickStats = {
            picks: newPicks,
            wins: newWins,
            bans: newBans,
            winrate: newWinrate,
        })

        function formatTrend(currentTrend: Trend, role?: RoleStrings) {
            let picks = 0
            let wins = 0
            if (role && currentTrend[role]) {
                picks = currentTrend[role]!.picks || 0
                wins = currentTrend[role]!.wins || 0
            } else {
                picks = currentTrend.picks || 0
                wins = currentTrend.wins || 0
            }
            const currentBans = currentTrend['bans'] || 0
            const currentWinrate = picks
                ? +cleanDecimal((wins / picks) * 100)
                : 0
            return {
                bans: currentBans,
                winrate: currentWinrate,
                picks: picks,
                wins: wins,
            }
        }
    }
    const sortByTrend = (role: RoleStrings | undefined) => {
        if (!winStats) return null
        const sorted = winStats
            .sort((a, b) => {
                const patchStr = paramPatch ? 'patch_' : ''
                const aObj =
                    role && a[role]
                        ? a[role][`${patchStr}picks`]
                        : a[`${patchStr}picks`]
                const bObj =
                    role && b[role]
                        ? b[role][`${patchStr}picks`]
                        : b[`${patchStr}picks`]
                const trends =
                    a.bans <= 3000
                        ? calcTrends(a.hero, role)!['picks'] + aObj || 0
                        : aObj
                const otherTrends =
                    b.bans <= 3000
                        ? calcTrends(b.hero, role)!['picks'] + bObj || 0
                        : bObj
                return otherTrends - trends
            })
            .filter((x) => {
                if (role) {
                    return x[role] && x[role]['picks'] > 10
                } else {
                    return x['picks'] > 10
                }
            })
        sortHeroes(
            sorted.map((x) => x.hero),
            'trends',
            role
        )
    }
    const nonPatchGames = () => {
        return winStats?.find(
            (doc) =>
                doc['trends'][doc['trends'].length - 1]['patch'] !=
                patch['patch']
        )
    }
    return (
        <div className="home">
            <Nav
                filterHeroes={filterHeroes}
                filteredByButton={filteredByButton}
                heroList={heroList}
                playerList={playerList}
                highlightHero={highlightHero}
            />
            {nonPatchGames() ? (
                !paramPatch ? (
                    <Typography variant="h4" color="white" align="center">
                        <Link to={`/${patch['patch']}`}>
                            Filter By Patch {patch['patch']}
                        </Link>
                    </Typography>
                ) : (
                    <Typography variant="h4" color="white" align="center">
                        <Link to={`/`}>Show All Games</Link>
                    </Typography>
                )
            ) : null}
            {winStats && (
                <div
                    className="side-bar"
                    onMouseLeave={() => setDrawerOpen(false)}
                >
                    <SideBar
                        open={drawerOpen}
                        winStats={winStats}
                        sortHeroes={sortHeroes}
                        sortByTrend={sortByTrend}
                    />
                </div>
            )}
            {sort && !searching && <SortTitle role={roleFilter} sort={sort} />}
            <GridContainer className={className} width={width}>
                {filteredHeroes &&
                    filteredHeroes.map((heroName: string, i: number) => {
                        if (heroName === 'anti_mage') heroName = 'anti-mage'
                        if (winStats) {
                            const stats = winStats.filter(
                                (x) => x.hero === heroName.replace(/\s/g, '_')
                            )
                            // const picks = roleFilter !== '' ? stats[0][`${roleFilter}_picks`] || stats[0]['picks'] || 0 : 0;
                            // const wins = roleFilter !== '' ? stats[0][`${roleFilter}_wins`] || stats[0]['picks'] || 0 : 0;
                            // console.log(stats, heroName)
                            let picks = 0
                            let wins = 0
                            if (roleFilter && stats[0][roleFilter]) {
                                picks = stats[0][roleFilter]['picks'] || 0
                                wins = stats[0][roleFilter]['wins'] || 0
                            } else if (!roleFilter) {
                                picks = stats[0]['picks'] || 0
                                wins = stats[0]['wins'] || 0
                            }
                            if (paramPatch) {
                                if (roleFilter && stats[0][roleFilter]) {
                                    picks =
                                        stats[0][roleFilter]['patch_picks'] || 0
                                    wins =
                                        stats[0][roleFilter]['patch_wins'] || 0
                                } else if (!roleFilter) {
                                    picks = stats[0]['patch_picks'] || 0
                                    wins = stats[0]['patch_wins'] || 0
                                }
                            }
                            // const picks = (roleFilter ? stats[0][roleFilter]['picks'] : stats[0][`picks`] as number) || 0;
                            const { bans } = stats[0]
                            const winrate = picks
                                ? +cleanDecimal((wins / picks) * 100)
                                : 0
                            const trends = calcTrends(heroName, roleFilter)!
                            pickStats = {
                                picks,
                                trend: trends['picks'],
                                wins,
                                bans,
                                winrate,
                            }
                            // pickStats = {
                            //     trend: 80, wins: 80, picks: 80, bans: 80, winrate: 80
                            // }
                        }
                        return (
                            <Grid
                                key={i}
                                className={`grid-item-${className}`}
                                item
                                sx={{ paddingTop: '10px !important' }}
                            >
                                <HeroCard
                                    highlight={highlight}
                                    idx={i}
                                    key={i}
                                    searching={searching}
                                    sortByTrend={sortByTrend}
                                    heroName={heroName}
                                    stats={pickStats}
                                    role={roleFilter}
                                />
                            </Grid>
                        )
                    })}
            </GridContainer>
        </div>
    )
}

export default Home
