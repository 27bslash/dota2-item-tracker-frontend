const countStartingItems = (data: any) => {
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
        const amounts: any = {}
        // for (let item of match['starting_items']) {
        //     const charges = item['charges'] || 1
        //     amounts[item['key']] = (amounts[item['key']] + charges) || 1;
        // }
        // // console.log(match['id'], amounts, match['starting_items'])
        // for (let item of match['starting_items']) {
        //     const k = `${item['key']}_${amounts[item['key']]}`
        //     itemCount[k] = (itemCount[k] + 1) || 1;
        // }
    }
    const count = Object.entries(comboCount).sort((a: any, b: any) => b[1] - a[1]).slice(0, 2)
    return count
}
export default countStartingItems