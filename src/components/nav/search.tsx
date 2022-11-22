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
}
const NavSearch = (props: searchProps) => {
    const [value, setValue] = useState('')
    const [playerList, setPlayerList] = useState<string[]>([])
    const [sortedHeroes, setSortedHeroes] = useState<any[]>([])
    const [sortedPlayers, setSortedPlayers] = useState<string[]>([])
    useEffect(() => {
        (async () => {
            const res = await fetch("/files/accounts")
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
            const srtedPlayers = matchSorter(playerList, value, { threshold: matchSorter.rankings.ACRONYM }).slice(0, 15)
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
export default NavSearch