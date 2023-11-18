import Items from "../../../types/Item"

const recursive_remove = (item: any, itemdata: any, components: string[], data: any[], keys: any[], removedComponents: string[]): any => {
    const badQuals = ['component', 'common', 'consumable', 'secret_shop']
    for (const component of components) {
        const itemDupeNum = item[0].match(/\d+/g)
        const componentStats = itemdata['items'][component]
        let idx
        let componentKey
        if (itemDupeNum) {
            idx = keys.findIndex((pot) => pot === (`${component}_${itemDupeNum}`))
            componentKey = `${component}_${itemDupeNum}`
        } else {
            idx = keys.indexOf(component)
            componentKey = component
        }

        const dataComponent = data[idx]
        if (!dataComponent || component === 'blink' || component === 'boots' || component === 'travel_boots' || component === 'ultimate_scepter') {
            continue
        }
        if (badQuals.includes(componentStats['qual']) && !componentStats['components']) {
            // console.log(component, dataComponent[1]['time'] / componentStats['cost'] * 300)
            if ((!componentStats['hint'] || !componentStats['attrib'].length) && dataComponent[1]['time'] > 600) {
                // console.log('qual remove: ', component, componentStats, data[idx])
                removedComponents.push(componentKey)
                continue
            } else if (!component.includes('boots') && component !== 'ring_of_health' && component !== 'cornucopia' && component !== 'helm_of_iron_will'
                && Math.abs(dataComponent[1]['time'] - item[1]['time']) < 300
                && item[1]['value'] > 3) {
                // console.log('lace', component, dataComponent, Math.abs(dataComponent[1]['time'] - item[1]['time']), item)
                removedComponents.push(componentKey)
                continue
            }
            if (componentStats['components']) {
                // return recursive_remove(itemdata, componentStats['components'], data, keys, removedComponents)
            }
        } else if (badQuals.includes(componentStats['qual']) && componentStats['components']) {
            if (!componentStats['hint'] && dataComponent[1]['time'] > 1500) {
                removedComponents.push(componentKey)
                continue
            }
        }
        if (dataComponent && componentStats['cost'] < 1500 && dataComponent[1]['time'] > 700 && item[1]['value'] * 2 > dataComponent[1]['value']) {
            // console.log('cost remove: ', component, componentStats['components'], componentStats)
            removedComponents.push(componentKey)
            if (componentStats['components']) {
                // return recursive_remove(itemdata, componentStats['components'], data, keys, removedComponents)
            }
            continue

        } if (dataComponent && item[1]['value'] > 3 && item[1]['value'] * 2 > dataComponent[1]['value'] && Math.abs(item[1]['time'] - dataComponent[1]['time']) < 400
            && dataComponent[1]['time'] > 400
            && componentStats['cost'] < 2000) {
            // console.log('final remove: ', item, components, component, dataComponent)
            removedComponents.push(componentKey)
            continue

        }
        if (componentStats['components'] && componentStats['cost'] < 900 && Math.abs(item[1]['time'] - dataComponent[1]['time']) < 300) {
            // console.log(component, componentStats)
            removedComponents.push(componentKey)
            continue
        }
        if (component === 'sange' || component === 'soul_booster') {
            removedComponents.push(componentKey)
        }
        if (!componentStats['hint'] && dataComponent[1]['time'] > 1200) {
            removedComponents.push(componentKey)
        }
        if (dataComponent[1]['time'] > 1800) {
            // console.log('time removal', component)
            removedComponents.push(componentKey)
        }

    }
    return removedComponents
}
export const allComponents = (itemKey: string, itemdata: Items): string[] => {
    const res: string[] = []
    const components = 'components' in itemdata['items'][itemKey] ? itemdata['items'][itemKey]['components'] : undefined
    if (!components) return res
    for (const component of components) {
        res.push(component)
        const componentStats = itemdata['items'][component]['components']
        if (componentStats) {
            for (const subComponent of componentStats) {
                res.push(subComponent)
            }
        }
    }
    return res
}
export const filterComponents = (data: any[], itemData: Items) => {
    // data is in the form of [string, {value ,time}]
    let toRemove: string[] = []
    // for (let k in itemData['items']) {
    //     if (!itemData['items'][k]['hint'] && itemData['items'][k]['cost'] && itemData['items'][k]['cost'] > 1000 && !k.includes('recipe')) {
    //         console.log(k, itemData['items'][k]['qual'])
    //         noHint.push(k)
    //     }
    // }
    // console.log(noHint)
    const itemdata: any = itemData
    const keys = data.map((x) => x[0])
    // console.log([...keys])
    const removedComponents: any = []
    const disassembleable = ['arcane_boots', 'echo_sabre', 'vanguard', 'mask_of_madness']
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const itemKey: string = item[0]
        // console.log(itemKey, keys)
        const itemTime: number = item[1]['time']
        const itemStats = itemdata['items'][itemKey.replace(/__\d+/g, '')]
        if (!itemStats) {
            continue
        } else if (itemTime > 1000 && itemStats['cost'] < 500) {
            toRemove.push(data[i][0])
            continue
        } else if (itemTime > 1000 && !itemStats['hint'] && ['common', 'component', 'secret_shop'].includes(itemStats['qual'])) {
            toRemove.push(data[i][0])
            continue
        }
        else if (itemTime > 1800 && itemStats['cost'] < 2000) {
            toRemove.push(data[i][0])
            console.log('remove low cost item after 30 mins: ', data[i][0])
            continue
        }
        if (itemStats && itemStats['components']) {
            const components: string[] = itemStats['components']
            toRemove = recursive_remove(item, itemData, components, data, keys, removedComponents)

            // disassemble components section
            if (components && item[1]['value'] > 10 && (disassembleable.includes(itemKey.replace(/__\d+/g, '')) || components.includes('kaya') || components.includes('sange'))) {
                disassembledComponents(components, data, i, itemdata, item, itemKey, keys)
            }

        }
    }
    const seenItems: string[] = []
    for (const item of toRemove) {
        if (seenItems.includes(item)) {
            // console.log(item)
        }
        const filteredKeys = keys.filter((x) => {
            return x.replace(/__\d+/g, '') === item
        })
        for (const k of filteredKeys) {
            const idx = keys.indexOf(k)
            if (idx !== -1) {
                data.splice(idx, 1)
                keys.splice(idx, 1)
                seenItems.push(item)
            }
        }
    }
    return data
}

