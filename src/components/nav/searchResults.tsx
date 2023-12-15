/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import SearchResult from './searchResult';
import { Box, Typography } from '@mui/material';

interface SearchResultsProps {
    sortedHeroes: string[],
    sortedPlayers: string[],
    updateValue: () => void,
    navigatePage: (value: string) => void,
    highlightHero?: (data: number) => void

}
const SearchResults = ({ sortedHeroes, sortedPlayers, updateValue, navigatePage, highlightHero }: SearchResultsProps) => {

    const [combined, setCombined] = useState<number[]>([])
    const [searchResultIdx, setSearchResultIdx] = useState(0)
    const idxRef = useRef(searchResultIdx)

    const [targetList, setTargetList] = useState(0)
    const targetListRef = useRef(targetList)

    useEffect(() => {
        setCombined([])
        setCombined(prev => {
            return prev.concat(sortedHeroes.length, sortedPlayers.length)
        })
    }, [sortedHeroes, sortedPlayers])

    const handle = (e: { key: string; }) => {
        if (e.key === 'ArrowDown' && idxRef.current < combined[targetListRef.current]) {
            setSearchResultIdx(prev => prev + 1)
            idxRef.current += 1
            if (idxRef.current === combined[targetListRef.current]) {
                idxRef.current = 0
                setSearchResultIdx(0)
            }
        } else if (e.key === 'ArrowUp') {
            if (idxRef.current > 0) {
                setSearchResultIdx(prev => prev - 1)
                idxRef.current -= 1
            }
            else {
                idxRef.current = combined[targetListRef.current] - 1
                setSearchResultIdx(combined[targetListRef.current] - 1)
            }
        } else if (e.key === 'ArrowRight') {
            if (targetListRef.current === 0) {
                if (combined[0] - 1 >= idxRef.current) {
                    setTargetList(1)
                    targetListRef.current = 1
                }
            } else {
                if (combined[0] - 1 >= idxRef.current) {
                    setTargetList(0)
                    targetListRef.current = 0
                }
            }
        } else if (e.key === 'ArrowLeft') {
            if (targetListRef.current === 1) {
                if (combined[0] - 1 >= idxRef.current) {
                    setTargetList(0)
                    targetListRef.current = 0
                }
            } else {
                if (combined[1] - 1 >= idxRef.current) {
                    setTargetList(1)
                    targetListRef.current = 1
                }
            }
        } else if (e.key === 'Escape') {
            updateValue()
        } else if (e.key === 'Enter') {
            if (targetListRef.current === 0 && sortedHeroes[idxRef.current]) {
                const link = sortedHeroes[idxRef.current]
                navigatePage(`/hero/${link}`)
            } else {
                const link = sortedPlayers[idxRef.current]
                navigatePage(`/player/${link}`)
            }
        }
    }
    useEffect(() => {
        if (highlightHero && targetList === 0) {
            highlightHero(searchResultIdx)
        }
    }, [searchResultIdx])
    useEffect(() => {
        if (document.activeElement !== document.getElementById('search')) {
            return
        }
        window.addEventListener('keydown', handle)
        return () => {
            window.removeEventListener('keydown', handle)
        }
    }, [combined])

    const updateSearchIdx = (i: number, type: string) => {
        setSearchResultIdx(i)
        idxRef.current = i
        if (type === 'hero') {
            targetListRef.current = 0
            setTargetList(0)
        } else {
            targetListRef.current = 1
            setTargetList(1)
        }
    }
    return (
        <>
            <Box className="suggestions" bgcolor='primary.main' sx={{ 'z-index': 99 }}>
                {sortedHeroes.length > 0 && sortedHeroes.length < 30 &&
                    <div className="suggestions-left">
                        <Typography align='center' color='#1ebdad' variant='h6' className='suggestion-header'>Heroes</Typography>
                        {sortedHeroes.map((value, i) => {
                            return (<SearchResult value={value} updateSearchIdx={updateSearchIdx} type='hero' idx={i} key={i} selectedIdx={idxRef.current} list={0} targetList={targetList} />)
                        })}
                    </div>
                }
                {sortedPlayers.length > 0 &&
                    <div className="suggestions-right">
                        <Typography align='center' color='#1ebdad' variant='h6' className='suggestion-header'>Players</Typography>
                        {sortedPlayers.map((value, i) => {
                            return (
                                <SearchResult value={value} updateSearchIdx={updateSearchIdx} type='player' idx={i} key={i} selectedIdx={idxRef.current} list={1} targetList={targetList} />
                            )
                        })
                        }
                    </div >
                }
            </Box >

        </>
    )
}
export default SearchResults