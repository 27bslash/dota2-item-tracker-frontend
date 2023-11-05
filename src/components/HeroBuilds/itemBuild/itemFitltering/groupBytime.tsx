const groupByTime = (data: any, itemData: any, roleKey: string) => {
    const itemObj: any = { 'core': [], 'situational': [] }
    const res = [structuredClone(itemObj), structuredClone(itemObj), structuredClone(itemObj)]
    const coreArr = []
    const seenItems = new Set<string>()
    const filteredData = data.filter((x: any) => x[1]['adjustedValue'] > 10)
    let c = 0
    const filterItems = (data: any, roleKey: string, time: number, type: string) => {
        const ret: any[] = []
        const supportRoles = ['Hard Support', 'Support', 'Roaming']

        let percForCore = time <= 1800 && !supportRoles.includes(roleKey) ? 60 : 40
        if (supportRoles.includes(roleKey) && time <= 1800) {
            percForCore = 50
        } else if (supportRoles.includes(roleKey)) {
            percForCore = 20
        }
        Object.fromEntries([...data].filter((x: any) => {
            const coreStatement = x[1]['time'] < time && !seenItems.has(x[0]) && x[1]['adjustedValue'] > percForCore
            if ((type === 'core' && coreStatement)) {
                seenItems.add(x[0])
                x[1]['key'] = x[0]
                ret.push(x[1])
                return x
            } else if (type === 'situational' && x[1]['time'] < time && !seenItems.has(x[0]) && x[1]['adjustedValue'] < percForCore && x[1]['adjustedValue'] > 10) {
                seenItems.add(x[0])
                x[1]['key'] = x[0]
                ret.push(x[1])
                return x
            }
            else {
                return false
            }
        }))
        return ret
    }
    const earlyCore = filterItems(filteredData, roleKey, 700, 'core')
    const earlySituational = filterItems(filteredData, roleKey, 700, 'situational')
    const midCore = filterItems(filteredData, roleKey, 1800, 'core')
    const midSituational = filterItems(filteredData, roleKey, 1800, 'situational')
    const lateCore = filterItems(filteredData, roleKey, 999999, 'core')
    const lateSituational = filterItems(filteredData, roleKey, 999999, 'situational')
    if (earlyCore.length) res[0]['core'] = earlyCore
    if (midCore.length) res[1]['core'] = midCore
    if (lateCore.length) res[2]['core'] = lateCore
    if (earlySituational.length) res[0]['situational'] = earlySituational
    if (midSituational.length) res[1]['situational'] = midSituational
    if (lateSituational.length) res[2]['situational'] = lateSituational
    for (let item of filteredData) {
        const itemKey: any = item[0].replace(/__\d+/g, '')
        const itemTime: any = item[1]['time']
        // hard coded mid lane item fix
        if (itemTime <= 60 && itemKey !== 'bottle') {
            continue
        }
        // filter out any dissassembled compotents that are also a an item choice
        if (item['dissassembledComponents'] && item['option']) {
            item['dissassembledComponents'] = item['dissassembledComponents'].filter((x: any[]) =>
                !item['option'].find((k: any) => k['choice'] === x[0])
            )
        }
        let count = 0
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
                const targetKey = itemObject['key']
                const values = Object.values(itemObject)
                if (!values) continue
                if (itemObject['option']) {
                    // itemGroup[k].concat(itemArr)
                    const option = itemObject['option']
                    const optionKey = option['choice']
                    if (choiceSet.has(targetKey) || choiceSet.has(optionKey)) continue
                    // remove the option from the situational if core
                    const otherSet = k === 'core' ? 'situational' : 'core'
                    const idx = itemGroup[k].findIndex((x: any) => x['key'] === optionKey)
                    const situationalIdx = itemGroup[otherSet].findIndex((x: any) => x['key'] === optionKey)
                    itemObject[optionKey] = { 'value': option['targetValue'], 'adjustedValue': option['targetValue'], time: option['time'] }
                    if (idx !== -1) itemGroup[k].splice(idx, 1); itemGroup[otherSet].splice(situationalIdx, 1)

                } else if (itemObject['option'] && itemGroup[k].length > 6) {
                    const option = itemObject['option']
                    const optionKey = option['choice']
                    // console.log(targetKey, i, itemGroup[k])
                    // console.log(optionKey, i, itemGroup[k])
                    if (choiceSet.has(targetKey) || choiceSet.has(optionKey)) continue
                    const optionIdx = itemGroup[k].findIndex((x: any) => x['key'] === optionKey)
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
        }
    }
    console.log('item build: ', res)
    return res

}
export default groupByTime