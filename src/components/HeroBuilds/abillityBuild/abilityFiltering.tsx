
const abilityFilter = (data: any, ab = '') => {
    const abilities = []
    const aCount: { [key: string]: number } = {}
    for (let match of data) {
        if ('abilities' in match && match['abilities'].length > 9) {
            const abilityArray = match['abilities'].filter((ability: any) => ability.type !== 'talent').map((x: any) => x.img).slice(0, 9)
            abilities.push(abilityArray)
            // console.log(match)
            const key = match['abilities'].filter((ability: any) => ability.type !== 'talent').slice(0, 9).map((x: { img: string }) => x.img).join('__')
            aCount[key] = (aCount[key] + 1) || 1
        }
    }
    // console.log(aCount)
    const res = []
    for (let i = 0; i < 10; i++) {
        const count: any = {}
        for (let abilityArr of abilities) {
            if (abilityArr[i]) {
                count[abilityArr[i]] = (count[abilityArr[i]] || 0) + 1
            }
        }
        res.push(count)
    }
    const totalCount: any = {}
    if (!abilities.length) {
        return [[]]
    }
    let max_abilities = !abilities[0].includes('invoker') ? 4 : 7
    const abilityBuilds = genAbilityArr(res, ab, totalCount, max_abilities)
    let mostPickedBuild: any = []
    let srt = Object.entries(aCount).sort((a: any, b: any) => b[1] - a[1])
    for (const b of srt) {
        for (const [i, testBuild] of srt.entries()) {
            if (b[0] === testBuild[0]) {
                continue
            }
            if (testForSimilarBuilds(b[0], testBuild[0], 1)) {
                // console.log(testBuild[0])
                b[1] += testBuild[1]
                srt.splice(i, 1)
            }
        }
    }
    let mostCommonBuilds = srt.sort((a: any, b: any) => b[1] - a[1]).filter((build, i) => {
        if (i === 0) mostPickedBuild = build
        const buildPerc = (build[1] / mostPickedBuild[1]) * 100
        if (buildPerc > 50) {
            return true
        }
    })
    mostCommonBuilds = mostCommonBuilds.filter((abilityBuild, i) => {
        if (i === 0) return true
        return !testForSimilarBuilds(abilityBuild[0], mostPickedBuild[0], 4)
    })
    console.log(mostCommonBuilds)
    return [mostCommonBuilds, abilityBuilds]
}
export default abilityFilter
const testForSimilarBuilds = (abilityBuild: string, targetAbilityBuild: string, threshold: number) => {
    const split = abilityBuild.split('__')
    const mostPickedSplit = targetAbilityBuild.split('__')
    let difference = 0
    // console.log(split, mostPickedSplit)
    if (split[0] !== mostPickedSplit[0]) difference = 1
    for (let [i, ability] of split.entries()) {
        const sl = split.slice(7, 9).sort().join()
        const sl2 = mostPickedSplit.slice(7, 9).sort().join()
        if (threshold > 3 && ability !== mostPickedSplit[i]) {
            difference++
            continue
        }
        if (sl === sl2) {
            console.log('last equal')
            // continue
        }
        if (split[i] === mostPickedSplit[i + 1] && split[i + 1] === mostPickedSplit[i]) {
            // console.log('swapsises')
            continue
        }
        if (split[6] === mostPickedSplit[6] && split[2] === mostPickedSplit[2] && sl === sl2) {
            // console.log('max ability')
            break
        }
        if (ability !== mostPickedSplit[i]) {
            difference++
            // console.log(ability, difference)
        }
    }
    return difference < threshold

}

const genAbilityArr = (res: { [k: string]: number }[], ab: string, totalCount: any, max_abilities: number) => {
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
                    // console.log(i, key)
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
        // console.log(sorted, idx)
        try {
            const o = Object.fromEntries([sorted[idx]])
            final.push(o)
            i++
        } catch {
            i++
        }
    }
    return final
}
