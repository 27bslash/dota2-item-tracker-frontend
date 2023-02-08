const groupByTime = (data: any, itemData: any, matchData: any) => {
    const itemObj: any = { 'core': [], 'situational': [] }
    const res = [structuredClone(itemObj), structuredClone(itemObj), structuredClone(itemObj)]

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
            if (Math.abs(itemTime - x[1]['time']) <= 40 && !seenItems.has(x[0]) && x[1]['adjustedValue'] > 20 && count <= 1) {
                seenItems.add(x[0])
                count++
                return x
            } else {
                return false
            }
        }))
        count = 0
        const situational = Object.fromEntries([...data].filter((x: any) => {
            if (Math.abs(itemTime - x[1]['time']) <= 40 && item[1]['adjustedValue'] < 20 && item[1]['adjustedValue'] > 5 && !seenItems.has(x[0]) && itemData['items'][itemKey]['components'] && count <= 1) {
                seenItems.add(x[0])
                count++
                return x
            } else {
                return false
            }
        }))
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
    return res

}
export default groupByTime