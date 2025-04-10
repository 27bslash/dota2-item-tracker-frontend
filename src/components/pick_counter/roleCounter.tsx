import { useParams } from 'react-router';
import colourWins from '../../utils/colourWins';
import { RoleStrings } from '../home/home';
import PickStats, { PickRoleStat } from '../types/pickStats';
import { usePickCounterContext } from './pickCounterContext';
import { cleanDecimal } from '../../utils/cleanDecimal';

const RoleCounter = () => {
    const params = useParams()
    const { role, totalPicks, roleSearch, matchData } = usePickCounterContext()
    const keys = Object.keys(totalPicks)
    const roles = []
    for (const k of keys) {
        const tsKey = k as keyof PickStats
        if (typeof (totalPicks[tsKey]) === 'object') {
            roles.push({ [tsKey]: totalPicks[tsKey] as PickRoleStat })
        }
    }
    const pickString = params['patch'] ? 'patch_picks' : 'picks'
    const winString = params['patch'] ? 'patch_wins' : 'wins'
    let sorted = roles.sort((a, b) => {
        const aKey = Object.keys(a)[0]
        const bKey = Object.keys(b)[0]
        return b[bKey][pickString] - a[aKey][pickString] || b[bKey]['winrate'] - a[aKey]['winrate']
    }).filter((x) => Object.keys(x)[0] !== 'trends')
    if (role) {
        sorted = sorted.filter((x) => {
            return Object.keys(x)[0] === role
        })
    }
    return (
        <>
            {!role &&
                sorted.map((x, i: number) => {
                    const key = Object.keys(x)[0] as RoleStrings
                    const value = x[key]
                    const picks = value[pickString]
                    const wins = value[winString]
                    const wr = cleanDecimal(wins / picks * 100)
                    const wrColor = colourWins(wr)
                    if (picks) {
                        return (
                            <p onClick={() => roleSearch(matchData, key)} className='total-picks' key={i}> {key} ({picks}, <span style={{ color: wrColor }}>{wr}%</span>)</p>
                        )
                    }
                })}
        </>
    )
}
export default RoleCounter