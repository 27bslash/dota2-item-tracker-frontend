import filterComponents from "./componentFilter"
import groupByTime from "./groupBytime"

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
        'faerie_fire',
        'great_famango',
        'famango'
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

const filterItems = (data: any, itemData: any) => {
    data = countItems(data, itemData)
    data = filterComponents(data, itemData)
    data = boots_filter(data, itemData)
    data = groupByTime(data, itemData, data)
    return data
}
export default filterItems