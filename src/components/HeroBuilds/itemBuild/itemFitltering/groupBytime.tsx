const groupByTime = (data: any, itemData: any, matchData: any) => {
    const itemObj: any = { 'core': [], 'situational': [] }
    const res = [structuredClone(itemObj), structuredClone(itemObj), structuredClone(itemObj)]
    const coreArr = []
    const seenItems = new Set()
    for (let item of data) {
        const itemKey: any = item[0].replace(/_\d+/g, '')
        const itemTime: any = item[1]['time']
        if (itemTime <= 60) {
            continue
        }
        let count = 0
        const core = Object.fromEntries([...data].filter((x: any) => {
            // group items into sections of 2 mins apart also filter situational items out
            if (Math.abs(itemTime - x[1]['time']) <= 40 && !seenItems.has(x[0]) && x[1]['adjustedValue'] > 20 && count === 0) {
                seenItems.add(x[0])
                count++
                return x
            } else {
                return false
            }
        }).map((x: any) => [x[0].replace(/__\d+|_\d+/g, ''), x[1]]))
        count = 0
        const situational = Object.fromEntries([...data].filter((x: any) => {
            if (Math.abs(itemTime - x[1]['time']) <= 40 && item[1]['adjustedValue'] < 20 && item[1]['adjustedValue'] > 5 && !seenItems.has(x[0]) && itemData['items'][itemKey]['components'] && count === 0) {
                seenItems.add(x[0])
                count++
                return x
            } else {
                return false
            }
        }).map((x: any) => {
            return [x[0].replace(/__\d+|_\d+/g, ''), x[1]]
        }))
        // const filtereedData = matchData.filter((match: any) => match['items'].map((itemObject: any) => itemObject['key']).includes(item[0]))
        // console.log(filtereedData)

        const coreLength = Object.keys(core).length !== 0
        // console.log(data.length, (item[1]['value'] / matchData.length) * 100, item[0])
        // if (item[1]['value'] < 3 && itemData['items'][itemKey]['components']) {
        //     // console.log(itemData['items'][item[0]])
        //     res[3].push(Object.fromEntries([item]))
        //     // continue
        // }
        // for (let k in filtered) {
        //     console.log(k, filtered)
        //     if (filtered[k]['time'] < 700) {
        //         res[0].push({ [k]: filtered[k] })
        //     } else if (itemTime < 1500) {
        //         res[1].push(filtered)
        //     } else {
        //         res[2].push(filtered)
        //     }
        // }
        if (coreLength) {
            if (itemTime < 700) {
                // console.log(itemKey, core, res[0])
                res[0]['core'].push(core)
            } else if (itemTime < 1800) {
                res[1]['core'].push(core)
                // coreArr.push(core)
            } else {
                res[2]['core'].push(core)
            }
        } if (Object.keys(situational).length) {
            if (itemTime < 700) {
                res[0]['situational'].push(situational)
            } else if (itemTime < 1800) {
                res[1]['situational'].push(situational)
            } else {
                res[2]['situational'].push(situational)
            }
        }
    }
    const itemChoiceHandler = (optionKey: string, targetKey: string, itemGroup: any[], i: number, optionIdx: number) => {
        // const option = itemObject[targetKey]['option'][0]
        // const optionKey = option['choice']
        // // console.log(targetKey, i, itemGroup[k])
        // let idx = i
        // console.log(optionKey, i, itemGroup[k])
        // if (choiceSet.has(targetKey) || choiceSet.has(optionKey)) continue
        // if (optionIdx < i) {
        //     idx = optionIdx
        // }
        // delete itemObject[targetKey]['option']
        // choiceSet.add(optionKey)
        // choiceSet.add(targetKey)
        const itemGroupLen = itemGroup.slice(6).length
        // console.log(12 - itemGroupLen, optionIdx, optionIdx + (itemGroupLen - 12) + 7)
        itemGroup.splice(optionIdx + (itemGroupLen - 6) + 7, 0, itemGroup[i])
        itemGroup[optionIdx][optionKey]['longOption'] = optionKey
        const newIdx = itemGroup.findIndex((x: any) => Object.keys(x)[0] === targetKey)
        // console.log(i + 4, optionIdx, newIdx)
        itemGroup.splice(newIdx, 1)
        // console.log(itemGroup, newIdx, optionIdx)
        return itemGroup
    }
    const padArray = (arr: any[]) => {
        let desiredLength = 6;
        const slice = arr.slice(6)
        let paddingNeeded = desiredLength - slice.length;
        let paddingLeft = Math.floor(paddingNeeded / 2);
        let paddingRight = paddingNeeded - paddingLeft;
        let paddedArray = Array(paddingLeft).fill({}).concat(slice, Array(paddingRight).fill({}));
        return paddedArray
    }
    const choiceSet = new Set()
    for (let itemGroup of res) {
        const keys: string[] = ['core', 'situational']
        for (let k of keys) {
            // const sli = itemGroup[k].slice(0, 6)
            // console.log(sli)
            // let sliced = padArray(itemGroup[k].slice(7))
            // itemGroup[k] = sli.concat(sliced)
            for (let [i, itemObject] of itemGroup[k].entries()) {
                // console.log(Object.values(itemArr))
                const objectKeys = Object.keys(itemObject)
                const targetKey = objectKeys[0]
                const values = Object.values(itemObject)[0]
                if (!values) continue
                if (Object.keys(values).includes('option')) {
                    // itemGroup[k].concat(itemArr)
                    const option = itemObject[targetKey]['option'][0]
                    const optionKey = option['choice']
                    if (choiceSet.has(targetKey) || choiceSet.has(optionKey)) continue
                    const idx = itemGroup[k].findIndex((x: any) => Object.keys(x)[0] === optionKey)
                    itemObject[optionKey] = { 'value': option['targetValue'], 'adjustedValue': option['targetValue'], time: option['time'] }
                    itemGroup[k].splice(idx, 1)

                } else if (Object.keys(values).includes('option') && itemGroup[k].length > 6) {
                    const option = itemObject[targetKey]['option'][0]
                    const optionKey = option['choice']
                    // console.log(targetKey, i, itemGroup[k])
                    let idx = i
                    // console.log(optionKey, i, itemGroup[k])
                    if (choiceSet.has(targetKey) || choiceSet.has(optionKey)) continue
                    const optionIdx = itemGroup[k].findIndex((x: any) => Object.keys(x)[0] === optionKey)
                    // if (optionIdx < i) {
                    //     idx = optionIdx
                    // }
                    // delete itemObject[targetKey]['option']
                    // choiceSet.add(optionKey)
                    // choiceSet.add(targetKey)
                    // itemGroup[k].splice(optionIdx + 7, 0, itemGroup[k][i])
                    // itemGroup[k][optionIdx][optionKey]['longOption'] = true
                    // const newIdx = itemGroup[k].findIndex((x: any) => Object.keys(x)[0] === targetKey)
                    // console.log(i + 4, optionIdx, newIdx)
                    // itemGroup[k].splice(newIdx, 1)
                    if (i <= optionIdx) {
                        itemGroup[k] = itemChoiceHandler(targetKey, optionKey, itemGroup[k], optionIdx, i)
                    } else {
                        itemGroup[k] = itemChoiceHandler(optionKey, targetKey, itemGroup[k], i, optionIdx)
                    }
                    // itemObject[optionKey] = { 'value': option['targetValue'], 'adjustedValue': option['targetValue'], time: option['time'] }

                    // delete itemObject[targetKey]['option']
                    // itemGroup[k].splice(idx, 1)

                }
            }
            if (itemGroup[k].length > 5) {
                // console.log('test', k)
                itemGroup[k] = chunkArray(itemGroup[k], 6)
                // console.log(itemGroup[k])
            } else {
                itemGroup[k] = [itemGroup[k]]
            }
        }
    }
    console.log(res)
    return res

}
const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    let index = 0;
    while (index < array.length) {
        chunks.push(array.slice(index, index + size));
        index += size;
    }
    return chunks;
}
export default groupByTime