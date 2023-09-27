import { useEffect, useState, useRef } from 'react';
import SearchResult from './searchResult';
import { Box, Typography } from '@mui/material';

interface SearchResultsProps {
    heroList: { name: string, id: number }[],
    playerList: string[],
    sortedHeroes: { name: string, id: number }[],
    sortedPlayers: string[],
    updateValue: () => void,
    navigatePage: (value: string) => void,
    highlightHero?: (data: number) => void

}
const SearchResults = (props: SearchResultsProps) => {

    const [combined, setCombined] = useState<number[]>([])
    const [searchResultIdx, setSearchResultIdx] = useState(0)
    const idxRef = useRef(searchResultIdx)

    const [targetList, setTargetList] = useState(0)
    const targetListRef = useRef(targetList)

    useEffect(() => {
        setCombined([])
        setCombined(prev => {
            return prev.concat(props.sortedHeroes.length, props.sortedPlayers.length)
        })
    }, [props])

    const handle = (e: any) => {
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
            props.updateValue()
        } else if (e.key === 'Enter') {
            if (targetListRef.current === 0 && props.sortedHeroes[idxRef.current]) {
                const link = props.sortedHeroes[idxRef.current].name
                props.navigatePage(`/hero/${link}`)
            } else {
                const link = props.sortedPlayers[idxRef.current]
                props.navigatePage(`/player/${link}`)
            }
        }
    }
    useEffect(() => {
        if (props.highlightHero && targetList === 0) {
            props.highlightHero(searchResultIdx)
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
    }, [props, combined])

    const updateSearchIdx = (i: number, list: string) => {
        setSearchResultIdx(i)
        idxRef.current = i
        if (list === 'hero') {
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
                {props.sortedHeroes.length > 0 &&
                    <div className="suggestions-left">
                        <Typography align='center' color='#1ebdad' variant='h6' className='suggestion-header'>Heroes</Typography>
                        {props.sortedHeroes.map((value, i) => {

                            return (<SearchResult value={value} updateSearchIdx={updateSearchIdx} type='hero' idx={i} key={i} selectedidx={idxRef.current} list={0} targetList={targetList} />)
                        })}
                    </div>
                }
                {props.sortedPlayers.length > 0 &&
                    <div className="suggestions-right">
                        <Typography align='center' color='#1ebdad' variant='h6' className='suggestion-header'>Players</Typography>
                        {props.sortedPlayers.map((value, i) => {
                            // console.log(value)

                            return (
                                <SearchResult value={value} updateSearchIdx={updateSearchIdx} type='player' idx={i} key={i} selectedidx={idxRef.current} list={1} targetList={targetList} />
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