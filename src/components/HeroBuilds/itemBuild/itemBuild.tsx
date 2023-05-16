import { Grid } from '@mui/material';
import TableItem from './../../table/tableItem';
type Item = {
    [k: string]: { value: number, adjustedValue: number, time: number, disassemble?: boolean, dissassembledComponents?: string[] }
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

    return (
        <>
            <Grid container className="item-build" sx={{ maxWidth: '1100px' }}>
                {sortedData.map((buildObject: any, i: number) => {
                    let timing = i === 1 || i === 4 ? 'Mid' : (i === 2 || i === 5 ? 'Late' : 'Early')
                    return (
                        <>
                            {i < 3 ? (
                                <Grid item md={4} sx={{ textAlign: 'center' }}>
                                    <ItemBuilds buildObject={buildObject} timing={timing} data={sortedData} itemData={props.itemData} ObjectKey='core' />
                                </Grid>
                            ) : (
                                <Grid item md={4} style={{ textAlign: 'center' }}>
                                    <ItemBuilds buildObject={buildObject} timing={timing} data={sortedData} itemData={props.itemData} ObjectKey='situational' />
                                </Grid>
                            )}
                        </>
                    )
                })}
            </Grid>
        </>
    )
}
const ItemBuilds = (props: { buildObject: any; timing: any; data: any; itemData: any, ObjectKey: string }) => {
    const { buildObject, data, itemData, timing, ObjectKey } = props
    return (
        <>
            {buildObject[ObjectKey].length !== 0 &&
                <>
                    <h3 className='build-header'>{`${timing} ${ObjectKey}`}</h3>
                    <div className="core flex" style={{ justifyContent: 'center' }}>
                        {buildObject[ObjectKey].map((items: Item[], i: number) => {
                            // console.log('items', i, items)
                            const itemkey = Object.keys(items)
                            return (
                                <ItemBuildCell key={i} itemkey={itemkey} item={items} data={data} itemData={itemData} />
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
    itemkey.sort((a: any, b: any) => {
        return item[b]['value'] - item[a]['value']
    })
    return (
        <div className="img-cell" >
            {
                itemkey.map((k: string, idx: number) => {
                    const perc = item[k]['adjustedValue']
                    const avgTime = (Math.floor(item[k]['time'] / 60))
                    const link = `${image_host}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${k}.png`
                    const disassemble = item[k]['disassemble']
                    const components = item[k]['dissassembledComponents']
                    const orText = itemkey.length - 1 !== idx ? 'or' : ''
                    k = k.replace(/__\d+/g, '')
                    return (
                        <div key={idx} className='itembuild-img-cell flex' style={{ alignItems: 'center', justifyContent: 'end' }} >
                            {components &&
                                <ItemComponents components={components} data={data} itemData={itemData} />
                            }
                            <div className="item-build-img">
                                <p style={{ margin: '0', color: 'white' }}>{avgTime}m {disassemble ? 'D' : ''}</p>
                                <TableItem type='item' height='40px' itemKey={k} filteredData={data} totalMatchData={data}
                                    items={itemData} role='' overlay={false} />
                                {/* <p style={{ margin: '0', color: 'white' }}>{perc}%</p> */}
                                <p style={{ margin: '0', color: 'white' }}>{perc.toFixed(2)}%</p>
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