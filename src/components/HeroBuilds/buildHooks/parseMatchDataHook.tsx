import { useEffect, useState } from "react"
import { BuildProps, NonProDataType } from "../builds/build"
import { useFetchData } from "./fetchMatchDataHook"
import PickStats from "../../types/pickStats"
import { RoleStrings } from "../../home/home"
const calc_common_roles = (props: any, pickData?: Record<string, { [key: string]: number }>, threshold?: number) => {
    const picks: PickStats = pickData || props.picks || props['picks']
    threshold = threshold || 0.1
    const combinedRoles = ['Support', 'Roaming']
    let totalPicks = 0
    for (const o of Object.entries(picks)) {
        totalPicks += o[1]['picks']
    }
    totalPicks = totalPicks || props.picks.picks
    const roles: string[] = []
    const sorted = Object.entries(picks).filter((x) => typeof (x[1]) === 'object').sort((a, b) => b[1]['picks'] - a[1]['picks'])
    let combinedRole = null
    for (const [i, k] of sorted.entries()) {
        const role = k[0] as RoleStrings
        if (role) {
            let totalRolePicks = picks[role].picks
            if (!combinedRole && combinedRoles.includes(role)) {
                const otherRole = combinedRoles.find((pos) => pos !== role && pos in picks)
                if (otherRole) {
                    const otherRolePicks = otherRole ? picks[otherRole as RoleStrings].picks : 0
                    totalRolePicks = picks[role].picks + otherRolePicks
                    combinedRole = true
                }
            }
            if (i === 0) {
                roles.push(role)
            } else {
                const perc = totalRolePicks / totalPicks
                if (perc > threshold) {
                    roles.push(role)
                }
            }
        }
    }
    return roles
}
export const useParseMatchData = (proData: boolean, totalMatchData: any, heroName: string, props: any, threshold?: number) => {
    const nonProData = useFetchData(heroName)
    const [data, setData] = useState<NonProDataType[]>()
    const [filteredData, setFilteredData] = useState<{ [k: string]: NonProDataType[] }>()
    const [displayedRoles, setDisplayedRoles] = useState<string[]>([])
    useEffect(() => {
        if (props.picks) {
            console.log('runnn')
            setDisplayedRoles(calc_common_roles(props, undefined, threshold))
        }
    }, [props.picks])
    const combinedRoles = ['Support', 'Roaming']
    useEffect(() => {
        if (proData && totalMatchData) {
            setData(totalMatchData)
            const roleCount: { [key: string]: { [key: string]: number, } } = {}
            for (const match of totalMatchData) {
                if (roleCount[match['role']]) {
                    roleCount[match['role']]['picks'] += 1
                    roleCount[match['role']]['wins'] += 1
                } else {
                    roleCount[match['role']] = {
                        'picks': 1, 'wins': match['win']
                    }
                }
            }
            setDisplayedRoles(calc_common_roles(props, roleCount))
        } else {
            setData(nonProData)
        }
    }, [proData, nonProData, totalMatchData])
    useEffect(() => {
        if (props.role && data) {
            const filtered = data.filter(((match) => match.role === props.role))
            const o = { [props.role]: filtered }
            setFilteredData(o)
        } else if (data) {
            const tempObject: { [role: string]: NonProDataType[] } = {}
            for (const role of displayedRoles) {
                const roleFiltered = data.filter(((match) => match.role === role || (combinedRoles.includes(role) && combinedRoles.includes(match.role))))
                tempObject[role] = roleFiltered
            }
            setFilteredData(tempObject)
        }
    }, [props.role, data])
    return filteredData
}