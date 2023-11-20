import { useEffect } from 'react';
import { useState } from 'react';
import heroSwitcher from '../../utils/heroSwitcher';
import stringSearch from '../table/table_search/string_search';
import RoleCounter from './roleCounter';
import DotaMatch from '../types/matchData';
import { TableSearchResults } from '../table/table_search/types/tableSearchResult.types';
import PickStats from '../types/pickStats';
import { RoleStrings } from '../home/home';
import { SearchResultsText } from './tableSearchResults/tableSearchResults';
import { HeroPicks } from './heroPicks';
import { PlayerPicks } from './playerPicks';

export interface pickProps {
    matchData: DotaMatch[],
    filteredData: DotaMatch[],
    nameParam: string,
    role: RoleStrings,
    updateMatchData: (data: DotaMatch[], searchRes?: TableSearchResults, types?: string[]) => void,
    updateRole: (role: RoleStrings) => void,
    type: string,
    totalPicks: PickStats,
    count: number
    heroColor: string,
    searchRes?: TableSearchResults
}
const PickCounter = (props: pickProps) => {
    const name = props.nameParam
    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState(props.searchRes)
    console.log(props.totalPicks)
    useEffect(() => {
        if (props.searchRes) {
            setSearching(true)
            setSearchResults(props.searchRes)
        } else {
            setSearching(false)
        }
    }, [props.filteredData])

    const roleSearch = (data: DotaMatch[], role: RoleStrings) => {
        if (data.length) {
            const m = stringSearch(data, 'role', role)
            props.updateRole(role)
            props.updateMatchData(m)
        }
    }
    const reset = () => {
        props.updateMatchData(props.matchData)
        setSearchResults(undefined)
        setSearching(false)
        props.updateRole('')
    }
    return (
        <>
            {!!props.matchData.length &&
                <div className="pick-counter" style={{ color: 'white' }}>
                    {searching && searchResults ? (
                        <SearchResultsText data={props.matchData} updateMatchData={props.updateMatchData} searchRes={searchResults} reset={reset} />
                    ) : (
                        props.type === 'hero' && props.heroColor &&
                        <>
                            <TotalPickCounter type={props.type} reset={reset} color={props.heroColor} updateMatchData={props.updateMatchData} role={props.role} totalPicks={props.totalPicks} name={props.nameParam} />
                            <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter>
                        </>
                    )}
                    {props.type === 'player' && !searching &&
                        <>
                            <TotalPickCounter type={props.type} updateMatchData={props.updateMatchData}
                                reset={reset} role={props.role} name={props.nameParam} data={props.matchData} />
                            {/* <RoleCounter totalPicks={props.totalPicks} matchData={props.matchData} role={props.role} roleSearch={roleSearch}></RoleCounter> */}
                        </>
                    }
                </div>
            }
        </>
    )
}
export const BoldName = (props: { reset: () => void; color: string; name: string; }) => {
    return <p onClick={() => props.reset()} className='bold-name' id='hero-name' style={{ 'color': props.color, textTransform: 'capitalize' }}>
        <strong >{heroSwitcher(props.name).replace(/_/g, ' ')}</strong>
    </p>
}

type TotalPickCounterProps = {
    type: string,
    data?: DotaMatch[],
    role: RoleStrings,
    totalPicks?: PickStats,
    name: string,
    color?: string,
    reset: () => void,
    updateMatchData: pickProps['updateMatchData']
}
const TotalPickCounter = ({ role, type, totalPicks, data, name, color, reset, updateMatchData }: TotalPickCounterProps) => {
    const base = role && type === 'hero' ? totalPicks![role] : totalPicks
    return (
        <>
            {type === 'hero' ? (
                color && base && (
                    <HeroPicks role={role} name={name} base={base} color={color} reset={reset} />)
            ) : (
                data && (
                    <PlayerPicks name={name} reset={reset} data={data} base={data.length} updateMatchData={updateMatchData} />)
            )
            }
        </>
    )
}



// const ItemCounter = (props: any) => {
//     const { items, handleClick } = props
//     const keys = sortByMatches(items)
//     return (
//         <>
//             <h4>Items: </h4>
//             <SearchResultText data={items} handleClick={handleClick} filteredData={keys} type={'items'} />
//         </>
//     )
// }
export default PickCounter