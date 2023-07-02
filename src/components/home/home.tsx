import { Grid, Typography } from "@mui/material"
import heroSwitcher from "../heroSwitcher"
import { useEffect, useContext } from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import Nav from "../nav/nav";
import colourWins from '../colourWins';
import ControlPanel from "./control";
import { baseApiUrl } from "../../App";

const Home = (props: any) => {
    const [winStats, setWinStats] = useState<any[]>()
    const [filtered, setFiltered] = useState<any[]>()
    const [roleFilter, setRoleFilter] = useState('')
    const [searching, setSearching] = useState(false)
    const [highlight, setHighlight] = useState<number>()
    const [sort, setSearchVal] = useState('')
    useEffect(() => {
        document.title = 'dota2 item tracker';
        (async () => {
            const req = await fetch(`${baseApiUrl}/files/win-stats`)
            let json = await req.json()
            json = json.sort((a: any, b: any) => a['hero'].localeCompare(b['hero']))
            setWinStats(json)
        })()
    }, [])
    // const sortF = (a: any, b: any) => {
    //     const n1 = a['name']
    //     const n2 = b['name']
    // console.log(n1, n2)
    //     return n1.localeCompare(n2)
    // }
    useEffect(() => {
        if (!props.heroList.length) {
            return
        }
        const m = props.heroList.map((hero: any) => ({ 'name': hero['name'].replace(/\s/g, '_'), 'id': hero['id'] }))
        const hList = m.sort((a: any, b: any) => a['name'].localeCompare(b['name']))
        setFiltered(hList)


    }, [props.heroList])
    const filterHeroes = (list: any) => {
        const newList = list.map((x: any) => x.name.replace(/\s/g, '_'))
        setFiltered(newList)
        if (newList.length !== props.heroList.length) {
            setSearching(true)
        } else {
            setSearching(false)
        }
    }
    const sortHeroes = (list: any, search: string, role?: string) => {
        setFiltered(list)
        setSearchVal(search)
        setRoleFilter('')
        if (role) {
            const roleF = `${role}_`
            setRoleFilter(roleF)
        }
    }
    let className = ''
    let width = '1800px'
    if (searching) {
        className = 'right'
        width = '1000px'
    }
    const highlightHero = (idx: number) => {
        setHighlight(idx)
    }
    let pickStats: any = null
    return (
        <div className="home">
            <Nav filterHeroes={filterHeroes} heroList={props.heroList} playerList={props.playerList} highlightHero={highlightHero}></Nav>
            {filtered &&
                <ControlPanel sortHeroes={sortHeroes} winStats={winStats}></ControlPanel>
            }
            {sort && !searching &&
                <SortTitle role={roleFilter} sort={sort}></SortTitle>
            }
            <GridContainer className={className} width={width}>
                {filtered && (
                    filtered.map((x: any, i: number) => {
                        let heroName = x['name'] || x['hero'] || x
                        if (heroName === 'anti_mage') heroName = 'anti-mage'
                        if (winStats) {
                            const stats = winStats.filter((x) => {
                                return x.hero === heroName.replace(/\s/g, '_')
                            })
                            const picks = stats[0][`${roleFilter}picks`]
                            const wins = stats[0][`${roleFilter}wins`]
                            const bans = stats[0][`bans`]
                            const winrate = ((wins / picks) * 100).toFixed(2) || 0
                            pickStats = { 'picks': picks, 'wins': wins, 'bans': bans, 'winrate': winrate }
                        }
                        // console.log(heroName, stats)
                        return (
                            <Grid key={i} className={`grid-item-${className}`} item >
                                <HeroCard highlight={highlight} idx={i} key={i} searching={searching} heroName={heroName} stats={pickStats} role={roleFilter}></HeroCard>
                            </Grid>
                        )
                    })
                )}
            </GridContainer>
        </div >
    )
}
const GridContainer = (props: any) => {
    return (
        props.className.includes('right') ?
            (
                <Grid className={`hero-grid ${props.className}`} container spacing={0} sx={{ width: props.width + '!important' }}>
                    {props.children}
                </Grid>
            ) : (
                <Grid className={`hero-grid ${props.className}`} container spacing={3} sx={{ width: props.width }}>
                    {props.children}
                </Grid>
            )

    )
}
const SortTitle = (props: { sort: string, role?: string }) => {
    let role = props.role ? props.role.replace(/_/, '') : ''
    return (
        props.sort !== 'winrate' ?
            (
                <Typography className='sort-title' variant="h3" gutterBottom>
                    Most {role} {props.sort}
                </Typography>
            ) : (
                <Typography className='sort-title' variant="h3" gutterBottom>
                    highest {role} {props.sort}
                </Typography>
            )

    )
}
const HeroCard = (props: any) => {
    const { stats, heroName, role, searching, idx, highlight } = props
    const imgName = heroSwitcher(props.heroName)
    // console.log(props.heroName, heroName)
    // console.log(props.stats)
    let heroHighlight = idx === highlight && searching ? 'hero-highlight' : ''
    let width = heroHighlight ? '113' : '110'
    const img = `https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${imgName}.png?v=5926546`
    const heroname = heroName.replace(/\s/g, '_')

    let link = `/hero/${heroname}`
    if (role) {
        link = `/hero/${heroname}?role=${role.replace('_', '')}`
    }
    return (
        <Link to={link}>
            <div className={`hero-cell ${heroHighlight}`}>
                <img alt={props.heroName} className="hero-img" src={img} width={width}></img>
                {!searching && !!stats &&
                    <div className="win-stats" style={{ width: width, maxWidth: width }}>
                        <span className='picks'>{stats['picks']}</span>
                        <span className='wins'>{stats['wins']}</span>
                        <span className='winrate' style={{ color: colourWins(stats['winrate']) }}>{stats['winrate']}%</span>
                        <span className='bans'>{stats['bans']}</span>
                    </div>
                }
            </div>
        </Link >
    )
}


export default Home