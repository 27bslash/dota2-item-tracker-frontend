import { Container } from "@mui/system";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ListContext } from "../../App";
import HomeButton from "./nav_button"
import NavSearch from './search';
interface NavProps {
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
            <Link to='/'>
                <HomeButton text='HOME' />
            </Link>
            <Link to='/chappie'>
                <HomeButton text='CHAPPIE' />
            </Link>
            <div className="search-container" style={{ width: '100%' }}>
                <NavSearch highlightHero={props.highlightHero} filterHeroes={props.filterHeroes} />
            </div>
        </div>
    )
}
export default Nav