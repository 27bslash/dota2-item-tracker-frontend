/* eslint-disable no-unused-vars */
import Nav from '../nav/nav';
import CustomTable from '../table/table';
import { createContext, useEffect, useState } from 'react';
import { FormControlLabel, styled, Switch, SwitchProps, Typography } from '@mui/material';
import TableSearch from '../table/table_search/table_search';
import { useParams } from 'react-router';
import heroSwitcher from '../../utils/heroSwitcher';
import { useSearchParams } from 'react-router-dom';
import PickCounter from '../pick_counter/pickCounter';
import DotaMatch from '../types/matchData';
import { HeroPageTopSection } from '../hero_page/hero_page';
import { exists } from '../../utils/exists';
import { useHeroColor } from './hooks/heroColorHook';
import { useHeroData } from './hooks/heroDataHook';
import { useFetchAllData } from './hooks/fetchPageData';
import { StarterToggle } from './starterToggle';
import Hero from '../types/heroList';
import { TableSearchResults } from '../table/table_search/types/tableSearchResult.types';
import { RoleStrings } from '../home/home';


//  TODO
//  add chappie section ( probs not)
//  fix search style
//  lazyload images

interface pageProps {
    type: string,
    heroList: Hero[],
    playerList: string[],
    palette?: string,
}
export interface MatchDataAdj {
    updateMatchData: (data: DotaMatch[], searchValue?: TableSearchResults, types?: string[]) => void,
    matchData?: DotaMatch[],
    totalMatchData?: DotaMatch[],
    filteredData?: DotaMatch[]
}

const Page = ({ type, heroList, playerList }: pageProps) => {
    const [filteredData, setFilteredData] = useState<DotaMatch[]>([])
    const [totalMatchData, setTotalMatchData] = useState<DotaMatch[]>([])
    const [showStarter, setShowStarter] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [searchRes, setSearchRes] = useState<TableSearchResults>()
    const params = useParams()
    const [query] = useSearchParams();
    const role = (query.get('role') || '') as RoleStrings
    const [Role, setRole] = useState(role)
    const [count, setCount] = useState(0)
    const nameParam = params['name'] ? heroSwitcher(params['name']) : ''
    const heroColor = useHeroColor(type, nameParam)
    const updateStarter = () => {
        setShowStarter(prev => !prev)
    }

    document.title = heroSwitcher(nameParam);
    const { filteredMatchData, totalMatches, patch, itemData, totalPicks } = useFetchAllData(type)
    useEffect(() => {
        if (filteredMatchData) {
            setFilteredData(filteredMatchData)
        }
        if (totalMatches) {
            setTotalMatchData(totalMatches)
            setCount(totalMatches.length)
        }
    }, [filteredMatchData, totalMatches])

    const scrollGameIntoView = (idx: number) => {
        const pageIdx = Math.ceil(idx / 10) - 1
        setPageNumber(pageIdx)
        const elPageIdx = idx - (10 * (pageIdx))
        const tbodys = document.querySelectorAll('tbody')
        const element = tbodys[1].children[elPageIdx]
        element.scrollIntoView({ behavior: 'smooth' })

    }
    useEffect(() => {
        if (Role) {
            const data = totalMatchData.filter((match: { role: string }) => match.role === Role)
            setFilteredData(data)
            setCount(data.length)
        } else {
            setFilteredData(totalMatchData)
            setCount(totalMatchData.length)
        }
    }, [totalMatchData])

    const heroData = useHeroData(type, totalMatchData, Role, nameParam)

    const updateMatchData = (data: DotaMatch[], searchValue?: TableSearchResults, types?: string[]) => {
        // setMatchData(data) ]
        if (!data.length) return
        setFilteredData(data)
        // updateFilteredData(data)
        setCount(data.length)
        if (searchValue) {
            setSearchRes(searchValue)
        } else {
            setSearchRes(undefined)
        }
    }
    const updateRole = (role: RoleStrings) => {
        setRole(role)
        if (role) {
            setFilteredData([...filteredData].filter((x) => x.role === role))
        }
    }
    const filterByPatch = () => {
        const patchFilteredData = filteredData.filter((match) => match['patch'] === patch['patch'])
        setTotalMatchData(patchFilteredData)
        setFilteredData(patchFilteredData)
        setCount(totalMatchData.length)
    }

    const commonProps = {
        heroData: heroData, nameParam: nameParam,
        totalMatchData: totalMatchData, filteredData: filteredData,
        itemData: itemData, role: Role, updateMatchData: updateMatchData,
        type: type, heroList: heroList, playerList: playerList
    }
    const renderHeroPageTopSection = () => {
        if (type === 'hero') {
            return (
                <HeroPageTopSection
                    {...commonProps}
                    updatePageNumber={scrollGameIntoView}
                    updateRole={updateRole}
                    totalPicks={totalPicks}
                />
            );
        }
        return null;
    };
    const renderFilterByPatch = () => {
        return (
            patch &&
            totalMatchData.find((match) => match && match['unix_time'] <= patch['patch_timestamp']) && (
                <Typography variant='h5' color='white' align='center'
                    onClick={() => filterByPatch()}
                >
                    Filter matches by new patch
                </Typography>
            )
        );
    };
    const renderPageContent = () => {
        if (!exists(heroColor)) return null
        return (
            <div>
                <Nav playerList={playerList} heroList={heroList} />
                {renderFilterByPatch()}
                {renderHeroPageTopSection()}
                <div className="flex" style={{ 'width': '100%', minHeight: '53px' }}>
                    {totalPicks &&
                        <PickCounter
                            {...commonProps}
                            heroColor={heroColor} matchData={totalMatchData} searchRes={searchRes}
                            count={count} totalPicks={totalPicks} updateRole={updateRole} />}
                </div>
                <div className="flex">
                    <StarterToggle updateStarter={updateStarter} />
                    {filteredData &&
                        <TableSearch {...commonProps}
                            disabled={filteredData.length === 0 || !itemData || !heroList}
                            heroName={nameParam}
                            itemData={itemData} />
                    }
                </div>
                <CustomTable
                    {...commonProps}
                    count={count}
                    pageNumber={pageNumber}
                    heroList={heroList}
                    showStarter={showStarter} />
            </div>
        );

    };

    return (
        <div className="page">{renderPageContent()}</div>
    )
}








export default Page
