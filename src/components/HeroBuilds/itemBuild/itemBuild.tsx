import { Grid, Typography } from '@mui/material';
import TableItem from './../../table/tableItem';
import { cleanDecimal } from '../../../utils/cleanDecimal';
import { NonProDataType } from '../build';
import Items from '../../types/Item';
// type Item = {
// 	[k: string]: { value: number, adjustedValue: number, time: number, disassemble?: boolean, dissassembledComponents?: string[], offset?: { left: number, top: number } }
// }
const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    let index = 0;
    while (index < array.length) {
        chunks.push(array.slice(index, index + size));
        index += size;
    }
    return chunks;
}
const ItemBuild = (props: any) => {
    // const data = useMemo(() => filterItems(props.data, props.itemData), [props.data])
    // console.log(data)
    // const dataKeys = data.flat().map((itemArr: any) => {
    //     const k = Object.keys(itemArr)[0]
    //     return itemArr[k]
    // }).flat().map((x: any) => {
    //     return Object.keys(x)
    // }).flat()
    // const itemCount = useMemo(() => countItems(props.data, props.itemData), [props.data])
    // const filteredItems = itemCount.filter((match: any) => {
    //     const keys = Object.keys(dataKeys)
    //     return !dataKeys.includes(match[0])
    // })
    // console.log(filteredItems, dataKeys.length)
    const totalLen = props.data.map((x: any) => {
        const keys = ['core', 'situational']
        let currMax = 0
        for (const k of keys) {

            if (x[k].map((y: any) => y).length > currMax) {
                currMax = x[k].length
            } else {
                x[k]['currMax'] = currMax
            }
        }
        return currMax
        // return x['core'].map((y: any) => y)
    }
    )
    return (
        <>

            <Grid container  >
                <Grid container >
                    <GridRow data={props.data.map((o: any) => ({ 'core': o['core'] }))} dataLength={totalLen} itemData={props.itemData} ObjectKey={'core'} />
                </Grid>
                <Grid container >
                    <GridRow data={props.data.map((o: any) => ({ 'situational': o['situational'] }))} dataLength={totalLen} itemData={props.itemData} ObjectKey={'situational'} />
                </Grid>
                {/* {props.data.map((o: any) => ({ 'core': o['core'] })).map((buildObject: any, i: number) => {

                {props.data.map((o: any) => ({ 'situational': o['situational'] })).map((buildObject: any, i: number) => {
                    let timing = i === 1 || i === 4 ? 'Mid' : (i === 2 || i === 5 ? 'Late' : 'Early')
                    return (
                        <Grid container item key={i}>
                            <Grid key={i} item md={3.7} sx={{ textAlign: 'center' }}>
                                <ItemBuilds buildObject={buildObject} timing={timing} data={props.data} itemData={props.itemData} ObjectKey={'situational'} />
                            </Grid>
                        </Grid>

                    )
                })} */}
            </Grid>
        </>
    )
}

