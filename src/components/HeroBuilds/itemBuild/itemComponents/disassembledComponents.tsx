import Items from "../../../types/Item"
import { RawItemBuild } from "../itemFitltering/itemFiltering"
import { allComponents } from "./componentFilter"

export const disassembledComponents = (components: string[], data: RawItemBuild[], i: number, itemdata: Items, itemObj: RawItemBuild, itemKey: string, keys: string[]) => {
    // check for future items that are missing the component
    // then add the disassembled components to data[1]
    for (const component of components) {
        // console.log(itemKey, component, components);
        const slicedData = [...data].slice(i + 1)
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
            const disassembledComponents: string[] = allComponents(x[0].replace(/__\d+/g, ''), itemdata).filter((x: string) => components.includes(x))
            disassembledComponents.unshift(itemKey)
            if (disassembledComponents.length % 2 !== 0) {
                disassembledComponents.pop()
            }
            if (disassembledComponents.length > 1) {
                if (data[idx][1]['disassembledComponents']) {
                    const itemIdx = data[idx][1]['disassembledComponents']!.findIndex((x) => disassembledComponents.includes(x[0]))
                    if (itemIdx === -1) data[idx][1]['disassembledComponents']!.push(disassembledComponents)
                } else {
                    data[idx][1]['disassembledComponents'] = [disassembledComponents]
                }
                data[i][1]['disassemble'] = true
            }
        })

    }
    return data
}
