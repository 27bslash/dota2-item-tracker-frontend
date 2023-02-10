import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { TableBody, TableRow, TableCell } from "@mui/material"
import TimeAgo from "javascript-time-ago"
import TableItems from "./tableItems"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import stringSearch from './table_search/string_search';
interface BodyProps {
    nameParam: string,
    baseApiUrl: string,
    type: string,
    page: number,
    totalMatchData: object[],
    data: any[],
    updateMatchData: (data: object[]) => void,
    heroList: object[],
    heroData: any,
    itemData: object[],
    showStarter: boolean,
    role: string
}
const CustomTableBody = (props: BodyProps) => {
    const timeAgo = new TimeAgo('en-US')
    const slice = props.data.slice(props.page * 10, props.page * 10 + 10)
    const handleClick = (event: any) => {
        const PlayerName = event.target.innerText
        if (!event.ctrlKey) {
            props.updateMatchData(stringSearch(props.data, 'name', PlayerName))
        } else {
            const url = `/player/${PlayerName}`
            window.open(url)
        }
    }
    return (
        <TableBody>
            {slice
                .map((row: any, i: number) => {
                    const currentTime = Date.now()
                    const timeDelta = currentTime - (row.unix_time * 1000)
                    // console.log(timeDelta)
                    // console.log(row.unix_time)
                    return (
                        <TableRow key={i} style={i % 2 ? { background: "rgb(42, 50, 53)" } : { background: "#212729" }}>
                            {row.win ? (
                                <TableCell sx={{ backgroundColor: 'green', padding: '4px' }}>
                                </TableCell>) : (
                                <TableCell sx={{ backgroundColor: 'red', padding: '4px' }}>
                                </TableCell>
                            )}
                            <TableItems
                                row={row} items={props.itemData} role={props.role}
                                heroData={props.heroData}
                                heroList={props.heroList} filteredData={props.data} totalMatchData={props.totalMatchData} updateMatchData={props.updateMatchData}
                                showStarter={props.showStarter}>
                            </TableItems>
                            <TableCell sx={{ color: 'white', maxWidth: '100px', width: '100px' }}>
                                {timeAgo.format(Date.now() - timeDelta)}

                            </TableCell>
                            <TableCell sx={{ color: 'white', maxWidth: '100px', overflowWrap: 'anywhere', width: '100px' }}>
                                <p onClick={handleClick}>
                                    {row.name}
                                </p>
                            </TableCell>
                            <TableCell>
                                <FontAwesomeIcon className='copy-match-id' icon={faCopy} color='white' onClick={() => navigator.clipboard.writeText(row.id)} />
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>
                                {/* {row.role} */}
                                <div className='svg-icon' id={row.role ? row.role.replace(' ', '-') : 'None'} onClick={() => props.updateMatchData(stringSearch(props.data, 'role', row.role))}>

                                </div>
                            </TableCell>
                            {
                                !props.showStarter ? (
                                    <>
                                        <TableCell sx={{ color: 'white' }}>
                                            {row.lvl}
                                        </TableCell>
                                        <TableCell sx={{ color: 'green' }}>
                                            {row.kills}
                                        </TableCell><TableCell sx={{ color: 'red' }}>
                                            {row.deaths}
                                        </TableCell><TableCell sx={{ color: 'gray' }}>
                                            {row.assists}
                                        </TableCell><TableCell sx={{ color: 'white' }}>
                                            {row.last_hits}
                                        </TableCell><TableCell sx={{ color: 'gold' }}>
                                            {row.gold}
                                        </TableCell>
                                        <TableCell sx={{ color: 'gold' }} align='right'>
                                            {row.gpm}
                                        </TableCell><TableCell sx={{ color: 'gray' }}>
                                            /{row.xpm}
                                        </TableCell>
                                    </>
                                ) : (

                                    <>
                                        <TableCell sx={{ color: 'white' }}>
                                            {row.lvl_at_ten}
                                        </TableCell><TableCell sx={{ color: 'green' }}>
                                            {row.kills_ten}
                                        </TableCell>
                                        <TableCell sx={{ color: 'red' }}>
                                            {row.deaths_ten}
                                        </TableCell>
                                        <TableCell sx={{ color: 'gray' }}>
                                            {row.assists}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            {row.last_hits_ten}
                                        </TableCell>
                                        <TableCell sx={{ color: 'gold' }}>
                                            {row.lane_efficiency}%
                                        </TableCell>
                                        <TableCell sx={{ color: 'gold' }} align='right'>
                                            {row.gpm_ten}
                                        </TableCell>
                                        <TableCell sx={{ color: 'gray' }}>
                                            {row.xpm_ten}
                                        </TableCell>
                                    </>
                                )
                            }
                            <TableCell sx={{ color: 'white' }}>
                                {row.hero_damage}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>
                                {row.tower_damage}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>
                                {row.duration}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>
                                {row.mmr}
                            </TableCell>
                        </TableRow>
                    )
                })}
        </TableBody >
    )
}
export default CustomTableBody