export default filterComponents

export const disassembledComponents = (components: string[], data: any[], i: number, itemdata: any, itemObj: any, itemKey: string, keys: any[]) => {
    // check for future items that are missing the component
    // then add the disassembled components to data[1]
    for (const component of components) {
        // console.log(itemKey, component, components);
        const slicedData = [...data].slice(i + 1)
        console.log(slicedData)
        const itemUses = slicedData.filter((x, i) => {
            const parentComponents = allComponents(x[0].replace(/__\d+/g, ''), itemdata)
            // console.log(x[0], parentComponents)
            const core = x[1]['adjustedValue'] > 20 && itemObj[1]['adjustedValue'] > 20
            const situtational = x[1]['adjustedValue'] < 20 && itemObj[1]['adjustedValue'] < 20
            if (!core && !situtational) {
                return false
            }
            if (parentComponents && parentComponents.includes(component)) {
                const componentInParent = slicedData.filter((item, idx) => {
                    if (!('components' in itemdata['items'][item[0].replace(/__\d+/g, '')])) {
                        return false
                    }
                    const componentC = allComponents(item[0].replace(/__\d+/g, ''), itemdata)
                    const inParent = componentC.find((x) => parentComponents.includes(x))
                    // console.log()
                    return idx <= i && inParent
                }).map((x) => x[0])
                if (componentInParent.length && !componentInParent.includes(component) && x[1]['value'] > itemObj[1]['value'] / 1.5 && !parentComponents.includes(itemKey.replace(/__\d+/g, ''))) {
                    // console.log(item, parentComponents, x, componentInParent)
                    return true
                }
            }
        })
        itemUses.forEach((x) => {
            const idx = keys.findIndex((item) => item === x[0])
            const dissassembledComponents: string[] = allComponents(x[0].replace(/__\d+/g, ''), itemdata).filter((x: string) => components.includes(x))
            dissassembledComponents.unshift(itemKey)
            if (dissassembledComponents.length % 2 !== 0) {
                dissassembledComponents.pop()
            }
            if (dissassembledComponents.length > 1) {
                if (data[idx][1]['dissassembledComponents']) {
                    const itemIdx = data[idx][1]['dissassembledComponents'].findIndex((x: any) => dissassembledComponents.includes(x[0]))
                    if (itemIdx === -1) data[idx][1]['dissassembledComponents'].push(dissassembledComponents)
                } else {
                    data[idx][1]['dissassembledComponents'] = [dissassembledComponents]
                }
                data[i][1]['disassemble'] = true
            }
        })

    }
    return data
}
