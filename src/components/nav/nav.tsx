/* eslint-disable no-unused-vars */
import { useParams } from "react-router";
import Hero from "../types/heroList";
import HomeButton from "./nav_button"
import NavSearch from './search';
interface NavProps {
    heroList: Hero[],
    playerList: string[],
    highlightHero?: (idx: number) => void
    filterHeroes?: (heroList: string[]) => void
    filteredByButton?: string[]
}

const Nav = ({ highlightHero, filterHeroes, filteredByButton, heroList, playerList }: NavProps) => {
    const params = useParams()
    const patchString = params['patch'] ? params['patch'] : ''
    return (
        <div className="navbar">
            <HomeButton text='HOME' link={`/${patchString}`} />
            {/* <HomeButton text='CHAPPIE' link='/chappie' /> */}
            <div className="search-container" style={{ width: '100%' }}>
                <NavSearch highlightHero={highlightHero} filterHeroes={filterHeroes} filteredByButton={filteredByButton} heroList={heroList} playerList={playerList} />
            </div>
        </div>
    )
}
export default Nav