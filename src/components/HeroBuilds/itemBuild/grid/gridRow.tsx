import { Grid } from "@mui/material";
import { ItemGroups } from './../itemGroups/itemGroups';
import { ItemBuildProps } from "../itemBuild";
import { CoreItem } from "../itemGroups/groupBytime";
const chunkArray = (array: CoreItem[], size: number) => {
    const chunks = [];
    let index = 0;
    while (index < array.length) {
        chunks.push(array.slice(index, index + size));
        index += size;
    }
    return chunks;
}
type GridRowProps = {
    data: ItemBuildProps['data'],
    ObjectKey: 'core' | 'situational',
    dataLength: number[]
}

export const GridRow = ({ data, ObjectKey, dataLength }: GridRowProps) => {
    // console.log(data)
    // 18 6
    // 18
    const newData = data.map((buildObject) => {
        const updatedBuildObject: Record<string, CoreItem[][]> = {}; // Create a copy of the object
        if (buildObject[ObjectKey].length > 5) {
            // console.log('test', k)
            updatedBuildObject[ObjectKey] = chunkArray(buildObject[ObjectKey], 6)
            // console.log(buildObject[ObjectKey])
        } else {
            updatedBuildObject[ObjectKey] = [buildObject[ObjectKey]]
        }
        return updatedBuildObject;
    })
    const totalLen = dataLength.reduce((a: number, b: number) => a + b)
    const calcOffset = () => {
        newData.forEach((buildObject) => {
            let leftOffset = 0
            const badIdxs = []
            if (buildObject[ObjectKey].length > 1) {
                for (const itemSet of buildObject[ObjectKey]) {
                    for (const [i, item] of itemSet.entries()) {
                        if (item['disassembledComponents']) {
                            if (leftOffset === 0) {
                                leftOffset = (55 * item['disassembledComponents'].length) || 0
                                // buildObject[ObjectKey][1].push({ 'offset': leftOffset })
                                // console.log(item)
                            }
                        }
                        if (item['option']) {
                            // console.log(buildObject[ObjectKey][0], i, itemSet)
                            badIdxs.push(i)
                        }
                    }
                    // console.log('left', leftOffset)
                }
                if (badIdxs.length) {
                    for (let [i, itemset] of buildObject[ObjectKey][1].entries()) {
                        // i = leftOffset
                        let moveCount = 0
                        // const keys = Object.keys(itemset)
                        while (badIdxs.includes(i)) {
                            i += 1
                            moveCount += 1
                        }
                        badIdxs.push(i + moveCount)
                        // if (looped) moveCount = 0
                        // console.log(itemset, itemset[keys[0]]['offset'], badIdxs, i, leftOffset)
                        itemset['offset'] = { 'left': moveCount * 55, top: -82 }
                        // console.log(itemset)
                    }
                }
            }
        })
    }
    calcOffset()
    return (
        <>
            {newData.map((buildObject, i: number) => {
                const timing = i === 1 || i === 4 ? 'Mid' : (i === 2 || i === 5 ? 'Late' : 'Early')
                let maxWidth = 12 / (totalLen / dataLength[i])
                if (maxWidth > 6) maxWidth = 6
                const widthPerc = (maxWidth / 12) * 100
                const adjustedWidth = widthPerc - widthPerc / 100 * 15
                // const l = buildObject[ObjectKey].map((x: any) => x).flat().length
                // console.log(l)
                // console.log(buildObject)

                return (
                    <Grid key={i} item md={4} sm={maxWidth} sx={{ textAlign: 'center', maxWidth: adjustedWidth }}>
                        <ItemGroups buildObject={buildObject} timing={timing} ObjectKey={ObjectKey} />
                    </Grid >
                )
            })}
        </>
    )
}