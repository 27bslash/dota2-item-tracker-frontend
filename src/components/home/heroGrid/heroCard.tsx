import { Link } from "react-router-dom";
import colourWins from "../../../utils/colourWins";
import heroSwitcher from "../../../utils/heroSwitcher";

interface HeroCardProps {
    heroName: string, role: string, searching: boolean, highlight?: number, idx: number, stats: { picks: number, wins: number, bans: number, winrate: string | number },
}
function HeroCard({ stats, heroName, role, searching, idx, highlight, }: HeroCardProps) {
    const imgName = heroSwitcher(heroName);
    // console.log(heroName, heroName)
    // console.log(stats)
    const heroHighlight = idx === highlight && searching ? 'hero-highlight' : '';
    // const width = heroHighlight ? '130' : '125';
    const width = heroHighlight ? '113' : '110'
    const img = `https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${imgName}.png?v=5926546`;
    const heroname = heroName.replace(/\s/g, '_');

    let link = `/hero/${heroname}`;
    if (role) {
        link = `/hero/${heroname}?role=${role.replace('_', '')}`;
    }
    return (
        <Link to={link}>
            <div className={`hero-cell ${heroHighlight}`}>
                <img alt={heroName} className="hero-img" src={img} width={width} />
                {!searching && !!stats
                    && (
                        <div className="win-stats" style={{ width, maxWidth: width }}>
                            <span className="picks">{stats.picks}</span>
                            <span className="wins">{stats.wins}</span>
                            <span className="winrate" style={{ color: colourWins(stats.winrate) }}>
                                {stats.winrate}
                                %
                            </span>
                            <span className="bans">{stats.bans}</span>
                        </div>
                    )}
            </div>
        </Link>
    )
}
export default HeroCard