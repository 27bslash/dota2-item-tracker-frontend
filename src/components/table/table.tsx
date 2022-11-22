import {  TableContainer, TableRow, Table, TableFooter, TablePagination, CircularProgress } from "@mui/material"
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions"
import { useEffect, useState } from "react"
import TableHeader from "./tableHeader"
import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'
import CustomTableBody from "./tablebody"
interface TableProps {
    showStarter: boolean,
    heroList: any,
    itemData: any,
    nameParam: string,
    type: string,
    filteredData: object[],
    count: number,
    updateMatchData: (data: object[]) => void,
    totalMatchData: object[],
    role: string
}
TimeAgo.addDefaultLocale(en)
const CustomTable = (props: TableProps) => {
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(props.count)
    const [orderBy, setOrderBy] = useState('unix_time')
    const [sortDirection, setSortDirection] = useState('desc')
    const { filteredData, totalMatchData } = props

    useEffect(() => {
        setCount(props.count)
        if (page * 10 > props.count) {
            // console.log(page)
            setPage(0)
        }
    }, [props.count])

    // const updateData = async (length: number, skip: number) => {
    //     if (length === -1) length = totalPicks['picks']
    //     const req = await fetch(`../${props.type}/${props.nameParam}/react-test?skip=${skip}&length=${length}`)
    //     let json = await req.json()
    //     props.updateMatchData(json['data'])
    // }
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    // const handleChangeRowsPerPage = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    // ) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };


    // useEffect(() => {
    //     // console.log('dataa,')
    //     if (filteredData.length > 0) {
    //         console.log(filteredData)
    //         // setData(filteredData)
    //     } else {

    //     }
    // }, [filteredData])

    // useEffect(() => {
    //     (async () => {
    //         const d = await fetch(`../${props.type}/${props.nameParam}/react-test`)
    //         let j = await d.json()
    //         setTotalMatchData(j['data'])
    //         const chunked = chunkData(j['data'])
    //         setFilteredData(chunked[page])
    //     })()
    // }, [data])

    // const chunkData = (data: any) => {
    //     const res = [];
    //     for (let i = 0; i < data.length; i += rowsPerPage) {
    //         const chunk = data.slice(i, i + rowsPerPage);
    //         res.push(chunk);
    //     }
    //     return res;
    // }




    const handleRequestSort = (property: any) => {
        const isAsc = sortDirection === 'asc';
        const ern = isAsc ? 'desc' : 'asc'
        setSortDirection(ern);
        setOrderBy(property);
    };
    const sortTable = () => {
        // console.log(filteredData)
        const sortedData = filteredData.sort((a: any, b: any) => {
            if (typeof a[orderBy] === "string") {
                return sortDirection === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy])
            } else {
                return sortDirection === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]
            }
        })
        return sortedData
    }
    return (
        <div className="item-table">
            {(!Boolean(filteredData.length)) &&
                <CircularProgress sx={{ width: '100px', 'position': 'absolute' }} />
            }
            {(!!filteredData.length) &&
                <>
                    <TableContainer>
                        <Table padding="none">
                            <TableHeader
                                sortDirection={sortDirection}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                showStarter={props.showStarter}
                            />
                            <CustomTableBody data={sortTable()} type={props.type} page={page} nameParam={props.nameParam}
                                totalMatchData={totalMatchData} heroList={props.heroList} itemData={props.itemData}
                                showStarter={props.showStarter} role={props.role} updateMatchData={props.updateMatchData}></CustomTableBody>
                            <TableFooter >
                                <TableRow>
                                    <TablePagination sx={{ color: 'white' }}
                                        rowsPerPageOptions={[10]}
                                        colSpan={3}
                                        count={count}
                                        rowsPerPage={10}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        ActionsComponent={TablePaginationActions}
                                        showFirstButton
                                        showLastButton
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </>
            }
        </div >
    )
}

export default CustomTable