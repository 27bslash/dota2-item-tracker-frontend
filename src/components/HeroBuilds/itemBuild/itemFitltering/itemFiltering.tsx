import { medianValue } from "../../../../utils/medianValue"
import { Items } from "../../../types/Item"
import { NonProDataType } from "../../build"
import filterComponents from "./componentFilter"
import groupByTime from "./groupBytime"
import { addItemChoices } from "./itemChoices"

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

export const countItems = (data: any) => {
    const consumables = [
        "tango",
        "flask",
        "branches",
        "blood_grenade",
        "ward_observer",
        "ward_sentry",
        "smoke_of_deceit",
        "enchanted_mango",
        "clarity",
        "tpscroll",
        "dust",
        "tome_of_knowledge",
        "gem",
        'faerie_fire',
        'great_famango',
        'famango',
        'dagon_2',
        'dagon_3',
        'dagon_4',
    ];
    // console.log(data)
    // console.log(data.map((x: any) => x['items']))
    // most common items try sorting them by time maybe that's good enough
    // otherwise bbuild by boots maybe?

    const items: any[] = []
    const seenItems = new Set<string>()
    for (const match of data) {
        const dupeCounter: string[] = []
        for (const [i, item] of match['items'].entries()) {
            if (consumables.includes(item['key'])) {
                continue
            }
            let key
            if (dupeCounter.includes(item['key']) && item['key'] !== 'aghanims_shard' && item['key'] !== 'ultimate_scepter') {
                const itemCount = match['items'].slice(0, i).filter((x: any) => x['key'] === item['key']).length
                key = `${item['key']}__${itemCount}`
                dupeCounter.push(`${item['key']}_${itemCount}`)
            } else {
                dupeCounter.push(item['key'])
                key = item['key']
            }
            const time = typeof (item['time']) === 'string' ? humanToUnix(item['time']) : item['time']
            if (time <= 0) continue
            // const idx = seenItems.filter((x) => x === key).length + 1
            // key = idx > 1 ? `${key}__${idx}` : key
            // key = key
            // const oKey = itemCount[item['key']]
            // console.log(key)
            items.push({ [key]: time })
            // itemCount[key] ? itemCount[key] = ({ value: oKey['value'] + 1, time: oKey['time'] + time })
            //     : itemCount[key] = { value: 1, time: time }

            seenItems.add(key)

        }
        // console.log(dupeCounter)

    }
    let itemValues: any = {}
    // console.log(seenItems)
    seenItems.forEach((x) => {
        const key = x
        const filteredItemTimes: any[] = items.filter((item) => Object.keys(item)[0] === key).map((item) => Object.values(item)[0])
        if (filteredItemTimes) {
            const medianTime = medianValue(filteredItemTimes)
            const avgTime = filteredItemTimes.reduce((a, b) => a + b) / filteredItemTimes.length
            const time = Math.min(medianTime, avgTime)
            if (!key.match(/__\d+/g) || (key.match(/__\d+/g) && avgTime <= 800)) {
                itemValues[key] = { value: filteredItemTimes.length, time: time }
            }
        }

        // itemValues[key] ? itemValues[key] = ({ value: oKey['value'] + 1, time: oKey['time'] + time })
        //     : itemValues[key] = { value: 1, time: time }
    })
    const map = Object.entries(itemValues).filter((item: any) => (item[1]['value'] / data.length) * 100 > 1).map((item: any) => {
        let count = 0
        const filteredData = data.filter((match: any) => {
            const lastTime = match['items'][match['items'].length - 1]['time']
            // console.log(match['items'], lastTime)
            const cleanedKey = item[0].replace(/__\d+/g, '')
            let dupeCount = 0
            const itemNum: string[] = item[0].match(/\d+/g)
            const inItems = match['items'].some((itemObj: any) => {
                if (itemNum && dupeCount !== +itemNum[0] + 1 && itemObj.key === cleanedKey) {
                    dupeCount++
                }
                if ((itemNum && dupeCount === +itemNum[0] + 1) || !itemNum) {
                    return itemObj.key === cleanedKey
                }
            })
            if (!inItems && lastTime - 300 > item[1]['time']
            ) {
                // only count items where they're brought atleast 5 mins before game ending
                count++
            } else if (inItems) {
                return true
            }

        })

        // console.log(item[0], item[1], avgTime, filteredData, count)
        // return [item[0], { value: (item[1]['value'] / data.length) * 100, 'time': avgTime }]
        return [item[0], {
            value: (item[1]['value'] / data.length) * 100,
            adjustedValue: (filteredData.length / (filteredData.length + count)) * 100, 'time': item[1]['time']
        }]
        // if (filteredData > 0)
        // return [item[0], { value: (item[1]['value'] / data.length) * 100, adjustedValue: `${filteredData} / `, 'time': avgTime }]

    }).filter((x) => x)
    itemValues = map.sort((a: any, b: any) => a[1]['time'] - b[1]['time'])
    return itemValues
}

export const boots_filter = (data: any[]) => {
    const boots = ['tranquil_boots', 'arcane_boots', 'power_treads', 'phase_boots']
    const bootsCount = data.filter((x) => {
        if (x[0].includes('boot') && x[0].match(/\d/g)) {
            return false
        }
        return boots.includes(x[0].replace(/__\d+/g, ''))
    }).length
    const filtered = data.filter((x) => {
        if (x[0].includes('boot') && x[0].match(/\d/g)) {
            return false
        }
        if (boots.includes(x[0].replace(/__\d+/g, ''))) {
            return +(100 / x[1]['value']).toFixed(0) < bootsCount || +(100 / x[1]['value']).toFixed(0) === 1
        } else {
            return true
        }
    })
    return filtered
}

const filterItems = (matchData: NonProDataType[], itemData: Items, roleKey: string) => {
    // const start = performance.now()
    let itemBuild = countItems(matchData)
    // const end = performance.now()
    itemBuild = filterComponents(itemBuild, itemData)
    itemBuild = boots_filter(itemBuild)
    itemBuild = addItemChoices(itemBuild, matchData, itemData)
    itemBuild = groupByTime(itemBuild, roleKey)
    // console.log('filterCompoentns:', performance.now() - start, 'ms')
    return itemBuild
}

export default filterItems