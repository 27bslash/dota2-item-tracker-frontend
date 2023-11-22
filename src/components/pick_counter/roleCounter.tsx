import colourWins from '../../utils/colourWins';
import { RoleStrings } from '../home/home';
import PickStats, { PickRoleStat } from '../types/pickStats';
import { usePickCounterContext } from './pickCounterContext';

const RoleCounter = () => {
    // const roles = totalPicks.filter((x: any) => typeof (x) === 'object')
    const { role, totalPicks, roleSearch, matchData } = usePickCounterContext()
    const keys = Object.keys(totalPicks)
    const roles = []
    for (const k of keys) {
        const tsKey = k as keyof PickStats
        if (typeof (totalPicks[tsKey]) === 'object') {
            roles.push({ [tsKey]: totalPicks[tsKey] as PickRoleStat })
        }
    }
    let sorted = roles.sort((a, b) => {
        const aKey = Object.keys(a)[0]
        const bKey = Object.keys(b)[0]
        return b[bKey]['picks'] - a[aKey]['picks'] || b[bKey]['winrate'] - a[aKey]['winrate']
    })
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
                    const wr = value['winrate']
                    const picks = value['picks']
                    const wrColor = colourWins(wr)
                    return (
                        <p onClick={() => roleSearch(matchData, key)} className='total-picks' key={i}> {key} ({picks}, <span style={{ color: wrColor }}>{wr}%</span>)</p>
                    )
                })}
        </>
    )
}
export default RoleCounter