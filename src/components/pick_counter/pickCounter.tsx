import { useEffect } from 'react';
import { useState } from 'react';
import colourWins from '../../utils/colourWins';
import heroSwitcher from '../../utils/heroSwitcher';
import stringSearch from '../table/table_search/string_search';
import RoleCounter from './roleCounter';
import Match from '../types/matchData';
import { Box, Button, Typography } from '@mui/material';
import { cleanDecimal } from '../../utils/cleanDecimal';
interface pickProps {
    matchData: any,
    filteredData: Match[],
    nameParam: string,
    role: string,
    updateMatchData: (data: Match[], searchValue?: {
        [key: string]: { matches: Match[] }
    }, types?: string[]) => void,
    updateRole: (role: string) => void,
    type: string,
    totalPicks: object[],
    count: number
    heroColor: string,
    searchRes?: object
}
const PickCounter = (props: pickProps) => {
    const name = props.nameParam
    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState(props.searchRes)
    useEffect(() => {
        if (props.searchRes) {
            setSearching(true)
            setSearchResults(props.searchRes)
        } else {
            setSearching(false)
        }
    }, [props.filteredData])

    const roleSearch = (data: any, role: string) => {
        if (data.length) {
            const m = stringSearch(data, 'role', role)
            props.updateRole(role)
            props.updateMatchData(m)
        }
    }
    const reset = () => {
        props.updateMatchData(props.matchData)
        setSearchResults(undefined)
        setSearching(false)
        props.updateRole('')
    }
    return (
        <>
            {!!props.matchData.length &&
                <div className="pick-counter" style={{ color: 'white' }}>
                    {searching ? (
                        <SearchResultsText data={props.matchData} updateMatchData={props.updateMatchData} roleSearch={roleSearch} searchRes={searchResults}
                            heroColor={props.heroColor} name={name} reset={reset} />
                    ) : (
                        props.type === 'hero' && props.heroColor &&
                        <>
                            <TotalPickCounter type={props.type} reset={reset} color={props.heroColor} role={props.role} totalPicks={props.totalPicks} name={props.nameParam} />
                            <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter>
                        </>
                    )}
                    {props.type === 'player' && !searching &&
                        <>
                            <TotalPickCounter type={props.type} updateMatchData={props.updateMatchData}
                                reset={reset} role={props.role} totalPicks={props.matchData.length} name={props.nameParam} data={props.matchData} />
                            {/* <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter> */}
                        </>
                    }
                </div>
            }
        </>
    )
}
const BoldName = (props: { reset: () => void; color: string; name: string; }) => {
    return <p onClick={() => props.reset()} className='bold-name' id='hero-name' style={{ 'color': props.color, textTransform: 'capitalize' }}>
        <strong >{heroSwitcher(props.name).replace(/_/g, ' ')}</strong>
    </p>
}
const HeroPicks = (props: { base: any, role: string, reset: () => void, name: string; color: string; }) => {
    const { base, role, name, color, reset } = props
    return (
        props.role ? (
            <>
                <BoldName reset={reset} name={name} color={color} />
                <p>was picked {base['picks']} times in {role} with a  <span style={{ color: colourWins(base['winrate']), marginRight: '5px' }}>
                    {base['winrate']}%
                </span>
                    winrate.
                </p>
            </>
        ) : (
            <>
                <BoldName reset={reset} name={name} color={color} />
                <p>was picked {base['picks']} times with a win rate of <span style={{ color: colourWins(base['winrate']), marginRight: '5px' }}>
                    {base['winrate']}%
                </span>
                    it's mostly played:
                </p>
            </>
        )
    )
}
const TotalPickCounter = (props: any) => {
    const totalPicks = props.role ? props.totalPicks[props.role] : props.totalPicks
    return (
        props.type === 'hero' ? (
            <HeroPicks role={props.role} name={props.name} base={totalPicks} color={props.color} reset={props.reset} />
        ) : (
            <PlayerPicks role={props.role} name={props.name} base={totalPicks} reset={props.reset} data={props.data} updateMatchData={props.updateMatchData} />
        )
    )
}
const PlayerPicks = (props: any) => {
    const heroCount: Record<string, Record<string, { picks: number; win: number }>> = {}
    for (let match of props.data) {
        if (heroCount[match['hero']] && heroCount[match['hero']][match['role']]) {
            heroCount[match['hero']][match['role']]['picks'] += 1
            if (match['win']) {
                heroCount[match['hero']][match['role']]['win'] += 1
            }
        } else {
            const o = { 'picks': 1, 'win': match['win'] }
            if (heroCount[match['hero']]) {
                heroCount[match['hero']][match['role']] = o
            } else {
                heroCount[match['hero']] = { [match['role']]: { 'picks': 1, 'win': match['win'] } }
            }
        }
    }
    Object.entries(heroCount).forEach((element) => {
        const pickDataObj: any = element[1]
        const roleKeys: string[] = Object.keys(pickDataObj)
        let temp = 0
        let highestRole = ''
        for (let roleKey of roleKeys) {
            const pickData = pickDataObj[roleKey]
            if (pickData['picks'] > temp) {
                temp = pickData['picks']
                highestRole = roleKey
            } else if (pickData['picks'] === temp) {
                if (pickDataObj[highestRole]['wins'] < pickData['wins']) {
                    highestRole = roleKey
                }
            }
        }
        for (let roleKey of roleKeys) {
            if (roleKey !== highestRole) {
                delete pickDataObj[roleKey]
            }
        }
    })

    let sortedData = Object.entries(heroCount)
        .sort(([aKey, aValue], [bKey, bValue]) => {
            // Compare first by picks
            const aRole = Object.keys(aValue)[0]
            const bRole = Object.keys(bValue)[0]
            if (aValue[aRole].picks !== bValue[bRole].picks) {
                return bValue[bRole].picks - aValue[aRole].picks
            }

            // If picks are equal, compare by wins
            return bValue[bRole].win - aValue[aRole].win;
        });
    sortedData = sortedData.slice(0, 4)
    const updateData = (hero?: string, role?: string) => {
        let filteredMatches
        if (hero && role) {
            filteredMatches = props.data.filter((x: Match) => x['hero'] === hero && x['role'] === role)
        } else if (hero) {
            filteredMatches = props.data.filter((x: Match) => x['hero'] === hero)
        } else {
            filteredMatches = props.data.filter((x: Match) => x['role'] === role)
        }
        props.updateMatchData(filteredMatches)
    }
    return (
        <div className="player-pick-counter">
            <div className="flex" style={{ width: '100%' }}>
                <p className='bold-name' onClick={() => props.reset()}>{props.name} has played {props.base} times. He mostly plays: </p>
            </div>
            <div className="flex boxContainer">
                {sortedData.map((x, i) => {
                    const roleKey = Object.keys(x[1])[0]
                    return (
                        <Box key={i} className="" bgcolor='primary.main' padding={1} margin={1} sx={{
                            width: '100px', '&:hover': {
                                cursor: 'pointer'
                            }
                        }} >
                            <div className="flex" style={{ justifyContent: 'space-around' }}>
                                <img src={require(`../../images/minimap_icons/${x[0]}.jpg`).default} alt={`${x[0]} minimap icon`} onClick={() => updateData(x[0])}></img>
                                <div className="svg-icon" id={roleKey.replace(' ', '-')} onClick={() => updateData(undefined, roleKey)}></div>
                            </div>
                            <div className="flex" style={{ justifyContent: 'space-around' }} onClick={() => updateData(x[0], roleKey)}>
                                <Typography>{x[1][roleKey]['picks']}</Typography>
                                <Typography color={colourWins(x[1][roleKey]['win'] / x[1][roleKey]['picks'] * 100)}>
                                    {cleanDecimal((x[1][roleKey]['win'] / x[1][roleKey]['picks'] * 100))}%</Typography>
                            </div>
                        </Box>
                    )
                })}
            </div>
        </div>
    )
}
const sortByMatches = (data: any) => {
    const sorted = Object.entries(data).sort((a: any, b: any) => b[1]['matches'].length - a[1]['matches'].length);
    const keys = sorted.map((item) => item[0])
    return keys.slice(0, 5)
}
const SearchResultsText = (props: any) => {
    const { searchRes, data, roleSearch, updateMatchData, name, reset } = props
    const items = searchRes['items']
    const draft = searchRes['draft']
    const role = searchRes['role']
    const players = searchRes['player']
    const talents = searchRes['talents']
    const handleClick = (matches: any, key: string, type: string) => {
        const newMatchArr = matches.map((m: any) => m.id)
        const filteredMatches = data.filter((match: any) => newMatchArr.includes(match.id))
        updateMatchData(filteredMatches, searchRes)
    }
    let playerKeys: string[] = [], roleKeys: string[] = []
    if (players) {
        playerKeys = sortByMatches(players)
    }
    if (role) {
        roleKeys = sortByMatches(role)
    }
    return (
        <div className="table-search-results">
            <h3 style={{ margin: 0 }} onClick={() => props.reset()}>Search Results:</h3>
            {players && Object.keys(players).length > 0 &&
                <>
                    {/* <SearchResultText data={players} handleClick={handleClick} filteredData={playerKeys} type={'player'} /> */}
                    <DraftCounter handleClick={handleClick} draft={players} header='Players' subheader={[null, 'filtered players']} />

                </>
            }
            {talents && Object.keys(talents).length > 0 &&
                <>
                    <h4>Talents: </h4>
                    <SearchResultText data={talents} handleClick={handleClick} type='talents' filteredData={sortByMatches(talents)} />
                </>
            }
            {items && Object.keys(items).length > 0 &&
                <DraftCounter handleClick={handleClick} draft={items} type='items' header='Items' subheader={[null, 'filtered items']} />
            }
            {draft && !!Object.keys(draft).length &&
                <DraftCounter handleClick={handleClick} draft={draft} type='draft' header='Draft' subheader={['with', 'against']} />
            }
            {role && Object.keys(role).length > 0 &&
                <>
                    <h4>Role:</h4>
                    <SearchResultText data={role} handleClick={handleClick} filteredData={roleKeys} type={'role'} />
                </>
            }
            <div className="reset-wrapper" style={{ marginTop: '7px' }}>
                <Button variant='contained' color='primary' sx={{padding: '6px 10px 6px 10px'}} onClick={() => reset()}>RESET</Button>
            </div>
        </div>
    )
}
const capitalizeStr = (str: string) => {
    let split = str.replace('_', ' ').replace(/\+|-/g, '').split(' ')
    return split.map((s: string) => s[0].toUpperCase() + s.substr(1).toLowerCase()).join(' ')
}

