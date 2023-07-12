import { countItems } from "./itemFiltering"

const timeBracket = (item: any) => {
    if (item[1]['time'] < 700) {
        return 'early'
    } else if (item[1]['time'] < 1800) {
        return 'mid'
    } else {
        return 'late'
    }
}

const choice = (arr: any[], percentiles: any[], matchData: any, itemData: any) => {
    const key: string = arr[0]
    const adjustedVal = arr[1]['adjustedValue']
    if (adjustedVal > 70 || adjustedVal < 30) {
        return
    }

    const time = timeBracket(arr)
    const filteredByItem = matchData.filter((match: any) => match['items'].map((m: any) => m['key']).includes(key))
    const posCount = countItems(filteredByItem, [])
    const mainItemCost = itemData['items'][key]['cost']
    // console.log(posCount, nCount)
    const count = posCount.map((x: any) => x[0])
    const res = []
    for (let targetArr of percentiles) {

        if (key === targetArr[0]) {
            continue
        }

        const targetVal = targetArr[1]['adjustedValue']
        if (targetVal > 70 || targetVal < 40) continue
        const t = timeBracket(targetArr)
        const cost: number = itemData['items'][targetArr[0]]['cost']
        if (Math.abs(mainItemCost - cost) > (mainItemCost / 100) * 20 || t !== time || targetVal < 40 || targetVal > 60 || Math.abs(targetArr[1]['time'] - arr[1]['time']) > 300) {
            continue
        }
        // console.log(key, cost)
        if (count.includes(targetArr[0])) {
            const cIdx = count.findIndex((x: any) => x === targetArr[0])
            const targetItem = posCount[cIdx]
            if (Math.abs(targetItem[1]['adjustedValue'] - adjustedVal) > 35) {
                // console.log(key, 'target value: ', adjustedVal, 'new value: ', targetItem[1]['adjustedValue'], time)
                res.push({ 'original': key, 'value': adjustedVal, 'choice': targetItem[0], 'targetValue': targetArr[1]['adjustedValue'], 'time': targetArr[1]['time'] })
            }
        } else if (!count.includes(targetArr[0])) {
            // console.log(key, value)
            res.push({ 'original': key, 'value': adjustedVal, 'choice': targetArr[0], 'targetValue': targetArr[1]['adjustedValue'], 'time': targetArr[1]['time'] })
        }
        // for (let match of matchData) {
        //     for (let dict of match['items']) {
        //         if (k === dict['key']) {

        //             return true

        //         }
        //     }
        // }
    }
    if (res.length) return res
    // console.log('riop')
}
export const addItemChoices = (percentiles: any[], matchData: any, itemData: any) => {
    percentiles.forEach((arr: any[], i: number) => {
        const res = choice(arr, percentiles, matchData, itemData)
        if (res) {
            percentiles[i][1]['option'] = res
        }
    });
    return percentiles
}