const GridRow = (props: { data: any, itemData: any, ObjectKey: 'core' | 'situational', dataLength: number[] }) => {
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
                    <ItemBuilds buildObject={buildObject} timing={timing} data={props.data} itemData={props.itemData} ObjectKey={props.ObjectKey} />
                </Grid >
            )
        })
    )
}
const ItemBuilds = (props: { buildObject: any; timing: any; data: any; itemData: any, offset?: { left: number, top: number }, ObjectKey: 'core' | 'situational' }) => {
    const { buildObject, data, itemData, offset, timing, ObjectKey } = props
    const odf = buildObject[ObjectKey].flat().some((x: any) => {
        // const key = Object.keys(x)[0]
        return x['option']
    })
    const optionMargin = () => {
        const len = buildObject[ObjectKey][0].length >= 6 ? 6 : buildObject[ObjectKey][0].length
        return odf ? (7 - len) * 5 * 6 : 0
    }
    const disassembleMargin = () => {
        let ret = 0
        buildObject[ObjectKey][0].forEach((x: any) => {
            // const key = Object.keys(x)[0]
            if (x['dissassembledComponents']) {
                // console.log(x)
                ret += x['dissassembledComponents'].length
            }
            // console.log(ret)
        })
        return ret
    }
    // console.log(disassembleMargin())

    return (
        <>
            {buildObject[ObjectKey] && buildObject[ObjectKey].length !== 0 &&
                <>
                    <Typography variant={'h6'} className='build-header'>{`${timing} ${ObjectKey}`}</Typography>
                    <div className={`${ObjectKey} flex`} style={{ flexDirection: 'column', marginLeft: `${optionMargin()}px` }}>
                        {buildObject[ObjectKey].map((itemGroup: any, i: number) => {
                            const centerOffset = itemGroup.length % 2 === 0 || i === 0 ? 0 : -54
                            const leftOffset = offset ? offset.left + 'px' : '0px'
                            const underMarginLeft = i === 1 && disassembleMargin() ? disassembleMargin() * 27 : centerOffset
                            const style = !odf ? { marginLeft: underMarginLeft + 'px', justifyContent: 'center' } : { marginLeft: leftOffset }
                            return (
                                <div key={i} className='flex' style={style}>
                                    {itemGroup.map((group: any, j: number) => {
                                        const itemkey = group['key']
                                        const itemOffset = group['offset'] || { top: '0px', left: '0px' }
                                        return (
                                            <div key={j} className="item-offset" style={{ marginTop: itemOffset['top'], marginLeft: itemOffset['left'] }}>
                                                <ItemBuildCell itemkey={itemkey} item={group} data={data} itemData={itemData} />
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })
                        }
                    </div>
                </>
            }
        </>
    )
}
const ItemBuildCell = (props: { itemkey: any; item: any; data: any; itemData: any; }) => {
    const { itemkey, item, data, itemData } = props
    // itemkey.sort((a: any, b: any) => {
    //     return item[b]['time'] - item[a]['time']
    // })
    const perc = item['adjustedValue']
    const avgTime = (Math.floor(item['time'] / 60))
    const disassemble = item['disassemble']
    const components = item['dissassembledComponents']
    const orText = item['option'] || item['longOption'] ? 'or' : ''
    return (
        <div className="img-cell" >

            <div className='itembuild-img-cell flex' style={{ alignItems: 'center', justifyContent: 'end' }} >
                {components &&
                    <ItemComponents components={components} data={data} itemData={itemData} />
                }
                <div>
                    <ItemBuildImage k={itemkey} orText={orText} avgTime={avgTime} itemData={itemData} perc={perc} data={data}
                        disassemble={disassemble}></ItemBuildImage>
                    {item['option'] &&
                        <ItemBuildImage k={item['option'][0]['choice']} avgTime={Math.floor(item['option'][0]['time'] / 60)} itemData={itemData} perc={item['option'][0]['targetValue']} data={data}
                            disassemble={disassemble}></ItemBuildImage>
                    }
                </div>
            </div>
        </div >)
}
export const ItemBuildImage = (props: { k: string, avgTime?: number, disassemble?: any; data: NonProDataType[]; itemData: Items; perc: string | number; orText?: string, }) => {
    return < div className="item-build-img">
        {props.avgTime &&
            <p style={{ margin: '0', color: 'white' }}>{props.avgTime}m {props.disassemble ? 'D' : ''}</p>
        }
        <TableItem type='item' height='40px' width='55px' itemKey={props.k.replace(/__\d+/g, '')} totalMatchData={props.data}
            items={props.itemData} role='' overlay={false} />
        {/* <p style={{ margin: '0', color: 'white' }}>{perc}%</p> */}
        <p style={{ margin: '0', color: 'white', textAlign: 'center' }}>{cleanDecimal(props.perc)}%</p>
        <p style={{ margin: 0, color: 'white' }}>{props.orText}</p>
    </div>;
}
const ItemComponents = (props: { components: string[][]; data: any[]; itemData: any; }) => {
    const components = props.components.slice(0, 2)
    return (
        <div className='components' style={{ height: '300%', display: 'flex' }}>
            {components.map((componentArr, i) => (
                <div className="pair" style={{ display: 'grid' }} key={i}>
                    {componentArr.map((component, i) => {
                        component = component.replace(/__\d+/g, '')
                        return (
                            <div key={i} style={{ position: 'relative', }}>
                                {i % 2 === 0 &&
                                    <div className="disassemble-overlay"></div>
                                }
                                <TableItem height='20px' type='item' itemKey={component} totalMatchData={props.data}
                                    items={props.itemData} role='' overlay={false} />
                            </div>
                        )
                    })
                    }
                </div>
            ))
            }
        </div>
    )
}

export default ItemBuild