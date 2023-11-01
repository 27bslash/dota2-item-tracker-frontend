import { NonProDataType } from "../build";

const abilityFilter = (data: NonProDataType[], ab = '') => {
    const { abilities, aCount }: { abilities: any[]; aCount: { [key: string]: number } } = groupAbilities(data)
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
    const mostCommonBuilds = genMostCommonBuilds(aCount);
    console.log(mostCommonBuilds)
    return [mostCommonBuilds, abilityBuilds]
}
export default abilityFilter
export const testForSimilarBuilds = (abilityBuild: string, targetAbilityBuild: string, threshold: number) => {
    const split = abilityBuild.split('__')
    const mostPickedSplit = targetAbilityBuild.split('__')
    let difference = 0
    let lastSwap = 0
    // console.log(split, mostPickedSplit)
    if (split[0] !== mostPickedSplit[0]) difference = 1
    for (let [i, ability] of split.entries()) {
        const sl = split.slice(7, 9).sort().join()
        const sl2 = mostPickedSplit.slice(7, 9).sort().join()
        if (lastSwap + 2 === i) lastSwap = 0
        if (threshold > 3 && ability !== mostPickedSplit[i]) {
            difference++
            continue
        }
        if (sl === sl2) {
            // console.log('last equal')
            // continue
        }
        if (split[i] === mostPickedSplit[i + 1] && split[i + 1] === mostPickedSplit[i] && lastSwap === 0) {
            // console.log('swapsises')
            lastSwap = i
            difference -= 1
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
export const genMostCommonBuilds = (aCount: { [key: string]: number; }) => {
    let srt = Object.entries(aCount).sort((a: any, b: any) => b[1] - a[1]);
    // console.log([...srt])
    groupSimilarBuilds(srt);
    let mostPickedBuild: any[]
    let mostCommonBuilds = srt.sort((a: any, b: any) => b[1] - a[1]).filter((build, i) => {
        if (i === 0) mostPickedBuild = build;
        const buildPerc = (build[1] / mostPickedBuild[1]) * 100;
        if (buildPerc > 35) {
            return true;
        }
    });
    mostCommonBuilds = mostCommonBuilds.filter((abilityBuild, i) => {
        if (i === 0) return true;
        return !testForSimilarBuilds(abilityBuild[0], mostPickedBuild[0], 4);
    });
    return mostCommonBuilds;
}

const jackSort = (abilityString: string, testAbilityString: string) => {
    // assign ability to number
    const testAbilityArr = testAbilityString.split('__').slice(0, 8)
    const abilityArr = abilityString.split('__').slice(0, 8)
    const abilitySet = new Set<string>()
    const abilityValues: string[] = []
    for (let ability of testAbilityArr) {
        if (!abilitySet.has(ability)) {
            abilitySet.add(ability)
            abilityValues.push(ability)
        }
    }
    const sumval = (testAbilityArr: string[]) => {
        let total = 0;
        for (let ability of testAbilityArr) {
            const valueIndex = abilityValues.findIndex((ab) => ab === ability);
            const convertedVal = Math.pow(10, valueIndex);
            total += convertedVal;
        }
        return total;
    }
    // get sum of ability numbers
    let testTotal = String(sumval(testAbilityArr))
    let total = String(sumval(abilityArr))
    // calculate difference between totals 
    let difference = 0
    for (let [i, digit] of testTotal.split('').entries()) {
        if (digit !== total[i]) {
            difference += Math.abs(+digit - +total[i])
        }
    }
    if (difference < 1 && abilityString !== testAbilityString) {
        // console.log(total, abilityArr, testTotal, testAbilityArr)
        return true
    }
}
export const groupSimilarBuilds = (srt: [string, number, any?][]) => {
    // console.log(srt)
    for (const b of srt) {
        for (const [i, testBuild] of srt.entries()) {
            if (b[0] === testBuild[0]) {
                continue;
            }
            if (testForSimilarBuilds(b[0], testBuild[0], 1) && jackSort(b[0], testBuild[0])) {
                b[1] += testBuild[1];
                if (b[2]) {

                    b[2].push(testBuild)
                } else {
                    b[2] = [testBuild]
                }
                srt.splice(i, 1);
            }
        }
    }
    return srt
}

const groupAbilities = (data: NonProDataType[]) => {
    const abilities = []
    const aCount: { [key: string]: number } = {}
    for (let match of data) {
        if ('abilities' in match && match['abilities'].length > 9) {
            const abilityArray = match['abilities'].filter((ability) => ability.type !== 'talent').map((ability) => ability.img).slice(0, 9)
            abilities.push(abilityArray)
            // console.log(match)
            const key = match['abilities'].filter((ability) => ability.type !== 'talent').slice(0, 9).map((ability) => ability.img).join('__')
            aCount[key] = (aCount[key] + 1) || 1
        }
    }
    return { abilities, aCount }
}



