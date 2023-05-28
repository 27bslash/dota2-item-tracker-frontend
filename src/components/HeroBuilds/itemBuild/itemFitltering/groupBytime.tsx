const groupByTime = (data: any, itemData: any, matchData: any) => {
    const itemObj: any = { 'core': [], 'situational': [] }
    const res = [structuredClone(itemObj), structuredClone(itemObj), structuredClone(itemObj)]
    const coreArr = []
    const seenItems = new Set()
    for (let item of data) {
        const itemKey: any = item[0].replace(/__\d+/g, '')
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
        }))
        count = 0
        const situational = Object.fromEntries([...data].filter((x: any) => {
            if (Math.abs(itemTime - x[1]['time']) <= 40 && item[1]['adjustedValue'] < 20 && item[1]['adjustedValue'] > 5 && !seenItems.has(x[0]) && itemData['items'][itemKey]['components'] && count === 0) {
                seenItems.add(x[0])
                count++
                return x
            } else {
                return false
            }
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


    for (let itemGroup of res) {
        const keys: string[] = ['core', 'situational']
        for (let k of keys) {
            for (let itemArr of itemGroup[k]) {
                // console.log(Object.values(itemArr))
                const targetKey = Object.keys(itemArr)[0]
                if (Object.keys(Object.values(itemArr)[0]).includes('option')) {
                    // itemGroup[k].concat(itemArr)
                    const option = itemArr[targetKey]['option'][0]
                    const optionKey = option['choice']
                    const idx = itemGroup[k].findIndex((x) => Object.keys(x)[0] === optionKey)
                    itemArr[optionKey] = { 'value': option['targetValue'], 'adjustedValue': option['targetValue'], time: option['time'] }
                    itemGroup[k].splice(idx, 1)

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
    // console.log(res)
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