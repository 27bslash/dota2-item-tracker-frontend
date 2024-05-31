/* eslint-disable no-unused-vars */
import Nav from '../nav/nav'
import CustomTable from '../table/table'
import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import TableSearch, { combineMatches } from '../table/table_search/table_search'
import { useParams } from 'react-router'
import heroSwitcher from '../../utils/heroSwitcher'
import { Link, useSearchParams } from 'react-router-dom'
import PickCounter from '../pick_counter/pickCounter'
import DotaMatch from '../types/matchData'
import { HeroPageTopSection } from '../hero_page/hero_page'
import { exists } from '../../utils/exists'
import { useHeroColor } from './hooks/heroColorHook'
import { useHeroData } from './hooks/heroDataHook'
import { useFetchAllData } from './hooks/fetchPageData'
import { StarterToggle } from './starterToggle'
import Hero from '../types/heroList'
import { TableSearchResults } from '../table/table_search/types/tableSearchResult.types'
import { RoleStrings } from '../home/home'
import PageContextProvider from './pageContext'

//  TODO
//  add chappie section ( probs not)
//  fix search style
//  lazyload images
interface pageProps {
    type: string
    heroList: Hero[]
    playerList: string[]
    palette?: string
}
export interface MatchDataAdj {
    updateMatchData: (
        data: DotaMatch[],
        searchValue?: TableSearchResults,
        types?: string[]
    ) => void
    matchData?: DotaMatch[]
    totalMatchData?: DotaMatch[]
    filteredData?: DotaMatch[]
}

