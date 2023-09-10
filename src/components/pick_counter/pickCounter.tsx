import { useEffect } from 'react';
import { useState } from 'react';
import colourWins from '../../utils/colourWins';
import heroSwitcher from '../../utils/heroSwitcher';
import stringSearch from '../table/table_search/string_search';
import RoleCounter from './roleCounter';
import Match from '../types/matchData';
import { Box, Typography } from '@mui/material';
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
                            <TotalPickCounter type={props.type} reset={reset} role={props.role} totalPicks={props.matchData.length} name={props.nameParam} />
                            {/* <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter> */}
                        </>
                    }
                </div>
            }
        </>
    )
}
const BoldName = (props: { reset: () => void; color: string; name: string; }) => {
    return <p onClick={() => props.reset()} className='bold-name' id='hero-name' style={{ 'color': props.color, textTransform: 'capitalize' }}><strong >{heroSwitcher(props.name).replace(/_/g, ' ')}</strong></p>

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
            <PlayerPicks role={props.role} name={props.name} base={totalPicks} reset={props.reset} />
        )
    )
}
const PlayerPicks = (props: any) => {
    return (
        <div className="pal">
            <p className='bold-name'>{props.name} has played {props.base} times. He mostly plays: </p>
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
            <h3 onClick={() => props.reset()}>Search Results:</h3>
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