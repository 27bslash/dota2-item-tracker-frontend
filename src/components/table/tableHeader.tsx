import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { useEffect, useState } from 'react';


const OrderableCell = (props: any) => {
    const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
        props.onRequestSort(event, property);
    };
    return (
        <TableCell align={props.align} sx={{ maxWidth: props.maxWidth }}>
            <TableSortLabel sx={{ color: `${props.color} !important`, textTransform: 'uppercase', fontWeight: '600', ":hover": { opacity: `0.8 !important` }, maxWidth: props.maxWidth }}
                direction={props.orderBy === props.sort ? props.order : 'desc'}
                onClick={() => props.onRequestSort(props.sort)} hideSortIcon>
                {props.label}
            </TableSortLabel>
        </TableCell>
    )
}
interface TableHeaderProps {
    onRequestSort: Function,
    orderBy: string,
    sortDirection: string,
    showStarter: boolean

}
const TableHeader = (props: TableHeaderProps) => {
    const [header, setHeader] = useState<any>([])
    const commonProps = {
        onRequestSort: props.onRequestSort, orderBy: props.orderBy, order: props.sortDirection
    }
    useEffect(() => {
        let head =
            <TableHead >
                <TableRow >
                    <OrderableCell label='' sort='win'{...commonProps} maxWidth='0px' />
                    <TableCell padding="normal" sx={{ textAlign: "center", color: 'white', fontWeight: '600' }}>
                        <TableSortLabel hideSortIcon sx={{ color: 'white !important' }}>
                            ITEMS
                        </TableSortLabel>
                    </TableCell>
                    <OrderableCell label='Played' sort='unix_time'{...commonProps} color='white' />
                    <OrderableCell sx={{ minWidth: '30px' }} label='Player' sort='name'{...commonProps} color='white' />
                    <TableCell sx={{ minWidth: '20px' }}>
                        {/* copy match -id */}
                    </TableCell>
                    <TableCell align='left' sx={{ color: 'white', fontWeight: '600', }}>
                        <TableSortLabel hideSortIcon sx={{ color: 'white !important' }} >
                            ROLE
                        </TableSortLabel>
                    </TableCell>
                    {!props.showStarter ? (
                        <>
                            <OrderableCell label='LVL' sort='lvl'{...commonProps} color='white' />
                            <OrderableCell label='K' sort='kills'{...commonProps} color='green' />
                            <OrderableCell label='D' sort='deaths'{...commonProps} color='red' />
                            <OrderableCell label='A' sort='assists'{...commonProps} color='gray' />
                            <OrderableCell label='CS' sort='last_hits'{...commonProps} color='white' />
                            <OrderableCell label='NET' color='gold' sort='gold'{...commonProps} />
                            <OrderableCell label='GPM' align='right' sort='gpm'{...commonProps} color='gold' />
                            <OrderableCell label='/XPM' align='left' sort='xpm'{...commonProps} color='gray' />
                        </>
                    ) : (
                        <>
                            <OrderableCell label='LVL' sort='lvl_at_ten'{...commonProps} color='white' />
                            <OrderableCell label='K' sort='kills_ten'{...commonProps} color='green' />
                            <OrderableCell label='D' sort='deaths_ten'{...commonProps} color='red' />
                            <OrderableCell label='A' sort='assists'{...commonProps} color='gray' />
                            <OrderableCell label='CS' sort='last_hits_ten'{...commonProps} color='white' />
                            <OrderableCell label='LANE EFF' color='gold' sort='lane_efficiency' {...commonProps} maxWidth='40px' />
                            <OrderableCell label='GPM' align='right' sort='gpm_ten'{...commonProps} color='gold' />
                            <OrderableCell label='/XPM' sort='xpm_ten'{...commonProps} color='gray' />
                        </>
                    )}
                    <OrderableCell label='HD' sort='hero_damage'{...commonProps} color='white' />

                    <OrderableCell label='TD' sort='tower_damage'{...commonProps} color='white' />

                    <OrderableCell label='Length' sort='duration'{...commonProps} color='white' />

                    <OrderableCell label='MMR' sort='mmr'{...commonProps} color='white' />

                </TableRow>
            </TableHead >
        setHeader(head)
    }, [props])

    return (
        <>
            {header}
        </>
    )
}
export default TableHeader