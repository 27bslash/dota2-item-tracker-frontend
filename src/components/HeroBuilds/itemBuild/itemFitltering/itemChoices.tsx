import { NonProDataType } from "../../builds/build"
import { Items } from "../../../types/Item"
import { RawItemBuild, countItems } from "./itemFiltering"

const timeBracket = (item: any) => {
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
        const componentCost = itemData['items'][component]['cost']
        if (componentCost && componentCost >= 1000 && targetComponents?.includes(component)) {
            // console.log(arr, targetItem, components, targetComponents)
            return true
        }
    }

}
const choice = (arr: RawItemBuild, percentiles: RawItemBuild[], matchData: NonProDataType[], itemData: Items) => {
    const key: string = arr[0].replace(/__\d+/g, '')
    const adjustedVal = arr[1]['adjustedValue']
    if (adjustedVal > 90 || adjustedVal < 20) {
        return
    }
    if (arr[1]['value'] < 5) {
        return
    }
    const time = timeBracket(arr)
    const filteredByItem = matchData.filter((match) => match['items'].map((m) => m['key']).includes(key))
    const posCount = countItems(filteredByItem, itemData)
    const mainItemCost: number = itemData['items'][key]['cost']!
    // console.log(posCount, nCount)
    const count = posCount.map((x) => x[0])
    const res = []
    for (const targetArr of percentiles) {
        const targetKey = targetArr[0].replace(/__\d+/g, '')
        if (targetKey === key) continue
        if (key === targetKey || !itemData['items'][targetKey]) {
            continue
        }
        if (!componentChecker(itemData, key, targetKey)) {
            continue
        }

        const targetVal = targetArr[1]['adjustedValue']
        // if (targetVal > 70 || targetVal < 40) continue
        const t = timeBracket(targetArr)
        const cost: number = itemData['items'][targetKey]['cost']!
        if (Math.abs(mainItemCost - cost) > (mainItemCost / 100) * 20 || t !== time || Math.abs(targetArr[1]['time'] - arr[1]['time']) > 900) {
            continue
        }

        // check if item is in same bracket
        if ((targetArr[1]['adjustedValue'] > 25 && adjustedVal < 25) || (targetArr[1]['adjustedValue'] < 25 && adjustedVal > 25)) continue
        if (targetVal > 80) continue
        // console.log(key, cost)
        if (count.includes(targetArr[0])) {
            const cIdx = count.findIndex((x) => x === targetArr[0])
            const targetItem = posCount[cIdx]
            if (Math.abs(targetItem[1]['adjustedValue'] - adjustedVal) > 30) {
                // console.log(key, 'target value: ', adjustedVal, 'new value: ', targetItem[1]['adjustedValue'], time)
                res.push({ 'original': key, 'value': adjustedVal, 'choice': targetItem[0], 'targetValue': targetArr[1]['adjustedValue'], 'time': targetArr[1]['time'] })
            }
        } else if (!count.includes(targetArr[0])) {
            // console.log(key)
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
    if (res.length) return res[0]
    // console.log('riop')
}
export const addItemChoices = (percentiles: RawItemBuild[], matchData: NonProDataType[], itemData: Items) => {
    percentiles.forEach((arr, i: number) => {
        const res = choice(arr, percentiles, matchData, itemData)
        if (res) {
            percentiles[i][1]['option'] = res
        }
    });
    return percentiles
}