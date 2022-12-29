import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { matchSorter } from 'match-sorter'
import SearchResults from './searchResults';
interface heroList {
    name: string,
    id: number
}
interface searchProps {
    filterHeroes?: (data: any) => void,
    heroList: heroList[],
    highlightHero?: (data: number) => void
    baseApiUrl: string,
}
const NavSearch = (props: searchProps) => {
    const [value, setValue] = useState('')
    const [playerList, setPlayerList] = useState<string[]>([])
    const [sortedHeroes, setSortedHeroes] = useState<any[]>([])
    const [sortedPlayers, setSortedPlayers] = useState<string[]>([])
    useEffect(() => {
        (async () => {
            const res = await fetch(`${props.baseApiUrl}/files/accounts`)
            const playerlst = await res.json()
            setPlayerList(playerlst)
        })()
    }, [])
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
            }), value, { keys: [{ threshold: matchSorter.rankings.ACRONYM, key: 'name' }] }).slice(0, 15).reverse()

            const srtedPlayers = filterPlayers(playerList, value).slice(0, 15)
            setSortedHeroes(sorted)
            setSortedPlayers(srtedPlayers)
            if (props.filterHeroes) { props.filterHeroes(sorted) }
        } else {
            setSortedHeroes([])
            setSortedPlayers([])
            if (props.filterHeroes) props.filterHeroes(props.heroList)

        }
    }, [value])
    return (
        <div className='nav-search'>
            <TextField
                id="search"
                placeholder='Search...'
                label=""
                disabled={false}
                variant="standard"
                value={value}
                onChange={(e) => setValue(e.target.value)} />
            {(!!sortedPlayers.length || !!sortedHeroes.length) &&
                <SearchResults heroList={props.heroList} highlightHero={props.highlightHero} updateValue={updateValue} navigatePage={navigatePage} playerList={playerList} sortedHeroes={sortedHeroes} sortedPlayers={sortedPlayers} />
            }
        </div>
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
    const allLetterCombos = [string];
    const letterPairs: { [key: string]: string } = { a: "4", o: "0", 1: "i", 5: "s" };
    const strArr: string[] = string.split("");
    strArr.forEach((char, i: number) => {
        const keys = Object.keys(letterPairs);
        const values = Object.values(letterPairs);
        if (keys.includes(char)) {
            const newChar = letterPairs[char];
            strArr[i] = newChar;
            allLetterCombos.push(strArr.join(""));
        } else if (values.includes(char)) {
            const newChar = keys.find((key) => letterPairs[key] === char);
            if (newChar) strArr[i] = newChar;
            allLetterCombos.push(strArr.join(""));
        }
    })
    return allLetterCombos;
};
export default NavSearch