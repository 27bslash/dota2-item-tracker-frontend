import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { theme } from "../.."
import { OrderableCell } from "../table/tableHeader"
import { BenchMarksKeys } from "./bestGames"

const BestGamesTableHeader = (props: { benchmarkKeys: BenchMarksKeys[], sortByKey: (header: BenchMarksKeys, sortDirection: string) => void }) => {
    //'linear-gradient(340deg,rgb(54, 59, 61) 0%,rgb(58, 94, 116) 100%)'
    const gradString = `linear-gradient(340deg,${theme.palette.table.main} 0%,${theme.palette.primary.main} 100%)`
    return (
        <TableHead sx={{ padding: '0px !important' }}>
            <TableRow sx={{ background: gradString, maxHeight: '50px' }}>
                <TableCell padding="none" sx={{ textAlign: "center", color: 'white', fontWeight: '600', borderBottom: 'none', padding: '9px' }}>
                    <TableSortLabel hideSortIcon sx={{ color: 'white !important', fontSize: '1rem' }}>
                        PLAYER
                    </TableSortLabel>
                </TableCell>
                <th>
                    {/* icon header */}
                </th>
                <th>
                    {/* icon header */}
                </th>
                <TableCell padding="none" sx={{ textAlign: "center", color: 'white', fontWeight: 'bold', borderBottom: 'none' }}>
                    <TableSortLabel hideSortIcon sx={{ color: 'white !important', fontSize: '1rem' }}>
                        ROLE
                    </TableSortLabel>
                </TableCell>
                {props.benchmarkKeys.map((benchmarkKey, i: number) => {
                    let header = benchmarkKey.split('_').map((char: string) => char[0]).join('')
                    if (header.length === 4) {
                        header = header.replace('p', '')
                    } else if (benchmarkKey === 'lhten') {
                        header = "LH@10"
                    }
                    header = header.toUpperCase()
                    return <OrderableCell label={header} fontSize={'1rem'} border='none' align='center' color='white' className="hover-text" sort={benchmarkKey} onRequestSort={props.sortByKey}
                        key={i}></OrderableCell>
                })}
            </TableRow >
        </TableHead>
    )

}
export default BestGamesTableHeader;