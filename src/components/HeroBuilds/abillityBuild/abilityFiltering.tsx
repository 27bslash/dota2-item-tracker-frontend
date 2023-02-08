const abilityFilter = (data: any, ab = '') => {
    const abilities = []
    const aCount: { [key: string]: number } = {}
    for (let match of data) {
        if ('abilities' in match) {
            const abilityArray = match['abilities'].filter((ability: any) => ability.type !== 'talent').map((x: any) => x.img).slice(0, 10)
            abilities.push(abilityArray)
        } else {
            console.log(match)
        }
        const key = match['abilities'].filter((ability: any) => ability.type !== 'talent').slice(0, 10).map((x: { img: string }) => x.img).join('__')
        // console.log('key', key)
        aCount[key] = (aCount[key] + 1) || 1
    }
    const res = []
    for (let i = 0; i < 10; i++) {
        const count: any = {}
        for (let abilityArr of abilities) {
            count[abilityArr[i]] = (count[abilityArr[i]] || 0) + 1
        }
        res.push(count)
    }
    const totalCount: any = {}
    const final: any = []
    let max_abilities = !abilities[0].includes('invoker') ? 4 : 7
    const abilityBuilds = genAbilityArr(res, ab, totalCount, max_abilities)
    let mostPickedBuild: any = []
    const mostCommonBuilds = Object.entries(aCount).sort((a: any, b: any) => b[1] - a[1]).filter((build, i) => {
        if (i === 0) mostPickedBuild = build
        const buildPerc = (build[1] / mostPickedBuild[1]) * 100
        if (buildPerc > 50) {
            return true
        }
    }).slice(0, 3)
    return [mostCommonBuilds, abilityBuilds]
}
export default abilityFilter

const genAbilityArr = (res: any[], ab: string, totalCount: any, max_abilities: number) => {
    const final = []
    let i = 0;
    for (let x of res) {
        const entries: any[] = Object.entries(x)
        const sorted = entries.sort((a: any, b: any) => {
            return b[1] - a[1]
        })
        let idx = 0
        for (let entry of sorted) {
            let key = entry[0]
            if (i === 0 && key === ab) {
                idx += 1
            }
            if (final.length && i === 1) {
                key = Object.keys(final[i - 1])[0]
                if (Object.keys(final[i - 1])[0] === entry[idx] && totalCount[entry[idx]] === 1) {
                    idx += 1
                    console.log(i, key)
                }
            }
            const k = sorted[idx][0]
            if (totalCount[k] === max_abilities || (i < 4 && totalCount[k] === 2)) {
                idx += 1
            } else {
                totalCount[k] = (totalCount[k] || 0) + 1
                break
            }
        }
        const o = Object.fromEntries([sorted[idx]])
        final.push(o)
        i++
    }
    return final
}
