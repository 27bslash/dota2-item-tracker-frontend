import { Grid } from '@mui/material';
import TableItem from './../../table/tableItem';
type Item = {
    [k: string]: { value: number, adjustedValue: number, time: number, disassemble?: boolean, dissassembledComponents?: string[], offset?: { left: number, top: number } }
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
    const sortedData = props.data.map((o: any) => ({ 'core': o['core'] })).concat(props.data.map((o: any) => ({ 'situational': o['situational'] })));
    const totalLen = props.data.map((x: any) => {
        const keys = ['core', 'situational']
        let currMax = 0
        for (let k of keys) {

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
    const totalLen = props.dataLength.reduce((a: number, b: number) => a + b)
    const calcOffset = () => {
        props.data.forEach((buildObject: any) => {
            if (buildObject[props.ObjectKey].length > 1) {
                let leftOffset = 0
                const badIdxs = []
                for (let [i, itemSet] of buildObject[props.ObjectKey][0].entries()) {
                    const keys = Object.keys(itemSet)
                    if (itemSet[keys[0]]['dissassembledComponents']) {
                        if (leftOffset === 0) {
                            leftOffset = (55 * itemSet[keys[0]]['dissassembledComponents'].length) || 0
                            // buildObject[props.ObjectKey][1].push({ 'offset': leftOffset })
                            // console.log(itemSet)
                        }
                    }
                    if (keys.length > 1) {
                        // console.log(buildObject[props.ObjectKey][0], i, itemSet)
                        badIdxs.push(i)
                    }
                    // console.log('left', leftOffset)
                }
                if (badIdxs.length) {
                    for (let [i, itemset] of buildObject[props.ObjectKey][1].entries()) {
                        // i = leftOffset
                        let moveCount = 0
                        const keys = Object.keys(itemset)
                        while (badIdxs.includes(i) && i <= 6 * 55) {
                            i += 1
                            moveCount += 1
                        }
                        badIdxs.push(i)
                        // console.log(itemset, itemset[keys[0]]['offset'], badIdxs, i, leftOffset)
                        itemset[keys[0]]['offset'] = { 'left': moveCount * 55, top: -82 }
                        // console.log(itemset)
                    }
                }
            }
        })
    }
    calcOffset()
    return (
        props.data.map((buildObject: any, i: number) => {
            let timing = i === 1 || i === 4 ? 'Mid' : (i === 2 || i === 5 ? 'Late' : 'Early')
            let maxWidth = 12 / (totalLen / props.dataLength[i])
            if (maxWidth > 6) maxWidth = 6
            const widthPerc = (maxWidth / 12) * 100
            const adjustedWidth = widthPerc - widthPerc / 100 * 15
            const l = buildObject[props.ObjectKey].map((x: any) => x).flat().length
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
        const key = Object.keys(x)[0]
        return x[key]['option']
    })
    return (
        <>
            {buildObject[ObjectKey][0].length !== 0 &&
                <>
                    <h3 className='build-header'>{`${timing} ${ObjectKey}`}</h3>
                    <div className={`${ObjectKey} flex`} style={{ flexDirection: 'column' }}>
                        {buildObject[ObjectKey].map((itemGroup: any[], i: number) => {
                            // console.log('items', i, items)
                            const centerOffset = itemGroup.length % 2 === 0 || i === 0 ? '0px' : '-51px'
                            const leftOffset = offset ? offset.left + 'px' : '0px'
                            const style = !odf ? { marginLeft: centerOffset, justifyContent: 'center' } : { marginLeft: leftOffset }
                            return (
                                <div key={i} className='flex' style={style}>
                                    {/* <div key={i} className='flex' style={{ justifyContent: 'center',marginLeft: leftOffset }}> */}
                                    {itemGroup.map((items: Item, j: number) => {
                                        const itemkey = Object.keys(items)
                                        const itemOffset = items[itemkey[0]]['offset'] || { top: '0px', left: '0px' }

                                        return (
                                            <div key={j} className="item-offset" style={{ marginTop: itemOffset['top'], marginLeft: itemOffset['left'] }}>
                                                <ItemBuildCell itemkey={itemkey} item={items} data={data} itemData={itemData} />
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
    const image_host = "https://ailhumfakp.cloudimg.io/v7/"
    // itemkey.sort((a: any, b: any) => {
    //     return item[b]['time'] - item[a]['time']
    // })
    // console.log(itemkey)
    return (
        <div className="img-cell" >
            {
                itemkey.map((k: string, idx: number) => {
                    const perc = item[k]['adjustedValue']
                    const avgTime = (Math.floor(item[k]['time'] / 60))
                    const link = `${image_host}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${k.replace(/__\d+/g, '')}.png`
                    const disassemble = item[k]['disassemble']
                    const components = item[k]['dissassembledComponents']
                    const orText = itemkey.length - 1 !== idx || item[k]['longOption'] ? 'or' : ''
                    k = k.replace(/__\d+/g, '')
                    return (
                        <div key={idx} className='itembuild-img-cell flex' style={{ alignItems: 'center', justifyContent: 'end' }} >
                            {components &&
                                <ItemComponents components={components} data={data} itemData={itemData} />
                            }
                            <div className="item-build-img">
                                <p style={{ margin: '0', color: 'white' }}>{avgTime}m {disassemble ? 'D' : ''}</p>
                                <TableItem type='item' height='40px' width='55px' itemKey={k.replace(/__\d+/g, '')} filteredData={data} totalMatchData={data}
                                    items={itemData} role='' overlay={false} />
                                {/* <p style={{ margin: '0', color: 'white' }}>{perc}%</p> */}
                                <p style={{ margin: '0', color: 'white' }}>{perc.toFixed(2).replace('100.00', '100')}%</p>
                                <p style={{ margin: 0, color: 'white' }}>{orText}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div >)
}
const ItemComponents = (props: { components: string[][]; data: object[]; itemData: any; }) => {
    const components = props.components.slice(0, 2)
    return (
        <div className='components' style={{ height: '300%', display: 'flex' }}>
            {components.map((componentArr, i) => (
                <div className="pair" style={{ display: 'grid' }} key={i}>
                    {componentArr.map((component, i) => {
                        return (
                            <div key={i} style={{ position: 'relative', }}>
                                {i % 2 === 0 &&
                                    <div className="disassemble-overlay"></div>
                                }
                                <TableItem height='20px' type='item' itemKey={component} filteredData={props.data} totalMatchData={props.data}
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