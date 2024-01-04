/* eslint-disable no-unused-vars */
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { TableBody, TableRow, TableCell } from "@mui/material"
import TimeAgo from "javascript-time-ago"
import TableItems from "./tableItems/tableItems"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import stringSearch from './table_search/string_search';
import { theme } from "../.."
import DotaMatch from "../types/matchData"
import Hero from "../types/heroList"
import { PageHeroData } from "../types/heroData"
import Items from "../types/Item"
import { TableContextProvider } from "./tableContext"
import { RoleStrings } from "../home/home"
import { TableSearchResults } from "./table_search/types/tableSearchResult.types"
import { MouseEvent } from "react"
interface BodyProps {
    nameParam: string,
    type: string,
    page: number,
    totalMatchData: DotaMatch[],
    data: DotaMatch[],
    updateMatchData: (data: DotaMatch[], searchValue?: TableSearchResults, types?: string[]) => void,
    heroList: Hero[],
    playerList: string[],
    heroData: PageHeroData,
    itemData: Items | undefined,
    showStarter: boolean,
    role: RoleStrings
}
const CustomTableBody = (props: BodyProps) => {
    const timeAgo = new TimeAgo('en-US')
    const slice = props.data.slice(props.page * 10, props.page * 10 + 10)
    const handleClick = (event: MouseEvent, type: string, key: string, value: string) => {
        if (!event.ctrlKey) {
            props.updateMatchData(stringSearch(props.data, key, value))
        } else {
            const url = `/${type}/${value}`
            window.open(url)
        }

    }
    return (
        <TableBody>
            {slice
                .map((row, i: number) => {
                    const contextValues = {
                        row: row,
                        items: props.itemData, role: props.role,
                        heroData: props.heroData, heroName: row.hero,
                        heroList: props.heroList, playerList: props.playerList, filteredData: props.data, totalMatchData: props.totalMatchData, updateMatchData: props.updateMatchData,
                        showStarter: props.showStarter,
                    }
                    const currentTime = Date.now()
                    const timeDelta = currentTime - (row.unix_time * 1000)
                    // console.log(timeDelta)
                    // console.log(row.unix_time)
                    return (
                        <TableContextProvider key={row.id} value={contextValues}>
                            <TableRow sx={{ backgroundColor: i % 2 === 0 ? theme.palette.table.main : theme.palette.table.secondary }}>
                                {row.win ? (
                                    <TableCell sx={{ backgroundColor: 'green', padding: '4px' }}>
                                    </TableCell>) : (
                                    <TableCell sx={{ backgroundColor: 'red', padding: '4px' }}>
                                    </TableCell>
                                )}
                                <TableItems />
                                <TableCell sx={{ color: 'white', maxWidth: '100px', width: '100px' }}>
                                    {timeAgo.format(Date.now() - timeDelta)}

                                </TableCell>
                                <TableCell sx={{ color: 'white', maxWidth: '100px', overflowWrap: 'anywhere', width: '100px' }}>
                                    {props.type == 'hero' ? (
                                        <p className="hover-text" onClick={(e) => handleClick(e, 'player', 'name', row.name)}>
                                            {row.name}
                                        </p>
                                    ) : (
                                        <img key={i} onClick={(e) => handleClick(e, 'hero', 'hero', row.hero)} src={require(`../../images/minimap_icons/${row.hero}.jpg`).default} className='draft-icon' ></img>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <FontAwesomeIcon className='copy-match-id' icon={faCopy} color='white' onClick={() => navigator.clipboard.writeText(String(row.id))} />
                                    <a href={`https://www.opendota.com/matches/${row.id}`} target="_blank" rel='noreferrer'>
                                        <img style={{ marginLeft: '10px' }} src='https://www.opendota.com/assets/images/icons/icon-72x72.png' height='14px' alt='opendota link' />
                                    </a>
                                </TableCell>
                                <TableCell sx={{ color: 'white' }}>
                                    {/* {row.role} */}
                                    <div className='svg-icon  table-cell-outline' id={row.role ? row.role.replace(' ', '-') : 'None'} onClick={() => props.updateMatchData(stringSearch(props.data, 'role', row.role))}>

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
                                    {new Date(1000 * row.duration).toISOString().substring(11, 19)}
                                </TableCell>
                                <TableCell sx={{ color: 'white' }}>
                                    {row.mmr}
                                </TableCell>
                            </TableRow>
                        </TableContextProvider>
                    )
                })}

        </TableBody >
    )
}

export default CustomTableBody