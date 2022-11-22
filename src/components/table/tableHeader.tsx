import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { useEffect, useState } from 'react';


const OrderableCell = (props: any) => {
    const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
        props.onRequestSort(event, property);
    };
    return (
        <TableCell align={props.align}>
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
    useEffect(() => {
        let head =
            <TableHead >
                <TableRow >
                    <OrderableCell label='' sort='win' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} maxWidth='0px' >

                    </OrderableCell>
                    <TableCell padding="normal" sx={{ textAlign: "center", color: 'white', fontWeight: '600' }}>
                        <TableSortLabel hideSortIcon sx={{ color: 'white !important' }}>
                            ITEMS
                        </TableSortLabel>
                    </TableCell>
                    <OrderableCell label='Played' sort='unix_time' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />
                    <OrderableCell sx={{ minWidth: '30px' }} label='Player' sort='name' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />
                    <TableCell sx={{ minWidth: '20px' }}>
                        {/* copy match -id */}
                    </TableCell>
                    <TableCell align='left' sx={{ color: 'white', fontWeight: '600',  }}>
                        <TableSortLabel hideSortIcon sx={{ color: 'white !important' }} >
                            ROLE
                        </TableSortLabel>
                    </TableCell>
                    {!props.showStarter ? (
                        <>
                            <OrderableCell label='LVL' sort='lvl' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />
                            <OrderableCell label='K' sort='kills' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='green' />
                            <OrderableCell label='D' sort='deaths' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='red' />
                            <OrderableCell label='A' sort='assists' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='gray' />
                            <OrderableCell label='CS' sort='last_hits' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />
                            <OrderableCell label='NET' color='gold' sort='gold' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} />
                            <OrderableCell label='GPM' align='right' sort='gpm' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='gold' />
                            <OrderableCell label='/XPM' align='left' sort='xpm' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='gray' />
                        </>
                    ) : (
                        <>
                            <OrderableCell label='LVL' sort='lvl_at_ten' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />
                            <OrderableCell label='K' sort='kills_ten' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='green' />
                            <OrderableCell label='D' sort='deaths_ten' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='red' />
                            <OrderableCell label='A' sort='assists' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='gray' />
                            <OrderableCell label='CS' sort='last_hits_ten' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />
                            <OrderableCell label='LANE EFF' color='gold' sort='lane_efficiency' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} />
                            <OrderableCell label='GPM' sort='gpm_ten' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='gold' />
                            <OrderableCell label='/XPM' sort='xpm_ten' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='gray' />
                        </>
                    )}
                    <OrderableCell label='HD' sort='hero_damage' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />

                    <OrderableCell label='TD' sort='tower_damage' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />

                    <OrderableCell label='Length' sort='duration' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />

                    <OrderableCell label='MMR' sort='mmr' onRequestSort={props.onRequestSort} orderBy={props.orderBy} order={props.sortDirection} color='white' />

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