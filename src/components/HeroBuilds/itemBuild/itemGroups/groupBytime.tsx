import {
    RawItemBuild,
    RawItemBuildValues,
} from '../itemFitltering/itemFiltering'
import { disassembledComponents } from './../itemComponents/disassembledComponents'
import groupByItemChoices from './groupByItemChoices'
import { groupDisassembledComponents } from './groupDisassembled'

export interface CoreItem extends RawItemBuildValues {
    key?: string
}
export type GroupedCoreItems = {
    [key: string]: CoreItem[]
}
const groupByTime = (data: RawItemBuild[], roleKey: string) => {
    const itemObj: GroupedCoreItems = { core: [], situational: [] }
    const res = [
        structuredClone(itemObj),
        structuredClone(itemObj),
        structuredClone(itemObj),
    ]
    const seenItems = new Set<string>()
    const filteredData = data.filter(
        (x: RawItemBuild) => x[1]['adjustedValue'] > 10
    )
    const groupByPercUsed = (time: number, type: string) => {
        const ret: CoreItem[] = []
        const supportRoles = ['Hard Support', 'Support', 'Roaming']
        let percForCore =
            time <= 1000 && !supportRoles.includes(roleKey)
                ? 60
                : time <= 1800
                ? 50
                : 40
        if (supportRoles.includes(roleKey) && time <= 1800) {
            percForCore = 35
        } else if (supportRoles.includes(roleKey)) {
            percForCore = 20
        }
        data.filter((entry) => {
            const key = entry[0]
            const value = entry[1]
            if (value['time'] >= time || seenItems.has(key)) return false

            const adjustedValue = value['adjustedValue']
            const isCoreCondition =
                type === 'core' && adjustedValue > percForCore
            const isSituationalCondition =
                type !== 'core' &&
                adjustedValue < percForCore &&
                adjustedValue > 15
            if (isSituationalCondition && key === 'javelin') {
                return false
            }
            if (isCoreCondition || isSituationalCondition) {
                seenItems.add(key)
                const coreItem: CoreItem = {
                    ...value,
                    key: key,
                }
                ret.push(coreItem)
                return true
            }
            return false
        })

        return ret
    }
    const earlyCore = groupByPercUsed(700, 'core')
    const earlySituational = groupByPercUsed(700, 'situational')
    const midCore = groupByPercUsed(1800, 'core')
    const midSituational = groupByPercUsed(1800, 'situational')
    const lateCore = groupByPercUsed(999999, 'core')
    const lateSituational = groupByPercUsed(999999, 'situational')

    addWardsToMidlane(roleKey, earlyCore)
    if (earlyCore.length) res[0]['core'] = earlyCore
    if (midCore.length) res[1]['core'] = midCore
    if (lateCore.length) res[2]['core'] = lateCore
    if (earlySituational.length) res[0]['situational'] = earlySituational
    if (midSituational.length) res[1]['situational'] = midSituational
    if (lateSituational.length) res[2]['situational'] = lateSituational
    groupDisassembledComponents(filteredData)
    groupByItemChoices(res)
    console.log('item build: ', res)
    return res
}
export default groupByTime

function addWardsToMidlane(roleKey: string, earlyCore: CoreItem[]) {
    if (roleKey != 'Midlane') return
    const ob_ob = {
        value: 95.90163934426229,
        adjustedValue: 99.1701244813278,
        time: 360,
        key: 'ward_observer',
    }
    const sen_ob = {
        value: 60.90163934426229,
        adjustedValue: 60.1701244813278,
        time: 361,
        key: 'ward_sentry',
    }
    earlyCore.push(ob_ob)
    earlyCore.push(sen_ob)
    earlyCore.sort((a, b) => a['time'] - b['time'])
}
