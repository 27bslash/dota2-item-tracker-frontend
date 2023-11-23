import { Grid } from "@mui/material";
import Items from "../../../types/Item";
import { ItemGroups } from './../itemGroups/itemGroups';
const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    let index = 0;
    while (index < array.length) {
        chunks.push(array.slice(index, index + size));
        index += size;
    }
    return chunks;
}
export const GridRow = (props: { data: any, ObjectKey: 'core' | 'situational', dataLength: number[] }) => {
    // console.log(props.data)
    // 18 6
    // 18
    props.data.map((buildObject: { [x: string]: any; }) => {
        if (buildObject[props.ObjectKey].length > 5) {
            // console.log('test', k)
            buildObject[props.ObjectKey] = chunkArray(buildObject[props.ObjectKey], 6)
            // console.log(buildObject[props.ObjectKey])
        } else {
            buildObject[props.ObjectKey] = [buildObject[props.ObjectKey]]
        }
    })
    const totalLen = props.dataLength.reduce((a: number, b: number) => a + b)
    const calcOffset = () => {
        props.data.forEach((buildObject: any) => {
            let leftOffset = 0
            const badIdxs = []
            if (buildObject[props.ObjectKey].length > 1) {
                for (const itemSet of buildObject[props.ObjectKey]) {
                    for (const [i, item] of itemSet.entries()) {
                        if (item['dissassembledComponents']) {
                            if (leftOffset === 0) {
                                leftOffset = (55 * item['dissassembledComponents'].length) || 0
                                // buildObject[props.ObjectKey][1].push({ 'offset': leftOffset })
                                // console.log(item)
                            }
                        }
                        if (item['option']) {
                            // console.log(buildObject[props.ObjectKey][0], i, itemSet)
                            badIdxs.push(i)
                        }
                    }
                    // console.log('left', leftOffset)
                }
                if (badIdxs.length) {
                    for (let [i, itemset] of buildObject[props.ObjectKey][1].entries()) {
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
        props.data.map((buildObject: any, i: number) => {
            const timing = i === 1 || i === 4 ? 'Mid' : (i === 2 || i === 5 ? 'Late' : 'Early')
            let maxWidth = 12 / (totalLen / props.dataLength[i])
            if (maxWidth > 6) maxWidth = 6
            const widthPerc = (maxWidth / 12) * 100
            const adjustedWidth = widthPerc - widthPerc / 100 * 15
            // const l = buildObject[props.ObjectKey].map((x: any) => x).flat().length
            // console.log(l)
            // console.log(buildObject)

            return (
                <Grid key={i} item md={4} sm={maxWidth} sx={{ textAlign: 'center', maxWidth: adjustedWidth }}>
                    <ItemGroups buildObject={buildObject} timing={timing} ObjectKey={props.ObjectKey} />
                </Grid >
            )
        })
    )
}