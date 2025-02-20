import { NonProDataType } from '../../types'

const countStartingItems = (
    data: NonProDataType[],
) => {

    const comboCount: { [key: string]: number } = {}
    for (const match of data) {
        const key = match['starting_items']
            // .filter((x: { key: string }) => {
            //     if (!wards.includes(x['key'])) return x['key']
            // })
            .map((x: { key: string }) => x.key)
            .sort()
            .join('__')
        // console.log('key', key)
        comboCount[key] = comboCount[key] + 1 || 1
    }
    if (!Object.keys(comboCount).length) {
        const test = data.map((match) => {
            const items = match['starting_items']
                .map((item) => item['key'])
                .sort()
            return items.join('__')
        })
        for (const x of test) {
            comboCount[x] = comboCount[x] + 1 || 1
        }
    }
    const count = Object.entries(comboCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
    return count
}
export default countStartingItems
