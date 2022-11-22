import { useEffect } from 'react';
import { useState } from 'react';
import colourWins from './colourWins';
import heroSwitcher from './heroSwitcher';
import stringSearch from './table/table_search/string_search';
interface pickProps {
    matchData: any,
    filteredData: any[],
    nameParam: string,
    updateMatchData: (data: object[]) => void,
    updateRole: (role: string) => void,
    type: string,
    totalPicks: object[],
    count: number
    heroColor: string
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

    // console.log(props.totalPicks)
    const roleSearch = (data: any, role: string) => {
        const m = stringSearch(data, 'role', role)
        props.updateMatchData(m)
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
                            <p onClick={() => reset()} className='bold-name' id='hero-name'
                                style={{ 'color': props.heroColor, textTransform: 'capitalize' }}><strong>{heroSwitcher(name).replace('_', ' ')}</strong></p>
                            <FilteredPickCounter data={data} roleSearch={roleSearch} />
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

const RoleCounter = (props: any) => {
    // const roles = props.totalPicks.filter((x: any) => typeof (x) === 'object')
    const keys = Object.keys(props.totalPicks)
    const roles = []
    for (let k of keys) {
        if (typeof (props.totalPicks[k]) === 'object') {
            roles.push({ [k]: props.totalPicks[k] })
        }
    }
    const sorted = roles.sort((a, b) => {
        const aKey = Object.keys(a)[0]
        const bKey = Object.keys(b)[0]
        return b[bKey]['picks'] - a[aKey]['picks'] || b[bKey]['winrate'] - a[aKey]['winrate']
    })

    return (
        <>
            {sorted.map((x: any, i: number) => {
                const key = Object.keys(x)[0]
                const value = x[key]
                const wr = value['winrate']
                const picks = value['picks']
                const wrColor = colourWins(wr)
                return (
                    <p onClick={() => props.roleSearch(props.matchData, key)} className='total-picks' key={i}> {key} ({picks}, <span style={{ color: wrColor }}>{wr}%</span>)</p>
                )

            })}
        </>
    )
}

const FilteredPickCounter = (props: any) => {
    const wins = winCalc(props.data)
    const totalWinRate = (wins['totalWins'] / props.data.length * 100)
    return (
        <>
            <p>was picked {props.data.length} times with a win rate of <span style={{ color: colourWins(totalWinRate), marginRight: '5px' }}>{totalWinRate.toFixed(2)}%</span></p>
            {wins['roles'].length > 1 &&
                <>
                    <p>it's mostly played:</p>
                    {wins['roles'].map((x: any, i: number) => {
                        console.log(x)
                        const role = x[0]
                        const value = x[1]
                        const win = wins['wins'][role] || 0
                        const winRate = (win / value * 100)
                        return <p onClick={() => props.roleSearch(props.data, role)} className='total-picks' key={i}>{role} ({value}, <span style={{ color: colourWins(winRate) }}>{winRate.toFixed(2)}%</span>)</p>
                    })}
                </>
            }
        </>
    )
}


const winCalc = (data: any[]) => {
    let roles: any = {}
    const wins: any = {}
    let totalWins = 0
    for (let match of data) {
        roles[match['role']] = (roles[match['role']] + 1) || 1;
        if (match['win'] === 1) {
            wins[match['role']] = (wins[match['role']] + 1) || 1;
            totalWins++
        }
    }
    roles = Object.entries(roles).sort((a: any, b: any) => b[1] - a[1])
    return { 'roles': roles, 'wins': wins, 'totalWins': totalWins }
}
export default PickCounter