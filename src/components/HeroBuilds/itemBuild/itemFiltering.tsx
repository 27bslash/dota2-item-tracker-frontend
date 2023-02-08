const humanToUnix = (time: string | number) => {
    if (typeof (time) === "number") {
        return 0
    }
    const split = time.split(':')
    const hours = +split[0] * 3600
    const mins = +split[1] * 60
    const secs = +split[1]
    return hours + mins + secs
}
const medianValue = (values: number[]) => {
    values.sort()
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
}

export const countItems = (data: any, itemData: any) => {
    const consumables = [
        "tango",
        "flask",
        "ward_observer",
        "ward_sentry",
        "smoke_of_deceit",
        "enchanted_mango",
        "clarity",
        "tpscroll",
        "dust",
        "tome_of_knowledge",
        "gem",
        'faerie_fire'
    ];

    // most common items try sorting them by time maybe that's good enough
    // otherwise bbuild by boots maybe?
    const items: any[] = []
    for (let match of data) {
        const seenItems = new Set()
        for (let item of match['items']) {
            let time = typeof (item['time']) === 'string' ? humanToUnix(item['time']) : item['time']
            time = time < 0 ? 0 : time
            let key = item['key']
            if (!consumables.includes(item['key']) && !seenItems.has(key)) {
                // const idx = seenItems.filter((x) => x === key).length + 1
                // key = idx > 1 ? `${key}__${idx}` : key
                // key = key
                // let oKey = itemCount[item['key']]
                // console.log(key)
                items.push({ [key]: time })
                // itemCount[key] ? itemCount[key] = ({ value: oKey['value'] + 1, time: oKey['time'] + time })
                //     : itemCount[key] = { value: 1, time: time }

                seenItems.add(item['key'])
            }
        };

    }
    let itemValues: any = {}
    items.forEach((x, i) => {
        const key = Object.keys(x)[0]
        const filteredItemTimes: any[] = items.filter((item) => Object.keys(item)[0] === key).map((item) => Object.values(item)[0])
        if (filteredItemTimes) {
            const medianTime = medianValue(filteredItemTimes)
            const avgTime = filteredItemTimes.reduce((a, b) => a + b) / filteredItemTimes.length
            const time = Math.min(medianTime, avgTime)
            // console.log(key, avgTime, medianTime, items.length)
            itemValues[key] = { value: filteredItemTimes.length, time: time }
            // console.log(key, avgTime)
        }
        // itemValues[key] ? itemValues[key] = ({ value: oKey['value'] + 1, time: oKey['time'] + time })
        //     : itemValues[key] = { value: 1, time: time }
    })

    const map = Object.entries(itemValues).filter((item: any) => (item[1]['value'] / data.length) * 100 > 1).map((item: any) => {
        let count = 0
        const filteredData = data.filter((match: any) => {
            const lastTime = match['items'][match['items'].length - 1]['time']
            // console.log(match['items'], lastTime)
            const inItems = (match['items'].some((itemObj: any) => itemObj.key === item[0]))
            if (!inItems && lastTime - 300 > item[1]['time']
            ) {
                count++
            } else if (inItems) {
                return true
            }

        }).length
        if (item[1]['value'] >= filteredData) {
        }
        // console.log(item[0], item[1], avgTime, filteredData, count)
        // return [item[0], { value: (item[1]['value'] / data.length) * 100, 'time': avgTime }]
        return [item[0], { value: (item[1]['value'] / data.length) * 100, adjustedValue: (filteredData / (filteredData + count)) * 100, 'time': item[1]['time'] }]
        // if (filteredData > 0)
        // return [item[0], { value: (item[1]['value'] / data.length) * 100, adjustedValue: `${filteredData} / `, 'time': avgTime }]

    }).filter((x) => x)
    itemValues = map.sort((a: any, b: any) => a[1]['time'] - b[1]['time'])
    // console.log(itemValues)
    return itemValues
}
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
            }
        }))
        count = 0
        const situational = Object.fromEntries([...data].filter((x: any) => {
            if (Math.abs(itemTime - x[1]['time']) <= 40 && item[1]['adjustedValue'] < 20 && item[1]['adjustedValue'] > 5 && !seenItems.has(x[0]) && itemData['items'][itemKey]['components'] && count <= 1) {
                seenItems.add(x[0])
                count++
                return x
            }
        }))
        if (Object.keys(core).length) {
            // console.log(itemKey, 'core', core, itemTime)
        }
        if (itemKey === 'black_king_bar') {

            // console.log(seenItems, res, core, item[1]['value'])
        }
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
const boots_filter = (data: any[], itemData: any[]) => {
    const boots = ['tranquil_boots', 'arcane_boots', 'power_treads', 'phase_boots']
    const bootsCount = data.filter((x) => boots.includes(x[0])).length
    const filtered = data.filter((x) => {
        if (boots.includes(x[0])) {
            return +(100 / x[1]['value']).toFixed(0) < bootsCount || +(100 / x[1]['value']).toFixed(0) === 1
        } else {
            return true
        }
    })
    return filtered
}
export const filterComponents = (data: any[], itemData: any) => {
    let toRemove: string[] = []
    const gpm = 400
    const itemdata: any = itemData
    const keys = data.map((x) => x[0])
    console.log([...keys])
    const removedComponents: any = []
    const disassembleable = ['arcane_boots', 'echo_sabre', 'lotus_orb', 'octarine_core', 'vanguard', 'mask_of_madness']
    // console.log([...data])
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const itemKey: string = item[0]
        // console.log(itemKey, keys)
        const itemTime: number = item[1]['time']
        const itemStats = itemdata['items'][itemKey.replace(/__\d+/g, '')]
        if (!itemStats) {
            continue
        }
        // console.log(itemKey, itemStats['qual'])
        if (itemTime > 1000 && itemStats['cost'] < 500) {
            toRemove.push(data[i][0])
            continue
        }
        const cost: any = itemStats['cost']
        if (itemStats && itemStats['components']) {
            const components: string[] = itemStats['components']
            toRemove = recursive_remove(data[i], itemData, components, data, keys, removedComponents)
            // data = recursive_remove(itemData, components, data, keys)

            if (components && (disassembleable.includes(itemKey.replace(/__\d+/g, '')) || components.includes('kaya') || components.includes('sange'))) {
                for (let component of components) {
                    // console.log(itemKey, component, components);
                    const slicedData = [...data].slice(i + 1)
                    const itemUses = slicedData.filter((x, i) => {
                        const parentComponents = allComponents(itemdata['items'][x[0]]['components'], [], itemdata)
                        // console.log(x[0], parentComponents)
                        if (parentComponents && parentComponents.includes(component)) {
                            const core = x[1]['adjustedValue'] > 20 && item[1]['adjustedValue'] > 20
                            const situtational = x[1]['adjustedValue'] < 20 && item[1]['adjustedValue'] < 20
                            const componentInParent = slicedData.filter((item, idx) => idx <= i && parentComponents.includes(item[0])).map((x) => x[0])
                            if (componentInParent.length && !componentInParent.includes(component) && x[1]['value'] > item[1]['value'] / 2 && !parentComponents.includes(itemKey) && (core || situtational)) {
                                // console.log(item, parentComponents, x, componentInParent)
                                return true
                            }
                        }
                    })
                    itemUses.forEach((x) => {
                        const idx = keys.findIndex((uten) => uten === x[0])
                        const dissassembledComponents: string[] = allComponents(itemdata['items'][x[0]]['components'], [], itemdata).filter((x: string) => components.includes(x))
                        dissassembledComponents.unshift(itemKey)
                        if (dissassembledComponents.length % 2 !== 0) {
                            dissassembledComponents.pop()
                        }
                        if (dissassembledComponents.length > 1) {
                            // console.log(itemKey, itemUses, dissassembledComponents)
                            if (data[idx][1]['dissassembledComponents']) {
                                data[idx][1]['dissassembledComponents'].push(dissassembledComponents)
                            } else {
                                data[idx][1]['dissassembledComponents'] = [dissassembledComponents]
                            }
                            data[i][1]['disassemble'] = true
                        }
                    })

                    // check for future items that are missing the component
                    // then add the disassembled components to data[1]

                }
            }

            if (components.length !== toRemove.length) {
                // console.log(itemKey, components, removedComponents)
            }
        }
    }
    for (let item of toRemove) {
        const idx = keys.indexOf(item)
        if (idx !== -1) {
            data.splice(idx, 1)
            keys.splice(idx, 1)
        }
    }
    return data
}
const allComponents = (components: any, res: string[], itemdata: any): string[] => {
    if (!components) return res
    for (let component of components) {
        res.push(component)
        const componentStats = itemdata['items'][component]['components']
        if (componentStats) {
            for (let subComponent of componentStats) {
                res.push(subComponent)
            }
        }
    }
    return res
}

