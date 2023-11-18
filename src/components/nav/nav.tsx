/* eslint-disable no-unused-vars */
import Hero from "../types/heroList";
import HomeButton from "./nav_button"
import NavSearch from './search';
interface NavProps {
    heroList: Hero[],
    playerList: string[],
    highlightHero?: (idx: number) => void
    filterHeroes?: (heroList: string[]) => void
}

const Nav = ({ highlightHero, filterHeroes, heroList, playerList }: NavProps) => {
    return (
        <div className="navbar">
            <HomeButton text='HOME' link='/' />
            {/* <HomeButton text='CHAPPIE' link='/chappie' /> */}
            <div className="search-container" style={{ width: '100%' }}>
                <NavSearch highlightHero={highlightHero} filterHeroes={filterHeroes} heroList={heroList} playerList={playerList} />
            </div>
        </div>
    )
}
export default Nav