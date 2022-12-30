import colourWins from '../colourWins';

const RoleCounter = (props: any) => {
    // const roles = props.totalPicks.filter((x: any) => typeof (x) === 'object')
    const keys = Object.keys(props.totalPicks)
    const roles = []
    for (let k of keys) {
        if (typeof (props.totalPicks[k]) === 'object') {
            roles.push({ [k]: props.totalPicks[k] })
        }
    }
    let sorted = roles.sort((a, b) => {
        const aKey = Object.keys(a)[0]
        const bKey = Object.keys(b)[0]
        return b[bKey]['picks'] - a[aKey]['picks'] || b[bKey]['winrate'] - a[aKey]['winrate']
    })
    if (props.role) {
        sorted = sorted.filter((role) => {
            return Object.keys(role)[0] === props.role
        })
    }
    return (
        <>
            {!props.role &&
                sorted.map((x: any, i: number) => {
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
export default RoleCounter