const Page = ({ type, heroList, playerList }: pageProps) => {
    const [filteredData, setFilteredData] = useState<DotaMatch[]>([])
    const [totalMatchData, setTotalMatchData] = useState<DotaMatch[]>([])
    const [showStarter, setShowStarter] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [searchRes, setSearchRes] = useState<TableSearchResults | string>()
    const [searchResults, setSearchResults] = useState<TableSearchResults>()
    const params = useParams()
    const [query] = useSearchParams()
    const role = (query.get('role') || '') as RoleStrings
    const [Role, setRole] = useState(role)
    const [count, setCount] = useState(0)
    const nameParam = params['name'] ? heroSwitcher(params['name']) : ''
    const heroColor = useHeroColor(type, nameParam)
    const updateStarter = () => {
        setShowStarter((prev) => !prev)
    }

    document.title = heroSwitcher(nameParam)
    const {
        filteredMatchData,
        totalMatches,
        patch: patch_obj,
        itemData,
        totalPicks,
    } = useFetchAllData(type)
    useEffect(() => {
        if (filteredMatchData) {
            setFilteredData(
                params['patch']
                    ? filteredMatchData.filter(
                          (match) => match.patch === params['patch']
                      )
                    : filteredMatchData
            )
        }
        if (totalMatches) {
            setTotalMatchData(
                params['patch']
                    ? totalMatches.filter(
                          (match) => match.patch === params['patch']
                      )
                    : totalMatches
            )
            setCount(totalMatches.length)
        }
    }, [filteredMatchData, totalMatches])

    const scrollGameIntoView = (idx: number) => {
        let pageIdx = Math.ceil(idx / 10) - 1
        pageIdx = pageIdx >= 0 ? pageIdx : 0
        setPageNumber(pageIdx)
        const elPageIdx = idx - 10 * pageIdx
        const tbodys = document.querySelectorAll('tbody')
        const element = tbodys[1].children[elPageIdx]
        element.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(() => {
        if (Role) {
            const data = totalMatchData.filter(
                (match: { role: string }) => match.role === Role
            )
            setFilteredData(data)
            setCount(data.length)
        } else {
            setFilteredData(totalMatchData)
            setCount(totalMatchData.length)
        }
    }, [totalMatchData])

    const heroData = useHeroData(type, totalMatchData, Role, nameParam)
    type SearchResultKeyType =
        | 'items'
        | 'item_neutral'
        | 'starting_items'
        | 'name'
        | 'role'
        | 'hero'
        | 'abilities'
        | 'variant'

    const updateSearchResults = (
        searchObj?: TableSearchResults | string | number,
        searchResKey?: string,
        matchKey?: SearchResultKeyType,
        resultKey?: string
    ) => {
        let obj: TableSearchResults = {}
        if (!searchObj && !searchResKey) {
            setFilteredData(totalMatchData)
            setSearchResults(undefined)
            return
        }
        let newFilteredData: DotaMatch[] = []
        if (
            matchKey === 'variant' &&
            searchResKey &&
            resultKey &&
            typeof searchObj === 'number'
        ) {
            console.log(matchKey, searchObj, searchResKey)
            newFilteredData = totalMatchData.filter(
                (x) => x[matchKey] === searchObj
            )
            obj = {
                [searchResKey]: {
                    [searchObj]: {
                        index: 0,
                        matches: newFilteredData,
                        displayKey: resultKey,
                    },
                },
            }
        }
        if (typeof searchObj === 'string' && matchKey && searchResKey) {
            if (['name', 'role', 'hero', 'item_neutral'].includes(matchKey)) {
                newFilteredData = totalMatchData.filter(
                    (x) => x[matchKey] === searchObj
                )
                console.log(searchObj, newFilteredData, {
                    [matchKey]: {
                        [searchObj]: {
                            index: 0,
                            matches: newFilteredData,
                        },
                    },
                })
                obj = {
                    [searchResKey]: {
                        [searchObj]: {
                            index: 0,
                            matches: newFilteredData,
                        },
                    },
                }
            } else if (matchKey === 'items' || matchKey === 'abilities') {
                newFilteredData = totalMatchData.filter(
                    (x) =>
                        x[matchKey] &&
                        x[matchKey]
                            .map((item) => item['key'])
                            .includes(searchObj)
                )
                obj = {
                    [searchResKey]: {
                        [searchObj]: {
                            index: 0,
                            matches: newFilteredData,
                        },
                    },
                }
            }
        } else if (typeof searchObj === 'object' && !matchKey) {
            newFilteredData = totalMatchData.filter((x) =>
                combineMatches(searchObj).flat().includes(x.id)
            )
            obj = searchObj
        }
        setSearchResults(obj)
        setFilteredData(newFilteredData)
        setCount(newFilteredData.length)
    }
    // useEffect(() => {
    //     if (searchRes) updateSearchResults(searchRes)
    // }, [searchRes]);
    const updateMatchData = (
        data: DotaMatch[],
        searchValue?: TableSearchResults,
        types?: string[]
    ) => {
        // setMatchData(data)
        if (!data.length) return
        setFilteredData(data)
        // updateFilteredData(data)
        setCount(data.length)
        if (searchValue) {
            setSearchResults(searchValue)
        } else {
            setSearchResults(undefined)
        }
    }
    const updateRole = (role: RoleStrings) => {
        setRole(role)
        if (role) {
            setFilteredData([...filteredData].filter((x) => x.role === role))
        }
    }
    const filterByPatch = () => {
        const patchFilteredData = filteredData.filter((match) => {
            return match['patch'] === patch_obj['patch']
        })
        setTotalMatchData(patchFilteredData)
        setFilteredData(patchFilteredData)
        setCount(totalMatchData.length)
    }

    const commonProps = {
        heroData: heroData,
        nameParam: nameParam,
        totalMatchData: totalMatchData,
        filteredData: filteredData,
        itemData: itemData,
        role: Role,
        updateMatchData: updateMatchData,
        type: type,
        heroList: heroList,
        playerList: playerList,
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
            )
        }
        return null
    }
    const renderFilterByPatch = () => {
        const oldPatchGameList = totalMatchData.filter(
            (x) =>
                patch_obj['patch_timestamp'] > 0 &&
                x.patch !== patch_obj['patch']
        )
        return (
            !!oldPatchGameList.length &&
            oldPatchGameList.length !== totalMatchData.length && (
                <Typography
                    variant="h5"
                    color="white"
                    align="center"
                    onClick={() => filterByPatch()}
                >
                    <Link
                        to={`/${patch_obj['patch']}/hero/${heroSwitcher(
                            nameParam
                        )}`}
                    >
                        Filter Matches By {patch_obj['patch']}
                    </Link>
                </Typography>
            )
        )
    }
    const renderPageContent = () => {
        if (!exists(heroColor)) return null
        const contextValues = {
            filteredData: filteredData,
            totalMatchData: totalMatchData,
            searchRes: searchResults,
            updateSearchResults: updateSearchResults,
            nameParam: nameParam,
            itemData: itemData,
            heroData: heroData,
            heroList: heroList,
            playerList: playerList,
        }
        return (
            <PageContextProvider value={contextValues}>
                <div className="stat-page">
                    <Nav playerList={playerList} heroList={heroList} />
                    {renderFilterByPatch()}
                    {renderHeroPageTopSection()}
                    <div style={{ width: '100%', minHeight: '53px' }}>
                        {totalPicks && (
                            <PickCounter
                                {...commonProps}
                                heroColor={heroColor}
                                matchData={totalMatchData}
                                count={count}
                                totalPicks={totalPicks}
                                updateRole={updateRole}
                            />
                        )}
                    </div>
                    <div className="flex">
                        <StarterToggle updateStarter={updateStarter} />
                        {filteredData && (
                            <TableSearch
                                {...commonProps}
                                disabled={
                                    filteredData.length === 0 ||
                                    !itemData ||
                                    !heroList
                                }
                                heroName={nameParam}
                                itemData={itemData}
                            />
                        )}
                    </div>
                    <CustomTable
                        {...commonProps}
                        count={count}
                        pageNumber={pageNumber}
                        heroList={heroList}
                        playerList={playerList}
                        showStarter={showStarter}
                    />
                </div>
            </PageContextProvider>
        )
    }

    return <div className="page">{renderPageContent()}</div>
}

export default Page
