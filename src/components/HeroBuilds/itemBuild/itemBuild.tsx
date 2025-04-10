import { Grid } from '@mui/material';
import { GridRow } from './grid/gridRow';
import { HeroBuild } from '../buildHooks/buildHook';
// type Item = {
// 	[k: string]: { value: number, adjustedValue: number, time: number, disassemble?: boolean, dissassembledComponents?: string[], offset?: { left: number, top: number } }
// }
export type ItemBuildProps = {
    data: HeroBuild['item_builds']
}
const ItemBuild = ({ data }: ItemBuildProps) => {

    const totalLen = data.map((x) => {
        const keys = ['core', 'situational']
        let currMax = 0
        for (const k of keys) {
            if (x[k].map((y) => y).length > currMax) {
                currMax = x[k].length
            }
        }
        return currMax
    })
    return (
        <>

            <Grid container  >
                <Grid container >
                    <GridRow data={data.map((o) => ({ 'core': o['core'] }))} dataLength={totalLen} ObjectKey={'core'} />
                </Grid>
                <Grid container >
                    <GridRow data={data.map((o) => ({ 'situational': o['situational'] }))} dataLength={totalLen} ObjectKey={'situational'} />
                </Grid>
            </Grid>
        </>
    )
}




export default ItemBuild