import { useEffect } from 'react';
import { useState } from 'react';
import colourWins from '../colourWins';
import heroSwitcher from '../heroSwitcher';
import stringSearch from '../table/table_search/string_search';
import RoleCounter from './roleCounter';
import Draft from './../table/draft';
interface pickProps {
    matchData: any,
    filteredData: any[],
    nameParam: string,
    role: string,
    updateMatchData: (data: object[], value?: string[], types?: string[]) => void,
    updateRole: (role: string) => void,
    type: string,
    totalPicks: object[],
    count: number
    heroColor: string,
    searchRes?: object
}
const PickCounter = (props: pickProps) => {
    const name = props.nameParam
    const [data, setData] = useState<any>(props.matchData)
    const [searching, setSearching] = useState(false)
    useEffect(() => {
        if (props.searchRes) {
            setData(props.filteredData)
            setSearching(true)
        }
    }, [props.filteredData])

    const roleSearch = (data: any, role: string) => {
        const m = stringSearch(data, 'role', role)
        props.updateMatchData(m)
        props.updateRole(role)
    }
    const reset = () => {
        props.updateMatchData(props.matchData)
        setSearching(false)
        props.updateRole('')
    }
    return (
        <>
            <div className="pick-counter" style={{ color: 'white' }}>
                {searching ? (
                    <SearchResultsText data={props.matchData} updateMatchData={props.updateMatchData} roleSearch={roleSearch} searchRes={props.searchRes}
                        heroColor={props.heroColor} name={name} reset={reset} />
                ) : (
                    props.type === 'hero' && props.heroColor &&
                    <>
                        <TotalPickCounter type={props.type} reset={reset} color={props.heroColor} role={props.role} totalPicks={props.totalPicks} name={props.nameParam} />
                        <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter>
                    </>

                )
                }
            </div >
        </>
    )
}
const BoldName = (props: { reset: () => void; color: string; name: string; }) => {
    return <p onClick={() => props.reset()} className='bold-name' id='hero-name' style={{ 'color': props.color, textTransform: 'capitalize' }}><strong >{heroSwitcher(props.name).replace('_', ' ')}</strong></p>

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
    const base = props.role ? props.totalPicks[props.role] : props.totalPicks
    return (
        props.type === 'hero' ? (
            <HeroPicks role={props.role} name={props.name} base={base} color={props.color} reset={props.reset} />
        ) : (
            <div className="pal">
                <p className='bold-name'>{props.name} has played {base['picks']} times. He mostly plays: </p>
            </div>
        )
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

    const handleClick = (matches: any, key: string, type: string) => {
        const newMatchArr = matches.map((m: any) => m.id)
        const filteredMatches = data.filter((match: any) => newMatchArr.includes(match.id))
        searchRes['values'] = { [type]: { [key]: { matches: filteredMatches } } }
        updateMatchData(filteredMatches)
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
                    <h4>Players: </h4>
                    <SearchResultText data={players} handleClick={handleClick} filteredData={playerKeys} type={'player'} />
                </>
            }
            {items && Object.keys(items).length > 0 &&
                <ItemCounter handleClick={handleClick} items={items} />
            }
            {draft && !!Object.keys(draft).length &&
                <DraftCounter handleClick={handleClick} draft={draft} />
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
    const { draft, handleClick } = props
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
            <h4>Draft</h4>
            {!!withArr.length &&
                <>
                    <p>With:</p>
                    <SearchResultText data={props.draft} handleClick={handleClick} filteredData={withArr} type={'draft'} />
                </>
            }
            {!!againstArr.length &&
                <>
                    <p>Against:</p>
                    < SearchResultText data={props.draft} handleClick={handleClick} filteredData={againstArr} type={'draft'} />
                </>
            }
        </>
    )
}
const SearchResultText = (props: any) => {
    const { data, filteredData, handleClick, type } = props
    return (
        filteredData.map((key: string, i: number) => {
            const matches = data[key]['matches']
            const totalWins = matches.filter((match: any) => match.win === 1).length
            const winRate = ((totalWins / matches.length) * 100).toFixed(2)
            const k = heroSwitcher(key.replace(/[+\-_]/g, x => x === '_' ? ' ' : ''))
            let end = ','
            if (i === props.filteredData.length - 1) {
                end = '';
            }
            else if (i === props.filteredData.length - 2) {
                end = ' and'
            }
            return (
                <span onClick={() => handleClick(matches, key, type)} style={{ marginRight: '5px', textTransform: 'capitalize' }}
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