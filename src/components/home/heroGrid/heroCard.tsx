import { Link, useParams } from 'react-router-dom'
import colourWins from '../../../utils/colourWins'
import heroSwitcher from '../../../utils/heroSwitcher'
import { Typography } from '@mui/material'

interface HeroCardProps {
    heroName: string
    role: string
    searching: boolean
    highlight?: number
    idx: number
    stats: { [key: string]: number }
    sortByTrend: () => void
}
function HeroCard({
    stats,
    heroName,
    role,
    searching,
    idx,
    highlight,
    sortByTrend,
}: HeroCardProps) {
    const imgName = heroSwitcher(heroName)
    // console.log(heroName, heroName)
    // console.log(stats)
    const patchParam = useParams()
    const patchString = patchParam['patch'] ? `/${patchParam['patch']}` : ''
    const heroHighlight = idx === highlight && searching ? 'hero-highlight' : ''
    const width = heroHighlight ? '148' : '145'
    // const width = heroHighlight ? '113' : '110'
    const img = `https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${imgName}.png?v=5926546`
    const heroname = heroName.replace(/\s/g, '_')
    let link = `${patchString}/hero/${heroname}`
    if (role && stats['picks'] > 0) {
        link = `${patchString}/hero/${heroname}?role=${role.replace('_', '')}`
    }
    return (
        <div
            className={`hero-cell ${heroHighlight}`}
            style={{ height: '106px' }}
        >
            <Link to={link}>
                <img
                    alt={heroName}
                    className="hero-img"
                    src={img}
                    width={width}
                />
            </Link>
            {!searching && !!stats && (
                <div className="win-stats" style={{ width, maxWidth: width }}>
                    <Typography variant="body2" fontSize={14} className="picks">
                        {stats.picks}
                        {stats.trend >= 0 ? (
                            <span
                                className="trend"
                                onClick={() => sortByTrend()}
                                style={{ color: 'green' }}
                            >
                                +{stats.trend}
                            </span>
                        ) : (
                            <span
                                className="trend"
                                onClick={() => sortByTrend()}
                                style={{ color: 'red' }}
                            >
                                {stats.trend}
                            </span>
                        )}
                    </Typography>
                    <Typography variant="body2" fontSize={14} className="wins">
                        {stats.wins}
                    </Typography>
                    <Typography
                        variant="body2"
                        fontSize={14}
                        className="winrate"
                        style={{ color: colourWins(stats.winrate) }}
                    >
                        {stats.winrate.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" fontSize={14} className="bans">
                        {stats.bans}
                    </Typography>
                </div>
            )}
        </div>
    )
}
export default HeroCard
