const recursive_remove = (item: any, itemdata: any, components: string[], data: any[], keys: any[], removedComponents: string[]): any => {
    const badQuals = ['component', 'common', 'consumable', 'secret_shop']
    for (let component of components) {
        const componentStats = itemdata['items'][component]
        const idx = keys.indexOf(component)

        const dataComponent = data[idx]
        if (!dataComponent || component === 'blink' || component === 'boots' || component === 'travel_boots' || component === 'ultimate_scepter') {
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
const filterComponents = (data: any[], itemData: any) => {
    let toRemove: string[] = []
    const gpm = 400
    const itemdata: any = itemData
    const keys = data.map((x) => x[0])
    // console.log([...keys])
    const removedComponents: any = []
    const disassembleable = ['arcane_boots', 'echo_sabre', 'octarine_core', 'vanguard', 'mask_of_madness']
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

export default filterComponents