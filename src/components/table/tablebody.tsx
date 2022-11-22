import { faCopy, fas } from "@fortawesome/free-solid-svg-icons"
import { TableBody, TableRow, TableCell, Typography } from "@mui/material"
import TimeAgo from "javascript-time-ago"
import { useEffect, useState } from "react"
import TableItems from "./tableItems"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import stringSearch from './table_search/string_search';
import itemSearch from "./table_search/item_search"
interface BodyProps {
    nameParam: string,
    baseApiUrl: string,
    type: string,
    page: number,
    totalMatchData: object[],
    data: any[],
    updateMatchData: (data: object[]) => void,
    heroList: object[],
    itemData: object[],
    showStarter: boolean,
    role: string
}
const CustomTableBody = (props: BodyProps) => {
    const timeAgo = new TimeAgo('en-US')
    const [heroData, setHeroData] = useState<any>(new Set())
    const [visited, setVisited] = useState<any>(new Set())
    const [total, setTotal] = useState<any>([])
    const [itemData, setItemData] = useState([])
    const [abilityColors, setAbilityColors] = useState([])
    // console.log(props)
    useEffect(() => {
        (async () => {
            const hColors = await fetch(`${props.baseApiUrl}files/ability_colours`)
            const colorJson = await hColors.json()
            setAbilityColors(colorJson)
        })()
    }, [props.data])
    useEffect(() => {
        (async () => {
            const sett: Set<string> = new Set()

            if (props.type !== 'player') {
                const hData = await fetch(`${props.baseApiUrl}files/hero-data/${props.nameParam}`)
                const hJson = await hData.json()
                setHeroData([{ [props.nameParam]: hJson }])
            } else {
                for (let match of props.data) {
                    sett.add(match['hero'])
                }
                setVisited(sett)
            }
        }
        )()
    }, [props.data])
    async function getHeroData(hero: string) {
        const hData = await fetch(`${props.baseApiUrl}files/hero-data/${hero}`)
        const hJson = await hData.json()
        setHeroData((prev: any) => [...prev, { [hero]: hJson }])
    }
    useEffect(() => {
        for (let hero of visited) {
            if (!total.includes(hero)) {
                getHeroData(hero)
                setTotal((prev: any) => [...prev, hero])
            }
        }
    }, [visited])
    const slice = props.data.slice(props.page * 10, props.page * 10 + 10)
    console.log(slice)

    const handleClick = (event: any) => {
        console.log(event.target.innerText)
        const PlayerName = event.target.innerText
        if (!event.ctrlKey) {
            // updateMatchData()
            props.updateMatchData(stringSearch(props.data, 'name', PlayerName))
        } else {
            // return <Link to={{ 'pathname': "https://example.zendesk.com/hc/en-us/articles/123456789-Privacy-Policies" }} target="_blank" />
            const url = `/player/${PlayerName}`
            const w = window.open(url)
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
                                heroData={heroData} heroName={row['hero']}
                                heroList={props.heroList} filteredData={props.data} totalMatchData={props.totalMatchData} updateMatchData={props.updateMatchData}
                                abilityColors={abilityColors} showStarter={props.showStarter}>
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