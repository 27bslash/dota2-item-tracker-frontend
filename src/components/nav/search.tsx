/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */

import TextField from '@mui/material/TextField';
import { useState, useEffect, useRef } from 'react';
import { matchSorter } from 'match-sorter'
import SearchResults from './searchResults';
import { Box } from '@mui/material';
import Hero from '../types/heroList';
import { useFilterHeroes } from './filterHeroes/filterHeroesHook';
import { useFilterPlayers } from './filterPlayers/filterPlayersHook';

interface searchProps {
    filterHeroes?: (data: string[]) => void,
    filteredByButton?: string[],
    heroList: Hero[],
    playerList: string[],
    highlightHero?: (data: number) => void
}
const NavSearch = ({ heroList, playerList, filterHeroes, filteredByButton, highlightHero }: searchProps) => {
    const [value, setValue] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const searchRef = useRef<HTMLInputElement | null>(null)
    // const data = 'data'
    const updateValue = () => {
        setValue('')
        setShowSearchResults(false)
    }
    const navigatePage = (value: string) => {
        const link = value.replace(/\s/g, '_')
        window.location.href = `${link}`
    }
    const sortedHeroes = useFilterHeroes(heroList, filteredByButton, value)
    const sortedPlayers = useFilterPlayers(playerList, value)
    useEffect(() => {
        if (filterHeroes) {
            if (value.length > 1 && !!sortedPlayers.length || sortedHeroes.length !== heroList.length && !filteredByButton?.length) {
                setShowSearchResults(true)
            } else {
                setShowSearchResults(false)
            }
            filterHeroes(sortedHeroes)
        } else {
            !!sortedPlayers.length || !!sortedHeroes.length
            setShowSearchResults(!!sortedPlayers.length || sortedHeroes.length !== heroList.length)
        }
    }, [sortedHeroes])
    useEffect(() => {
        window.addEventListener('keydown', autoFocus, false);
        return () => window.removeEventListener('keydown', autoFocus, false);
    }, [])
    const autoFocus = (e: KeyboardEvent) => {
        const keyCodes = [13, 27, 40, 38, 39, 37, 9];
        // focus search on keypress
        if (
            !window.location.pathname.includes("player") &&
            !window.location.pathname.includes("hero")
        ) {
            if (!keyCodes.includes(e.keyCode)) {
                // search.focus();
                if (searchRef.current) {
                    searchRef.current.focus()
                }
                // document.querySelector(".suggestions").classList.add("hide");
            }
        }
    };
    return (
        <Box className='nav-search' bgcolor={'primary.main'}>
            <TextField
                sx={{
                    '& .MuiInput-underline:before': { borderBottomColor: 'primary.main' },
                    '& .MuiInput-underline:after': { borderBottomColor: '#1976d2' },
                }}
                id="search"
                placeholder='Search...'
                label=""
                inputRef={searchRef}
                disabled={false}
                variant="standard"
                value={value}
                onChange={(e) => setValue(e.target.value)} />
            {showSearchResults &&
                <SearchResults highlightHero={highlightHero} updateValue={updateValue} navigatePage={navigatePage} sortedHeroes={sortedHeroes} sortedPlayers={sortedPlayers} />
            }
        </Box>
    )

}

export default NavSearch