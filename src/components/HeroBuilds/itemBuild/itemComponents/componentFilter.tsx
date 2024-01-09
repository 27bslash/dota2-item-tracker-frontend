import { Items } from "../../../types/Item"
import { RawItemBuild } from "../itemFitltering/itemFiltering"
import { disassembledComponents } from "./disassembledComponents"

export const recursive_remove = (item: RawItemBuild, itemdata: Items, components: string[], data: RawItemBuild[], keys: string[], removedComponents: string[]) => {
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
        if (badQuals.includes(componentStats['qual']!) && !componentStats['components']) {
            // console.log(component, dataComponent[1]['time'] / componentStats['cost']! * 300)
            if ((!componentStats['hint'] || !componentStats['attrib']!.length) && dataComponent[1]['time'] > 600) {
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
        } else if (badQuals.includes(componentStats['qual']!) && componentStats['components']) {
            if (!componentStats['hint'] && dataComponent[1]['time'] > 1500) {
                removedComponents.push(componentKey)
                continue
            }
        }
        if (dataComponent && componentStats['cost']! < 1500 && dataComponent[1]['time'] > 700 && item[1]['value'] * 2 > dataComponent[1]['value']) {
            // console.log('cost remove: ', component, componentStats['components'], componentStats)
            removedComponents.push(componentKey)
            if (componentStats['components']) {
                // return recursive_remove(itemdata, componentStats['components'], data, keys, removedComponents)
            }
            continue

        } if (dataComponent && item[1]['value'] > 3 && item[1]['value'] * 2 > dataComponent[1]['value'] && Math.abs(item[1]['time'] - dataComponent[1]['time']) < 400
            && dataComponent[1]['time'] > 400
            && componentStats['cost']! < 2000) {
            // console.log('final remove: ', item, components, component, dataComponent)
            removedComponents.push(componentKey)
            continue

        }
        if (componentStats['components'] && componentStats['cost']! < 900 && Math.abs(item[1]['time'] - dataComponent[1]['time']) < 300) {
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
        const componentStats = itemdata['items'][component]
        if (componentStats && componentStats['components']) {
            for (const subComponent of componentStats['components']) {
                res.push(subComponent)
            }
        }
    }
    return res
}
export const filterComponents = (data: RawItemBuild[], itemData: Items) => {
    // data is in the form of [string, {value ,time}]
    const toRemove = new Set<string>()
    // for (let k in itemData['items']) {
    //     if (!itemData['items'][k]['hint'] && itemData['items'][k]['cost'] && itemData['items'][k]['cost'] > 1000 && !k.includes('recipe')) {
    //         console.log(k, itemData['items'][k]['qual'])
    //         noHint.push(k)
    //     }
    // }
    // console.log(noHint)
    const keys = data.map((x) => x[0])
    // console.log([...keys])
    const removedComponents: string[] = []
    const disassembleable = ['echo_sabre', 'vanguard', 'mask_of_madness']
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const itemKey: string = item[0]
        // console.log(itemKey, keys)
        const itemTime: number = item[1]['time']
        const itemStats = itemData['items'][itemKey.replace(/__\d+/g, '')]
        if (!itemStats) {
            continue
        } else if (itemTime > 1000 && itemStats['cost']! < 500) {
            toRemove.add(data[i][0])
            continue
        } else if (!itemStats['hint'] && ['common', 'component', 'secret_shop'].includes(itemStats['qual']!)) {
            // console.log(itemKey)
            toRemove.add(data[i][0])
            continue
        }
        else if (itemTime > 1800 && itemStats['cost']! < 2000) {
            toRemove.add(data[i][0])
            console.log('remove low cost item after 30 mins: ', data[i][0])
            continue
        }
        if (toRemove.has(itemKey)) continue
        if (itemStats && itemStats['components']) {
            const components: string[] = itemStats['components']
            const removedComps = recursive_remove(item, itemData, components, data, keys, removedComponents)
            removedComps.forEach(c => toRemove.add(c))
            // disassemble components section
            if (components && item[1]['value'] > 10 && (disassembleable.includes(itemKey.replace(/__\d+/g, '')) || components.includes('kaya') || components.includes('sange'))) {
                disassembledComponents(components, data, i, itemData, item, itemKey, keys)
            }

        }
    }
    const seenItems: string[] = []
    console.log('remove', toRemove)
    for (const item of toRemove) {
        if (seenItems.includes(item)) {
            // console.log(item)
            continue
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

