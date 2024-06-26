import { Items } from '../../../types/Item'
import { NonProDataType } from '../../types'
export type NeutralItemsStats = {
    [key: string]: {
        key: string
        count: number
        tier: number
        perc: number
    }[]
}
export const mostUsedNeutrals = (
    matchData: NonProDataType[],
    itemData: Items,
) => {
    const tierCountArr: Record<
        string,
        { count: number; tier: number; perc: number }
    >[] = []
    // iterate over all neutral item tiers
    for (let i = 1; i < 6; i++) {
        const count: Record<
            string,
            { count: number; tier: number; perc: number }
        > = {}
        const totalGameOfTier = matchData.filter(
            (match: { item_neutral?: string }) => {
                if (match['item_neutral']) {
                    const neutralItemStats =
                        itemData['items'][match['item_neutral']]
                    const neutralTier = neutralItemStats
                        ? neutralItemStats['tier']
                        : -1
                    return neutralTier === i
                }
            }
        ).length
        for (const match of matchData) {
            if (match['item_neutral']) {
                const neutralItemStats =
                    itemData['items'][match['item_neutral']]
                const neutralTier = neutralItemStats
                    ? neutralItemStats['tier']
                    : -1
                if (neutralTier === i) {
                    if (count[match['item_neutral']]) {
                        const itemCount =
                            count[match['item_neutral']]['count'] + 1
                        count[match['item_neutral']] = {
                            count: itemCount,
                            tier: neutralTier,
                            perc: (itemCount / totalGameOfTier) * 100,
                        }
                    } else {
                        count[match['item_neutral']] = {
                            count: 1,
                            tier: neutralTier,
                            perc: (1 / totalGameOfTier) * 100,
                        }
                    }
                }
                // if (count[match['item_neutral']]) {
                //     count[match['item_neutral']] = { 'count': count[match['item_neutral']]['count'] + 1, 'tier': neutralTier }
                // }
            }
        }
        tierCountArr.push(count)
    }
    console.log('all neutrals: ', tierCountArr)
    const ret: NeutralItemsStats = {}
    // const ret = []
    for (const [i, tierArr] of tierCountArr.entries()) {
        const sorted = Object.entries(tierArr)
            .sort((a, b) => {
                return b[1]['count'] - a[1]['count']
            })
            .slice(0, 4)
            .map((x) => ({
                key: x[0],
                count: x[1]['count'],
                perc: x[1]['perc'],
                tier: x[1]['tier'],
            }))
        // console.log('sorted neutral items: ', sorted)
        // ret.push({ [`tier_${i}`]: sorted})
        ret[`tier_${i}`] = sorted
    }
    return ret
    // const countArr = Object.values(count)
    // console.log(count)
    // for (let neutralCount in count) {
    //     console.log(neutralCount)
    // }
}