const recursive_remove = (item: any, itemdata: any, components: string[], data: any[], keys: any[], removedComponents: string[]): any => {
    const badQuals = ['component', 'common', 'consumable', 'secret_shop']
    for (let component of components) {
        const componentStats = itemdata['items'][component]
        const idx = keys.indexOf(component)

        const dataComponent = data[idx]
        // const parentItemIdx = data.findIndex((x, i) => {
        //     return x[0] === item[0]
        // })
        // if (parentItemIdx !== -1) {
        //     const sliced =keys.slice(0, parentItemIdx)
        //     index = sliced.indexOf()
        // }
        if (!dataComponent || component === 'blink' || component === 'boots' || component === 'travel_boots') {
            continue
        }
        if (badQuals.includes(componentStats['qual']) && !componentStats['components']) {
            // console.log(component, dataComponent[1]['time'] / componentStats['cost'] * 300)
            if ((!componentStats['hint'] || !componentStats['attrib'].length) && dataComponent[1]['time'] > 600) {
                // console.log('qual remove: ', component, componentStats, data[idx])
                removedComponents.push(component)
                continue
            } else if (!component.includes('boots') && component !== 'ring_of_health' && component !== 'helm_of_iron_will'
                && Math.abs(dataComponent[1]['time'] - item[1]['time']) < 300
                && item[1]['value'] > 3) {
                // console.log('lace', component, dataComponent, Math.abs(dataComponent[1]['time'] - item[1]['time']), item)
                removedComponents.push(component)
                continue
            }
            if (componentStats['components']) {
                // return recursive_remove(itemdata, componentStats['components'], data, keys, removedComponents)
            }
        } else if (badQuals.includes(componentStats['qual']) && componentStats['components']) {
            if (!componentStats['hint'] && dataComponent[1]['time'] > 1500) {
                removedComponents.push(component)
                continue
            }
        }
        if (dataComponent && componentStats['cost'] < 1500 && dataComponent[1]['time'] > 700 && item[1]['value'] * 2 > dataComponent[1]['value']) {
            // console.log('cost remove: ', component, componentStats['components'], componentStats)
            removedComponents.push(component)
            if (componentStats['components']) {
                // return recursive_remove(itemdata, componentStats['components'], data, keys, removedComponents)
            }
            continue

        } if (dataComponent && item[1]['value'] > 3 && item[1]['value'] * 2 > dataComponent[1]['value'] && Math.abs(item[1]['time'] - dataComponent[1]['time']) < 400
            && dataComponent[1]['time'] > 400
            && componentStats['cost'] < 2000) {
            // console.log('final remove: ', item, components, component, dataComponent)
            removedComponents.push(component)
            continue

        }
        if (componentStats['components'] && componentStats['cost'] < 900 && Math.abs(item[1]['time'] - dataComponent[1]['time']) < 300) {
            // console.log(component, componentStats)
            removedComponents.push(component)
            continue
        }
        if (component === 'sange') {
            removedComponents.push(component)
        }
        if (!componentStats['hint'] && dataComponent[1]['time'] > 1200) {
            removedComponents.push(component)
        }
        if (dataComponent[1]['time'] > 1800) {
            // console.log('time removal', component)
            removedComponents.push(component)
        }

    }
    return removedComponents
}
const filterItems = (data: any, itemData: any) => {
    data = countItems(data, itemData)
    data = filterComponents(data, itemData)
    // console.log(data)
    data = boots_filter(data, itemData)
    data = groupByTime(data, itemData, data)
    return data

}
export default filterItems