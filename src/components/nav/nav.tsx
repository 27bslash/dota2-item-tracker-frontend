import HomeButton from "./nav_button"
import NavSearch from './search';
interface NavProps {
    heroList: Hero[],
    playerList: any,
    highlightHero?: (idx: number) => void
    filterHeroes?: (heroList: Hero[]) => void
}
interface Hero {
    name: string,
    id: number
}
const Nav = (props: NavProps) => {
    return (
        <div className="navbar">
            <HomeButton text='HOME' link='/' />
            <HomeButton text='CHAPPIE' link='/chappie' />
            <div className="search-container" style={{ width: '100%' }}>
                <NavSearch highlightHero={props.highlightHero} filterHeroes={props.filterHeroes} heroList={props.heroList} playerList={props.playerList} />
            </div>
        </div>
    )
}
export default Nav