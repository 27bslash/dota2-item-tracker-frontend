/* eslint-disable @typescript-eslint/no-var-requires */
import { Box, Typography } from "@mui/material"
import { cleanDecimal } from "../../utils/cleanDecimal"
import colourWins from "../../utils/colourWins"
import DotaMatch from "../types/matchData"
import { pickProps } from "./pickCounter"
import { usePickCounterContext } from "./pickCounterContext"
import { usePageContext } from "../stat_page/pageContext"

type PlayerPickProps = {
    matchKey: 'hero' | 'name'
}
export const PlayerPicks = ({ matchKey }: PlayerPickProps) => {
    const heroCount: Record<string, Record<string, { picks: number; win: number }>> = {}
    const { matchData } = usePickCounterContext()
    const { updateSearchResults } = usePageContext()

    for (const match of matchData) {
        if (heroCount[match[matchKey]] && heroCount[match[matchKey]][match['role']]) {
            heroCount[match[matchKey]][match['role']]['picks'] += 1
            if (match['win']) {
                heroCount[match[matchKey]][match['role']]['win'] += 1
            }
        } else {
            const o = { 'picks': 1, 'win': match['win'] }
            if (heroCount[match[matchKey]]) {
                heroCount[match[matchKey]][match['role']] = o
            } else {
                heroCount[match[matchKey]] = { [match['role']]: { 'picks': 1, 'win': match['win'] } }
            }
        }
    }
    Object.entries(heroCount).forEach((element) => {
        const pickDataObj = element[1]
        const roleKeys: string[] = Object.keys(pickDataObj)
        let temp = 0
        let highestRole = ''
        for (const roleKey of roleKeys) {
            const pickData = pickDataObj[roleKey]
            if (pickData['picks'] > temp) {
                temp = pickData['picks']
                highestRole = roleKey
            } else if (pickData['picks'] === temp) {
                if (pickDataObj[highestRole]['win'] < pickData['win']) {
                    highestRole = roleKey
                }
            }
        }
        for (const roleKey of roleKeys) {
            if (roleKey !== highestRole) {
                delete pickDataObj[roleKey]
            }
        }
    })

    let sortedData = Object.entries(heroCount)
        .sort(([, aValue], [, bValue]) => {
            // Compare first by picks
            const aRole = Object.keys(aValue)[0]
            const bRole = Object.keys(bValue)[0]
            if (aValue[aRole].picks !== bValue[bRole].picks) {
                return bValue[bRole].picks - aValue[aRole].picks
            }

            // If picks are equal, compare by wins
            return bValue[bRole].win - aValue[aRole].win;
        });
    sortedData = sortedData.filter(([, x]) => {
        const xR = Object.keys(x)[0]
        return x[xR]['picks'] > 1
    })
    sortedData = sortedData.slice(0, 8)
    const updateData = (targetVal: string, searchKey?: string, key?: 'items' | 'item_neutral' | 'starting_items' | 'name' | 'role' | 'hero' | 'abilities', role?: string) => {
        let filteredMatches
        if (targetVal && key) {
            filteredMatches = matchData.filter((x: DotaMatch) => x[matchKey] === targetVal && x['role'] === key)
        } else if (targetVal) {
            filteredMatches = matchData.filter((x: DotaMatch) => x[matchKey] === targetVal)
        } else {
            filteredMatches = matchData.filter((x: DotaMatch) => x['role'] === key)
        }
        // const searchRes = { role: { index: 0, 'matches': filteredMatches } }
        // updateMatchData(filteredMatches, searchRes)
        updateSearchResults(targetVal, searchKey, key)
    }
    return (

        <div className="flex boxContainer">
            {sortedData.map((x, i) => {
                const roleKey = Object.keys(x[1])[0]
                return (
                    <Box key={i} className="" bgcolor='primary.main' padding={1} margin={1} sx={{
                        width: '100px',
                    }} >
                        <div className="flex" style={{ justifyContent: 'space-around' }}>
                            {matchKey === 'hero' ? (
                                <img className='table-cell-outline' src={require(`../../images/minimap_icons/${x[0]}.jpg`).default} alt={`${x[0]} minimap icon`} onClick={() => updateData(x[0], 'hero', 'hero')}></img>
                            ) : (
                                <Typography className='hover-text' onClick={() => updateData(x[0], 'player', 'name')}>{x[0]}</Typography>
                            )}
                            <div className="svg-icon" id={roleKey.replace(' ', '-')} onClick={() => updateData(roleKey, 'role', 'role', roleKey)}></div>
                        </div>
                        <div className="flex" style={{ justifyContent: 'space-around' }}>
                            <Typography>{x[1][roleKey]['picks']}</Typography>
                            <Typography color={colourWins(x[1][roleKey]['win'] / x[1][roleKey]['picks'] * 100)}>
                                {cleanDecimal((x[1][roleKey]['win'] / x[1][roleKey]['picks'] * 100))}%</Typography>
                        </div>
                    </Box>
                )
            })}
        </div>
    )
}