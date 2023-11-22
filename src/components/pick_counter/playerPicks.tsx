/* eslint-disable @typescript-eslint/no-var-requires */
import { Box, Typography } from "@mui/material"
import { cleanDecimal } from "../../utils/cleanDecimal"
import colourWins from "../../utils/colourWins"
import DotaMatch from "../types/matchData"
import { pickProps } from "./pickCounter"
import { usePickCounterContext } from "./pickCounterContext"

type PlayerPickProps = {
    base: number
}
export const PlayerPicks = ({ base }: PlayerPickProps) => {
    const heroCount: Record<string, Record<string, { picks: number; win: number }>> = {}
    const { nameParam, matchData, reset, updateMatchData } = usePickCounterContext()
    for (const match of matchData) {
        if (heroCount[match['hero']] && heroCount[match['hero']][match['role']]) {
            heroCount[match['hero']][match['role']]['picks'] += 1
            if (match['win']) {
                heroCount[match['hero']][match['role']]['win'] += 1
            }
        } else {
            const o = { 'picks': 1, 'win': match['win'] }
            if (heroCount[match['hero']]) {
                heroCount[match['hero']][match['role']] = o
            } else {
                heroCount[match['hero']] = { [match['role']]: { 'picks': 1, 'win': match['win'] } }
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
    sortedData = sortedData.slice(0, 4)
    const updateData = (hero?: string, role?: string) => {
        let filteredMatches
        if (hero && role) {
            filteredMatches = matchData.filter((x: DotaMatch) => x['hero'] === hero && x['role'] === role)
        } else if (hero) {
            filteredMatches = matchData.filter((x: DotaMatch) => x['hero'] === hero)
        } else {
            filteredMatches = matchData.filter((x: DotaMatch) => x['role'] === role)
        }
        updateMatchData(filteredMatches)
    }
    return (
        <div className="player-pick-counter">
            <div className="flex" style={{ width: '100%' }}>
                <p className='bold-name' onClick={() => reset()}>{nameParam} has played {base} times. He mostly plays: </p>
            </div>
            <div className="flex boxContainer">
                {sortedData.map((x, i) => {
                    const roleKey = Object.keys(x[1])[0]
                    return (
                        <Box key={i} className="" bgcolor='primary.main' padding={1} margin={1} sx={{
                            width: '100px', '&:hover': {
                                cursor: 'pointer'
                            }
                        }} >
                            <div className="flex" style={{ justifyContent: 'space-around' }}>
                                <img src={require(`../../images/minimap_icons/${x[0]}.jpg`).default} alt={`${x[0]} minimap icon`} onClick={() => updateData(x[0])}></img>
                                <div className="svg-icon" id={roleKey.replace(' ', '-')} onClick={() => updateData(undefined, roleKey)}></div>
                            </div>
                            <div className="flex" style={{ justifyContent: 'space-around' }} onClick={() => updateData(x[0], roleKey)}>
                                <Typography>{x[1][roleKey]['picks']}</Typography>
                                <Typography color={colourWins(x[1][roleKey]['win'] / x[1][roleKey]['picks'] * 100)}>
                                    {cleanDecimal((x[1][roleKey]['win'] / x[1][roleKey]['picks'] * 100))}%</Typography>
                            </div>
                        </Box>
                    )
                })}
            </div>
        </div>
    )
}