const DraftCounter = (props: any) => {
    const { draft, handleClick, header, subheader, type } = props
    const heroNames = Object.keys(draft)
    const keys = sortByMatches(draft)

    const draftArray = (symbol: string) => {
        const arr = []
        for (let heroName of keys) {
            if (heroName.includes(symbol)) {
                arr.push(heroName)
            } else if (!heroName.match(/[+-]/) && symbol === '+') {
                arr.push(heroName)
            }
        }
        return arr
    }
    const withArr = draftArray('+')
    const againstArr = draftArray('-')
    return (
        <>
            <h4>{header}</h4>
            {!!withArr.length &&
                <>
                    {subheader[0] &&
                        <p>{subheader[0]}:</p>
                    }
                    <SearchResultText data={props.draft} handleClick={handleClick} filteredData={withArr} filtered={false} type={type} />
                </>
            }
            {!!againstArr.length &&
                <>
                    <p>{subheader[1]}:</p>
                    < SearchResultText data={props.draft} handleClick={handleClick} filteredData={againstArr} filtered={true} type={type} />
                </>
            }
        </>
    )
}
const SearchResultText = (props: any) => {
    const { data, filteredData, handleClick, type, filtered } = props
    return (
        filteredData.map((key: string, i: number) => {
            let matchKey = 'matches'
            if ('totalFilteredMatches' in data[key]) {
                matchKey = 'totalFilteredMatches'
            }
            const matches = data[key][matchKey]
            const totalWins = matches.filter((match: any) => match.win === 1).length
            const winRate = cleanDecimal(((totalWins / matches.length) * 100))
            const k = heroSwitcher(key.replace(/[+\-_]/g, x => x === '_' ? ' ' : ''))
            let end = ','
            if (i === props.filteredData.length - 1) {
                end = '';
            }
            else if (i === props.filteredData.length - 2) {
                end = ' and'
            }
            return (
                <span onClick={() => handleClick(data[key][matchKey], key, type)} style={{ marginRight: '5px', textTransform: 'capitalize' }}
                    className={`${type}-search-result table-search-result`} key={i}>{k}: ({matches.length}, <span style={{ color: colourWins(winRate) }}>{winRate}%</span>){end}</span>
            )
        })
    )
}
const ItemCounter = (props: any) => {
    const { items, handleClick } = props
    const keys = sortByMatches(items)
    return (
        <>
            <h4>Items: </h4>
            <SearchResultText data={items} handleClick={handleClick} filteredData={keys} type={'items'} />
        </>
    )
}
export default PickCounter