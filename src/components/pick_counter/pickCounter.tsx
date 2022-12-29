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
    updateMatchData: (data: object[], value?: string[], types?: string[]) => void,
    updateRole: (role: string) => void,
    type: string,
    totalPicks: object[],
    count: number
    heroColor: string,
    searchRes?: { values: string[] }
}
const PickCounter = (props: pickProps) => {
    const name = props.nameParam
    const [data, setData] = useState<any>(props.matchData)
    const [filtering, setFiltering] = useState(false)
    useEffect(() => {
        if (props.count < props.matchData.length) {
            setData(props.filteredData)
            setFiltering(true)
        }
    }, [props.filteredData])

    const roleSearch = (data: any, role: string) => {
        const m = stringSearch(data, 'role', role)
        props.updateMatchData(m, [role], ['roles'])
        props.updateRole(role)
    }
    const reset = () => {
        props.updateMatchData(props.matchData)
        setFiltering(false)
        props.updateRole('')
    }
    return (
        <>
            {props.heroColor &&
                <div className="pick-counter" style={{ color: 'white' }}>
                    {filtering ? (
                        <>
                            <SearchResultsText data={props.matchData} updateMatchData={props.updateMatchData} roleSearch={roleSearch} searchRes={props.searchRes}
                                heroColor={props.heroColor} name={name} reset={reset} />
                        </>
                    ) : (
                        <>
                            <TotalPickCounter type={props.type} color={props.heroColor} totalPicks={props.totalPicks} name={props.nameParam} />
                            <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} roleSearch={roleSearch}></RoleCounter>
                        </>
                    )
                    }
                </div >
            }
        </>
    )
}
const TotalPickCounter = (props: any) => {
    return (
        <>
            {props.type === 'hero' ? (
                <>
                    <p className='bold-name' id='hero-name' style={{ 'color': props.color, textTransform: 'capitalize' }}><strong >{heroSwitcher(props.name).replace('_', ' ')}</strong></p>
                    <p>was picked {props.totalPicks['picks']} times with a win rate of <span style={{ color: colourWins(props.totalPicks['winrate']), marginRight: '5px' }}>
                        {props.totalPicks['winrate']}%
                    </span>
                        it's mostly played:
                    </p>
                </>
            ) : (
                <div className="pal">
                    <p className='bold-name'>{props.name} has played {props.totalPicks['picks']} times. He mostly plays: </p>
                </div>
            )}
        </>
    )
}
const sortByMatches = (data: any) => {
    const sorted = Object.entries(data).sort((a: any, b: any) => b[1]['matches'].length - a[1]['matches'].length);
    const keys = sorted.map((item) => item[0])
    return keys.slice(0, 5)
}
const SearchResultsText = (props: any) => {
    const { searchRes, data, roleSearch, updateMatchData, name, reset } = props
    const items = searchRes['values']['items']
    const draft = searchRes['values']['draft']
    const role = searchRes['values']['role']
    const players = searchRes['values']['player']

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