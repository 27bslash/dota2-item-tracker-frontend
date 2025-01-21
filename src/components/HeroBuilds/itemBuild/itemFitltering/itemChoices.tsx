import { Items } from '../../../types/Item'
import { NonProDataType } from '../../types'
import { RawItemBuild, countItems } from './itemFiltering'

const timeBracket = (item: RawItemBuild) => {
    if (item[1]['time'] < 700) {
        return 'early'
    } else if (item[1]['time'] < 1800) {
        return 'mid'
    } else {
        return 'late'
    }
}
const componentChecker = (itemData: Items, arr: string, targetItem: string) => {
    const components = itemData['items'][arr]['components']
    const targetComponents = itemData['items'][targetItem]['components']
    if (!components) return
    for (const component of components) {
        if (!itemData['items'][component]) {
            return false
        }
        const componentCost = itemData['items'][component]['cost']
        if (
            componentCost &&
            componentCost >= 1000 &&
            targetComponents?.includes(component)
        ) {
            return true
        }
    }
}
export const choices = (
    arr: RawItemBuild,
    percentiles: RawItemBuild[],
    matchData: NonProDataType[],
    itemData: Items
) => {
    const key: string = arr[0].replace(/__\d+/g, '')
    const adjustedVal = arr[1]['adjustedValue']
    if (adjustedVal > 90 || adjustedVal < 20) {
        return
    }
    if (arr[1]['value'] < 5) {
        return
    }
    const filteredByItem = matchData.filter((match) =>
        match['items'].map((m) => m['key']).includes(key)
    )
    const posCount = countItems(filteredByItem, itemData)
    const count = posCount.map((x) => x[0])
    return choice(key, arr, percentiles, posCount, count, itemData)
}
export const choice = (
    key: string,
    itemObj: RawItemBuild,
    percentiles: RawItemBuild[],
    posCount: RawItemBuild[],
    count: string[],
    itemData: Items
) => {
    const mainItemCost: number = itemData['items'][key]['cost']!
    const res = []
    const adjustedVal = itemObj[1]['adjustedValue']
    const time = timeBracket(itemObj)
    for (const targetArr of percentiles) {
        const targetKey = targetArr[0].replace(/__\d+/g, '')
        if (key === targetKey || !itemData['items'][targetKey]) continue
        if (!componentChecker(itemData, key, targetKey)) continue
        const targetVal = targetArr[1]['adjustedValue']
        const t = timeBracket(targetArr)
        const cost: number = itemData['items'][targetKey]['cost']!
        if (
            Math.abs(mainItemCost - cost) > (mainItemCost / 100) * 20 ||
            t !== time ||
            Math.abs(targetArr[1]['time'] - itemObj[1]['time']) > 900
        ) {
            continue
        }
        if (targetVal < 15) continue

        // check if item is in same bracket
        if (
            (targetVal > 25 && adjustedVal < 25) ||
            (targetVal < 25 && adjustedVal > 25)
        )
            continue
        if (targetVal > 80) continue
        // console.log(key, cost)
        if (count.includes(targetArr[0])) {
            const cIdx = count.findIndex((x) => x === targetArr[0])
            const targetItem = posCount[cIdx]
            if (targetItem[1]['adjustedValue'] < 50) {
                // console.log(key, 'target value: ', adjustedVal, 'new value: ', targetItem[1]['adjustedValue'], time)
                res.push({
                    original: key,
                    value: adjustedVal,
                    choice: targetItem[0],
                    targetValue: targetArr[1]['adjustedValue'],
                    time: targetArr[1]['time'],
                })
            }
        } else if (!count.includes(targetArr[0])) {
            // console.log(key)
            res.push({
                original: key,
                value: adjustedVal,
                choice: targetArr[0],
                targetValue: targetArr[1]['adjustedValue'],
                time: targetArr[1]['time'],
            })
        }
    }
    if (res.length) return res[0]
}
export const addItemChoices = (
    percentiles: RawItemBuild[],
    matchData: NonProDataType[],
    itemData: Items
) => {
    percentiles.forEach((arr, i: number) => {
        const res = choices(arr, percentiles, matchData, itemData)
        if (res) {
            percentiles[i][1]['option'] = res
        }
    })
    return percentiles
}
