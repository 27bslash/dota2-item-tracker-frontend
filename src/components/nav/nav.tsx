import { Container } from "@mui/system";
import { Link } from "react-router-dom";
import HomeButton from "./nav_button"
import NavSearch from './search';
interface NavProps {
    heroList: Hero[],
    playerList: any,
    highlightHero?: (idx: number) => void
    filterHeroes?: (heroList: Hero[]) => void
    baseApiUrl: string,
}
interface Hero {
    name: string,
    id: number
}
const Nav = (props: NavProps) => {
    return (
        <div className="navbar">
            <Link to='/'>
                <HomeButton text='HOME' />
            </Link>
            <Link to='/chappie'>
                <HomeButton text='CHAPPIE' />
            </Link>
            <div className="search-container" style={{ width: '100%' }}>
                <NavSearch baseApiUrl={props.baseApiUrl} highlightHero={props.highlightHero} filterHeroes={props.filterHeroes} heroList={props.heroList} playerList={props.playerList} />
            </div>
        </div>
    )
}
export default Nav