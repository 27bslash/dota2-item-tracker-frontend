import TextField from '@mui/material/TextField';
import { useState, useEffect, useRef } from 'react';
import { matchSorter } from 'match-sorter'
import SearchResults from './searchResults';
import { Box } from '@mui/material';
interface heroList {
    name: string,
    id: number
}
interface searchProps {
    filterHeroes?: (data: any) => void,
    heroList: heroList[],
    playerList: []
    highlightHero?: (data: number) => void
}
const NavSearch = (props: searchProps) => {
    const [value, setValue] = useState('')
    const [sortedHeroes, setSortedHeroes] = useState<any[]>([])
    const [sortedPlayers, setSortedPlayers] = useState<string[]>([])
    const searchRef = useRef<HTMLInputElement | null>(null)
    // const data = 'data'
    const updateValue = () => {
        setValue('')
    }
    const navigatePage = (value: string) => {
        const link = value.replace(/\s/g, '_')
        window.location.href = `${link}`
    }
    useEffect(() => {
        if (value.length > 1) {
            const copy = [...props.heroList]
            const sorted = matchSorter(copy.map((x: any) => {
                x.name = x.name.replace(/-|_/g, ' ')
                return x
            }), value, { keys: [{ threshold: matchSorter.rankings.CONTAINS, key: 'name' }] }).slice(0, 8)
            const acronyms = acronymFinder(copy, value)
            const filteredHeroes = acronyms.concat(sorted)
            const srtedPlayers = filterPlayers(props.playerList, value).slice(0, 8)
            setSortedHeroes(filteredHeroes)
            setSortedPlayers(srtedPlayers)
            if (props.filterHeroes) { props.filterHeroes(filteredHeroes) }
        } else {
            setSortedHeroes([])
            setSortedPlayers([])
            if (props.filterHeroes) props.filterHeroes(props.heroList)

        }
    }, [value])
    useEffect(() => {
        window.addEventListener('keydown', autoFocus, false);
        return () => window.removeEventListener('keydown', autoFocus, false);
    }, [])
    const acronymFinder = (heroList: heroList[], target: string) => {
        const acronyms = []
        for (let hero of heroList) {
            const split = hero['name'].split(' ')
            if (split.length === 1) {
                continue
            }
            const acronym = split[0][0] + split[1][0]
            if (acronym === target) {
                acronyms.push(hero)
            }
        }
        return acronyms
    }
    const autoFocus = (e: KeyboardEvent) => {
        let keyCodes = [13, 27, 40, 38, 39, 37, 9];
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
            {(!!sortedPlayers.length || !!sortedHeroes.length) &&
                <SearchResults heroList={props.heroList} highlightHero={props.highlightHero} updateValue={updateValue} navigatePage={navigatePage} playerList={props.playerList} sortedHeroes={sortedHeroes} sortedPlayers={sortedPlayers} />
            }
        </Box>
    )

}
export const filterPlayers = (accounts: string[], value: string) => {
    const values = substituteLettersForNumbers(value);
    const result: string[][] = [];
    values.forEach((value) => {
        const srtedPlayers = matchSorter(accounts, value, {
            threshold: matchSorter.rankings.ACRONYM,
        });
        result.push(srtedPlayers);
    });
    return result.flat()
}
const substituteLettersForNumbers = (string: string) => {
    const allLetterCombos = new Set([string])
    const letterPairs: { [key: string]: string } = { a: "4", o: "0", 1: "i", 5: "s" };
    const strArr: string[] = string.split("");
    strArr.forEach((char, i: number) => {
        const keys = Object.keys(letterPairs);
        const values = Object.values(letterPairs);
        let temp = string.split("")
        if (keys.includes(char)) {
            const newChar = letterPairs[char];
            temp[i] = newChar;
            allLetterCombos.add(temp.join(""));
        } else if (values.includes(char)) {
            const newChar = keys.find((key) => letterPairs[key] === char);
            if (newChar) temp[i] = newChar;
            allLetterCombos.add(temp.join(""));
        }
    })
    return allLetterCombos;
};
export default NavSearch