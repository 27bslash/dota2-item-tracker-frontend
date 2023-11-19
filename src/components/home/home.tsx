import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Nav from '../nav/nav';
import ControlPanel from './control';
import { baseApiUrl } from '../../App';
import { theme } from '../..';
import { cleanDecimal } from '../../utils/cleanDecimal';
import GridContainer from './heroGrid/gridContainer';
import HeroCard from './heroGrid/heroCard';
import Hero from '../types/heroList';


const SortTitle = ({ role, sort }: { sort: string, role?: string }) => {
    const displayRole = role ? role.replace(/_/, '') : ''
    return (
        sort !== 'winrate' ?
            (
                <Typography className='sort-title' variant="h3" gutterBottom>
                    Most {displayRole} {sort}
                </Typography>
            ) : (
                <Typography className='sort-title' variant="h3" gutterBottom>
                    highest {displayRole} {sort}
                </Typography>
            )
    )
}
type HomeProps = {
    heroList: Hero[],
    playerList: string[]
}
function Home({ heroList, playerList }: HomeProps) {
    const [winStats, setWinStats] = useState<any[]>();
    const [filteredHeroes, setFilteredHeroes] = useState<string[]>();
    const [filteredByButton, setfilteredByButton] = useState<string[]>()
    const [roleFilter, setRoleFilter] = useState('');
    const [searching, setSearching] = useState(false);
    const [highlight, setHighlight] = useState<number>();
    const [sort, setSearchVal] = useState('');
    useEffect(() => {
        document.title = 'Dota2 Item Tracker';
        (async () => {
            const req = await fetch(`${baseApiUrl}/files/win-stats`);
            let json = await req.json();
            json = json.sort((a: any, b: any) => a.hero.localeCompare(b.hero));
            setWinStats(json);
        })();
    }, []);
    // const sortF = (a: any, b: any) => {
    //     const n1 = a['name']
    //     const n2 = b['name']
    // console.log(n1, n2)
    //     return n1.localeCompare(n2)
    // }
    useEffect(() => {
        if (!heroList.length) {
            return;
        }
        const m = heroList.map((hero: any) => hero.name.replace(/\s/g, '_'));
        const hList = m.sort((a: any, b: any) => a.localeCompare(b));
        setFilteredHeroes(hList);
    }, [heroList]);
    const filterHeroes = (list: string[]) => {
        const newList = list.map((x) => x.replace(/\s/g, '_'));
        setFilteredHeroes(newList);
        if (!filteredByButton && newList.length !== heroList.length) {
            setSearching(true);
        } else if (!filteredByButton) {
            const hList = newList.sort((a, b) => a.localeCompare(b));
            setFilteredHeroes(hList);
            setSearching(false);
        } else if (filteredByButton.length === list.length) {
            setSearching(false)
        } else if (filteredByButton && filteredByButton.length !== list.length) {
            setSearching(true)
        }
    };
    const sortHeroes = (list: string[], search: string, role?: string) => {
        setFilteredHeroes(list);
        setfilteredByButton(list)
        setSearchVal(search);
        setRoleFilter('');
        if (role) {
            const roleF = `${role}_`;
            setRoleFilter(roleF);
        }
    };
    let className = '';
    let width = '1800px';
    if (searching) {
        className = 'right';
        width = '1000px';
    }
    const highlightHero = (idx: number) => {
        setHighlight(idx);
    };
    let pickStats: any = null;
    document.body.style.background = theme.palette.background.default;
    theme.palette.primary.main = '#1d5455';
    theme.palette.secondary.main = '#486869';
    return (
        <div className="home">
            <Nav filterHeroes={filterHeroes} filteredByButton={filteredByButton} heroList={heroList} playerList={playerList} highlightHero={highlightHero} />
            {filteredHeroes && winStats &&
                <ControlPanel sortHeroes={sortHeroes} winStats={winStats} />
            }
            {sort && !searching
                && <SortTitle role={roleFilter} sort={sort} />}
            <GridContainer className={className} width={width}>
                {filteredHeroes && (
                    filteredHeroes.map((heroName: string, i: number) => {
                        if (heroName === 'anti_mage') heroName = 'anti-mage';
                        if (winStats) {
                            const stats = winStats.filter((x) => x.hero === heroName.replace(/\s/g, '_'));
                            const picks = stats[0][`${roleFilter}picks`] || 0;
                            const wins = stats[0][`${roleFilter}wins`] || 0;
                            const { bans } = stats[0];
                            const winrate = picks ? cleanDecimal(((wins / picks) * 100)) : 0;
                            pickStats = {
                                picks, wins, bans, winrate,
                            };
                        }
                        return (
                            <Grid key={i} className={`grid-item-${className}`} item>
                                <HeroCard
                                    highlight={highlight}
                                    idx={i}
                                    key={i}
                                    searching={searching}
                                    heroName={heroName}
                                    stats={pickStats}
                                    role={roleFilter}
                                />
                            </Grid>
                        );
                    })
                )}
            </GridContainer>
        </div>
    );
}


export default Home;