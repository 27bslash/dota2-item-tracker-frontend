import { exists } from "../../../../utils/exists"
import { NonProDataType } from "../../build"

const countStartingItems = (data: NonProDataType[]) => {
    const wards = [
        "ward_observer",
        "ward_sentry",
        "smoke_of_deceit"
    ]

    let itemCount: any = {}
    const comboCount: { [key: string]: number } = {}
    for (let match of data) {
        const key = match['starting_items'].filter((x: { key: string }) => {
            if (!wards.includes(x['key']))
                return x['key']
        }).map((x: { key: string }) => x.key).sort().join('__')
        if (key.includes('tango')) {
            // console.log('key', key)
            comboCount[key] = (comboCount[key] + 1) || 1
        }
    }
    if (!Object.keys(comboCount).length) {
        const test = data
            .map(match => {
                const items = match['starting_items']
                    .map(item => item['key'])
                    .sort();
                return items.join('__');
            });
        for (let x of test) {
            comboCount[x] = (comboCount[x] + 1) || 1
        }
    }
    const count = Object.entries(comboCount).sort((a: any, b: any) => b[1] - a[1]).slice(0, 2)
    return count
}
export default countStartingItems