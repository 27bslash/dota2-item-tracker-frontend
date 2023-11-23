import { Grid } from '@mui/material';
import { GridRow } from './grid/gridRow';
// type Item = {
// 	[k: string]: { value: number, adjustedValue: number, time: number, disassemble?: boolean, dissassembledComponents?: string[], offset?: { left: number, top: number } }
// }
type ItemBuildProps = ''
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
                    <GridRow data={props.data.map((o: any) => ({ 'core': o['core'] }))} dataLength={totalLen} ObjectKey={'core'} />
                </Grid>
                <Grid container >
                    <GridRow data={props.data.map((o: any) => ({ 'situational': o['situational'] }))} dataLength={totalLen} ObjectKey={'situational'} />
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




export default ItemBuild